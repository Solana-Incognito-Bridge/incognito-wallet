import React, { useState } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import {
  getPTokenList,
  actionRemoveFollowToken,
} from '@src/redux/actions/token';
import { actionReloadFollowingToken } from '@src/redux/actions/account';
import { CONSTANT_COMMONS } from '@src/constants';
import { useNavigation } from 'react-navigation-hooks';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import routeNames from '@src/router/routeNames';
import { Toast } from '@src/components/core';
import { isGettingBalance as isGettingBalanceSelector } from '@src/redux/selectors/shared';
import { accountSeleclor } from '@src/redux/selectors';
import accountService from '@services/wallet/accountService';
import formatUtil from '@utils/format';

export const WalletContext = React.createContext({});

const enhance = (WrappedComp) => (props) => {
  const wallet = useSelector((state) => state?.wallet);
  const isGettingBalance = useSelector(isGettingBalanceSelector);
  const [rewards, setRewards] = useState(null);
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    isReloading: false,
  });
  const { isReloading } = state;
  const navigation = useNavigation();
  const getFollowingToken = async (shouldLoadBalance = true) => {
    try {
      await setState({ isReloading: true });
      await dispatch(actionReloadFollowingToken(shouldLoadBalance));
    } catch (e) {
      throw new CustomError(ErrorCode.home_load_following_token_failed, {
        rawError: e,
      });
    } finally {
      await setState({ isReloading: false });
    }
  };

  const account = useSelector(accountSeleclor.defaultAccountSelector);

  const loadRewards = async () => {
    await setState({
      isReloading: true,
    });

    const newRewards = await accountService.getRewardAmount('', account.PaymentAddress);
    setRewards(formatUtil.amountFull(newRewards || 0, 9, true));
    await setState({
      isReloading: false,
    });
  };

  const fetchData = async (reload = false) => {
    try {
      await setState({ isReloading: true });
      let tasks = [getFollowingToken(), loadRewards()];
      if (reload) {
        tasks = [
          ...tasks,
          dispatch(getPTokenList()),
        ];
      }
      await Promise.all(tasks);
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      await setState({ isReloading: false });
    }
  };
  const handleExportKey = async () => {
    navigation.navigate(routeNames.ReceiveCrypto);
    await dispatch(setSelectedPrivacy(CONSTANT_COMMONS.PRV.id));
  };
  const handleSelectToken = async (tokenId) => {
    if (!tokenId) return;
    await dispatch(setSelectedPrivacy(tokenId));
    navigation.navigate(routeNames.WalletDetail);
  };
  const clearWallet = async () => null;
  const handleRemoveToken = async (tokenId) => {
    await dispatch(actionRemoveFollowToken(tokenId));
    Toast.showSuccess('Add coin again to restore balance.', {
      duration: 500,
    });
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <ErrorBoundary>
      <WalletContext.Provider
        value={{
          walletProps: {
            ...props,
            wallet,
            isReloading,
            rewards,
            fetchData,
            handleExportKey,
            handleSelectToken,
            handleRemoveToken,
            clearWallet,
            getFollowingToken,
          },
        }}
      >
        <WrappedComp
          {...{
            ...props,
            wallet,
            isReloading: !!isReloading || isGettingBalance.length > 0,
            fetchData,
            handleExportKey,
            handleSelectToken,
            handleRemoveToken,
            clearWallet,
            getFollowingToken,
          }}
        />
      </WalletContext.Provider>
    </ErrorBoundary>
  );
};

export default enhance;
