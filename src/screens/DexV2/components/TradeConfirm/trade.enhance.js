import React from 'react';
import { MESSAGES, PRV_ID } from '@screens/Dex/constants';
import { COINS } from '@src/constants';
import { ExHandler } from '@services/exception';
import accountService from '@services/wallet/accountService';
import { deposit as depositAPI, trade as tradeAPI } from '@services/api/pdefi';
import { MAX_PDEX_TRADE_STEPS } from '@screens/DexV2/constants';
import { apiTradePKyber } from '@screens/DexV2';
import convertUtil from '@utils/convert';
import { useDispatch } from 'react-redux';
import { actionAddFollowToken } from '@src/redux/actions/token';
import { actionLogEvent } from '@src/screens/Performance';
import { getSlippagePercent } from '@screens/DexV2/components/Trade/TradeV2/Trade.utils';
import { logEvent, Events } from '@services/firebase';
import BigNumber from 'bignumber.js';

const withTrade = (WrappedComp) => (props) => {
  const [error, setError] = React.useState('');
  const [trading, setTrading] = React.useState(false);
  const {
    inputValue,
    inputToken,
    outputToken,
    minimumAmount,
    fee,
    feeToken,
    onTradeSuccess,
    wallet,
    account,
    isErc20,
    quote,
    nativeToken,

    tradingFee,
    slippage,
    priority
  } = props;

  const dispatch = useDispatch();

  let depositFee =
    (fee / MAX_PDEX_TRADE_STEPS) * (MAX_PDEX_TRADE_STEPS - 1);

  const deposit = () => {
    let type = 1;
    if (isErc20 && !quote?.crossTrade) {
      if (quote.protocol.toLowerCase() === 'kyber') {
        type = 2;
      } else {
        type = 4;
      }
    }

    // deposit in PDEX, dont add network fee
    // deposit in PKYPER | UNISWAP, add network fee
    if (tradingFee && quote?.protocol && quote?.protocol !== 'PDex') {
      depositFee += tradingFee;
    }

    return depositAPI({
      tokenId: inputToken.id,
      amount: inputValue,
      networkFee: depositFee,
      networkFeeTokenId: feeToken.id,
      receiverAddress: account.PaymentAddress,
      type,
      priority,
    });
  };

  const trade = async () => {
    let prvFee = 0;
    let tokenFee = 0;
    let spendingPRV = false;
    let spendingCoin = false;
    if (trading) {
      return;
    }
    /**
    *  Log event when user initiade trade
    */
    const start = new Date().getTime();
    logEvent(Events.pdex_place_order, {
      ticker1: inputToken?.symbol || '',
      ticker2: outputToken?.symbol || '',
      amount1: inputValue/ Math.pow(10, inputToken?.pDecimals || 9),
      amount2: minimumAmount/ Math.pow(10, outputToken?.pDecimals || 9),
      amount_of_swap_usd: convertUtil.toNumber(inputValue/ Math.pow(10, inputToken?.pDecimals || 9), true) * (nativeToken?.priceUsd || 0),
      priority
    });

    setTrading(true);
    setError('');
    try {
      if (inputToken?.id === PRV_ID) {
        prvFee = fee;
        tokenFee = fee;
      } else {
        prvFee = feeToken.id === COINS.PRV_ID ? fee : 0;
        tokenFee = prvFee > 0 ? 0 : fee;
      }

      dispatch(actionLogEvent({ desc: 'TRADE START CHECK PENDING COIN' }));
      if (inputToken?.id === PRV_ID) {
        spendingCoin = spendingPRV = await accountService.hasSpendingCoins(
          account,
          wallet,
          inputValue + prvFee + tradingFee,
        );
      } else {
        if (prvFee) {
          spendingPRV = await accountService.hasSpendingCoins(
            account,
            wallet,
            prvFee + tradingFee,
          );
          spendingCoin = await accountService.hasSpendingCoins(
            account,
            wallet,
            inputValue,
            inputToken.id,
          );
        } else {
          spendingCoin = await accountService.hasSpendingCoins(
            account,
            wallet,
            inputValue + tokenFee,
            inputToken.id,
          );
        }
      }

      if (spendingCoin || spendingPRV) {
        logEvent(Events.alert_previous_tx);
        return setError(MESSAGES.PENDING_TRANSACTIONS);
      }
      dispatch(actionLogEvent({ desc: 'TRADE START DEPOSIT' }));
      const depositObject = await deposit();
      let serverFee =
        (tokenFee / MAX_PDEX_TRADE_STEPS) * (MAX_PDEX_TRADE_STEPS - 1);
      if (feeToken.id === PRV_ID && inputToken?.id === PRV_ID) {
        serverFee += tradingFee;
      }
      const tokenNetworkFee = tokenFee / MAX_PDEX_TRADE_STEPS;
      const prvNetworkFee = prvFee / MAX_PDEX_TRADE_STEPS;
      let prvAmount =
        (prvFee / MAX_PDEX_TRADE_STEPS) * (MAX_PDEX_TRADE_STEPS - 1) + tradingFee;

      if (isErc20 && !quote?.crossTrade) {
        dispatch(actionLogEvent({ desc: 'TRADE START TRADE PKYPER' }));
        await tradeKyber(depositObject.depositId);
      } else {
        const payload = {
          depositId: depositObject.depositId,
          buyTokenId: outputToken.id,
          buyAmount: minimumAmount,
          buyExpectedAmount: minimumAmount,
          tradingFee: tradingFee,
          minimumAmount,
        };
        dispatch(actionLogEvent({ desc: 'TRADE START TRADE PDEX' }));
        await tradeAPI(payload);
      }
      dispatch(actionLogEvent({ desc: 'TRADE START SEND COIN TO WALLET' }));
      const result = await accountService.createAndSendToken(
        account,
        wallet,
        depositObject.walletAddress,
        inputValue + serverFee,
        inputToken.id,
        prvNetworkFee,
        tokenNetworkFee,
        prvAmount,
      );
      dispatch(actionLogEvent({ desc: 'TRADE END SEND COIN TO WALLET' }));
      if (result && result.txId) {
        /**
         *  Log event when user successfully swap coins
         */
        const end = new Date().getTime();
        logEvent(Events.pdex_made_swap, {
          ticker1: inputToken.symbol || '',
          ticker2: outputToken.symbol || '',
          amount1: inputValue/ Math.pow(10, inputToken.pDecimals),
          amount2: minimumAmount/ Math.pow(10, outputToken.pDecimals),
          amount_of_swap_usd: convertUtil.toNumber(inputValue/ Math.pow(10, inputToken.pDecimals), true) * (nativeToken?.priceUsd || 0),
          priority,
          orderId: result.txId,
          total_minutes: (end - start)/60000,
        });
        onTradeSuccess(true);
      }
    } catch (error) {
      if (error) {
        /**
         *  Log event when user failed transaction
         */
        const end = new Date().getTime();
        logEvent(Events.pdex_swap_failed, {
          ticker1: inputToken?.symbol || '',
          ticker2: outputToken?.symbol || '',
          amount1: inputValue/ Math.pow(10, inputToken?.pDecimals || 9),
          amount2: minimumAmount/ Math.pow(10, outputToken?.pDecimals || 9),
          amount_of_swap_usd: convertUtil.toNumber(inputValue/ Math.pow(10, inputToken?.pDecimals || 9), true) * (nativeToken?.priceUsd || 0),
          priority,
          total_minutes: (end - start)/60000,
        });
        dispatch(actionLogEvent({
          desc: `Trade has error: ${error?.message || error} with Code: ${error?.code}`
        }));
      }
      const errorMessage = new ExHandler(error).getMessage(MESSAGES.TRADE_ERROR);
      if (errorMessage === MESSAGES.API_POOL_ERROR) {
        logEvent(Events.alert_network_busy);
      }
      setError(errorMessage);
    } finally {
      setTrading(false);
      dispatch(actionAddFollowToken(inputToken?.id));
      dispatch(actionAddFollowToken(outputToken?.id));
    }
  };

  const tradeKyber = async (depositId) => {
    const originalValue = convertUtil.toDecimals(inputValue, inputToken);
    const expectAmount  = new BigNumber(quote?.expectAmount || '0')
      .multipliedBy(getSlippagePercent(slippage))
      .integerValue(BigNumber.ROUND_FLOOR)
      .toFixed();

    const maxAmountOut = new BigNumber(quote?.maxAmountOut || '0')
      .multipliedBy(getSlippagePercent(slippage))
      .integerValue(BigNumber.ROUND_FLOOR)
      .toNumber();

    const data = {
      SrcTokens: inputToken?.address,
      SrcQties: originalValue,
      DestTokens: outputToken?.address,
      DappAddress: quote?.dAppAddress,
      DepositId: depositId,
      ExpectAmount: expectAmount, // RatioTrade / slippage ? slippage * ratio trade
      MaxAmountOut: maxAmountOut, // AmountOutput / slippage ? slippage * amount out
      Fee: tradingFee,
      FeeLevel: priority.toLowerCase()
    };
    await apiTradePKyber(data);
  };

  return (
    <WrappedComp
      {...{
        ...props,
        trading,
        onTrade: trade,
        error,
      }}
    />
  );
};

export default withTrade;
