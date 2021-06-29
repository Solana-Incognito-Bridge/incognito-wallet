import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigationParam} from 'react-navigation-hooks';
import {batch, useDispatch, useSelector} from 'react-redux';
import {shieldDataSelector, shieldSelector} from '@screens/Shield/Shield.selector';
import {selectedPrivacySeleclor} from '@src/redux/selectors';
import { actionFetch as fetchDataShield, actionFetching } from '@screens/Shield/Shield.actions';
import {wcProviderOptionals} from '@screens/Wallet/features/BridgeConnect';
import WalletConnectProvider from '@walletconnect/react-native-dapp';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import { actionAddFollowToken } from '@src/redux/actions/token';
import {defaultAccountSelector} from '@src/redux/selectors/account';

const enhance = WrappedComp => props => {
  const [loading, setLoading] = React.useState(true);
  const dispatch   = useDispatch();
  const account = useSelector(defaultAccountSelector);

  const tokenShield = useNavigationParam('tokenShield') || {};
  const tokenSymbol = tokenShield?.externalSymbol || tokenShield?.symbol;
  const { tokenId } = tokenShield;

  const {
    decentralized
  } = useSelector(shieldDataSelector);
  const {
    isFetching,
    isFetched
  } = useSelector(shieldSelector);

  // const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);

  const handleShield = () => dispatch(fetchDataShield({ tokenId, selectedPrivacy: tokenShield, account }));

  const handleUpdateTokenSelector = () => {
    batch(() => {
      dispatch(setSelectedPrivacy(tokenId));
      dispatch(actionAddFollowToken(tokenId));
    });
  };

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      handleUpdateTokenSelector();
    }, 1000);
  }, []);

  return (
    <WalletConnectProvider {...wcProviderOptionals}>
      <ErrorBoundary>
        <WrappedComp
          {...{
            ...props,
            loading,
            tokenId,
            tokenSymbol,
            selectedPrivacy: tokenShield,
            isFetching,
            isFetched,
            decentralized,
            tokenShield,
            handleShield,
          }}
        />
      </ErrorBoundary>
    </WalletConnectProvider>
  );
};

export default enhance;
