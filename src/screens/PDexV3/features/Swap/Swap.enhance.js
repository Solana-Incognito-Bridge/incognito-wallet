import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import { actionToggleModal } from '@src/components/Modal';
import { TradeSuccessModal } from '@src/screens/PDexV3/features/Trade';
import { focus } from 'redux-form';
import { actionCheckNeedFaucetPRV } from '@src/redux/actions/token';
import FaucetPRVModal from '@src/components/Modal/features/FaucetPRVModal';
import RemoveSuccessDialog from '@src/screens/Setting/features/RemoveStorage/RemoveStorage.Dialog';
import { compose } from 'recompose';
import withLazy from '@src/components/LazyHoc/LazyHoc';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { formConfigs, KEYS_PLATFORMS_SUPPORTED } from './Swap.constant';
import {
  actionInitSwapForm,
  actionReset,
  actionFetchSwap,
  actionToggleProTab,
  actionSetDefaultExchange,
} from './Swap.actions';
import {
  swapInfoSelector,
  swapFormErrorSelector,
  sellInputTokenSelector,
  feetokenDataSelector,
} from './Swap.selector';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const swapInfo = useDebounceSelector(swapInfoSelector);
  const formErrors = useDebounceSelector(swapFormErrorSelector);
  const sellInputToken = useDebounceSelector(sellInputTokenSelector);
  const feeTokenData = useDebounceSelector(feetokenDataSelector);
  const [visibleSignificant, setVisibleSignificant] = React.useState(false);
  const [ordering, setOrdering] = React.useState(false);
  const {
    isPrivacyApp = false,
    exchange = KEYS_PLATFORMS_SUPPORTED.incognito,
  } = props;
  // const unmountSwap = () => {
  //   dispatch(actionReset());
  // };
  const initSwapForm = (refresh = false) =>
    dispatch(
      actionInitSwapForm({
        defaultPair: swapInfo?.defaultPair,
        refresh,
        shouldFetchHistory: true,
      }),
    );
  const handleCreateSwapOrder = async () => {
    const tx = await dispatch(actionFetchSwap());
    if (tx) {
      dispatch(
        actionToggleModal({
          data: (
            <TradeSuccessModal
              title="Swap initiated!"
              desc={`You placed an order to sell\n${
                swapInfo?.sellInputAmountStr || ''
              } for ${swapInfo?.buyInputAmountStr || ''}.`}
              handleTradeSucesss={() => initSwapForm()}
              sub="Your balance will update in a couple of minutes after the swap is finalized."
            />
          ),
          visible: true,
        }),
      );
    }
  };
  const handleConfirm = async () => {
    try {
      if (ordering) {
        return;
      }
      await setOrdering(true);
      const fields = [formConfigs.selltoken, formConfigs.buytoken];
      for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        if (formErrors[field]) {
          return dispatch(focus(formConfigs.formName, field));
        }
      }
      if (
        swapInfo?.disabledBtnSwap &&
        !formErrors[formConfigs.selltoken] &&
        !formErrors[formConfigs.buytoken] &&
        (!!formErrors[formConfigs.slippagetolerance] ||
          !!formErrors[formConfigs.feetoken])
      ) {
        dispatch(actionToggleProTab(true));
        return;
      }
      if (!sellInputToken.isMainCrypto) {
        const needFaucet = await dispatch(
          actionCheckNeedFaucetPRV(
            <FaucetPRVModal />,
            swapInfo?.accountBalance,
          ),
        );
        if (needFaucet) {
          return;
        }
      }
      const { isSignificant } = feeTokenData;
      if (isSignificant) {
        return setVisibleSignificant(true);
      }
      await handleCreateSwapOrder();
    } catch {
      //
    } finally {
      setOrdering(false);
    }
  };
  const handleInitSwapForm = async () => {
    if (isPrivacyApp) {
      await dispatch(actionSetDefaultExchange({ isPrivacyApp, exchange }));
    }
    initSwapForm(true);
  };
  React.useEffect(() => {
    handleInitSwapForm();
    // return () => {
    //   unmountSwap();
    // };
  }, []);

  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, handleConfirm, initSwapForm }} />
      <RemoveSuccessDialog
        visible={visibleSignificant}
        onPressCancel={() => setVisibleSignificant(false)}
        onPressAccept={() => {
          setVisibleSignificant(false);
          handleCreateSwapOrder();
        }}
        title="Warning"
        subTitle="Do note that due to trade size, the price of this trade varies significantly from market price."
        acceptStr="Accept"
      />
    </ErrorBoundary>
  );
};

export default compose(withLazy, enhance);
