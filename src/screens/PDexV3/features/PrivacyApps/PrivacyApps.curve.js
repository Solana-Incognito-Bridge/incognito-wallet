import React from 'react';
import TabSwap, {
  KEYS_PLATFORMS_SUPPORTED,
  actionSetDefaultExchange,
  actionInitSwapForm,
  actionReset,
} from '@screens/PDexV3/features/Swap';
import { withLayout_2 } from '@src/components/Layout';
import Header from '@src/components/Header';
import { useDispatch } from 'react-redux';

const PrivacyAppsCurve = () => {
  const dispatch = useDispatch();
  const handleOnRefresh = async () => {
    await dispatch(
      actionSetDefaultExchange({
        isPrivacyApp: true,
        exchange: KEYS_PLATFORMS_SUPPORTED.curve,
      }),
    );
    dispatch(actionInitSwapForm({ refresh: true, shouldFetchHistory: true }));
  };
  React.useEffect(() => {
    dispatch(actionReset());
  }, []);
  return (
    <>
      <Header
        title="pCurve"
        accountSelectable
        handleSelectedAccount={handleOnRefresh}
      />
      <TabSwap isPrivacyApp exchange={KEYS_PLATFORMS_SUPPORTED.curve} />
    </>
  );
};

PrivacyAppsCurve.propTypes = {};

export default withLayout_2(React.memo(PrivacyAppsCurve));
