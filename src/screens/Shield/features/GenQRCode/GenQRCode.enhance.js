import React, { useState } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import LoadingContainer from '@components/LoadingContainer';
import Header from '@components/Header';
import { styled } from '@screens/Shield/features/GenQRCode/GenQRCode.styled';
import { BtnInfo } from '@components/Button';
import routeNames from '@routers/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import TermOfUseShield from '@screens/Shield/features/TermOfUseShield';
import { withLayout_2 } from '@components/Layout';
import withShieldData from '@screens/Shield/features/GenQRCode/GenQRCode.data';
import { compose } from 'recompose';
import { CONSTANT_COMMONS } from '@src/constants';
import withAccount from '@screens/DexV2/components/account.enhance';
import ShieldDecentralized from '@screens/Shield/features/ShieldDecentralized';

const enhance = (WrappedComp) => (props) => {
  const {
    tokenSymbol,
    isShieldAddressDecentralized,
    selectedPrivacy,
    isFetched,
    isFetching,
    loading,
  } = props;

  const [showTerm, setShowTerm] = useState(true);
  const [selectedTerm, setSelectedTerm] = React.useState(undefined);
  const navigation = useNavigation();

  const handleToggleTooltip = () => {
    navigation.navigate(routeNames.CoinInfo, { isShieldAddressDecentralized });
  };
  const hasError = !isFetched && !isFetching;

  const handleGoBack = () => {
    navigation.navigate(routeNames.Shield);
  };

  const renderHeader = React.useCallback(() => (
    <Header
      title={`Shield ${tokenSymbol}`}
      titleStyled={styled.titleStyled}
      rightHeader={<BtnInfo isBlack onPress={handleToggleTooltip} />}
      onGoBack={handleGoBack}
    />
  ), [tokenSymbol]);

  const renderLoading = React.useCallback(() => (
    <>
      {renderHeader()}
      <LoadingContainer />
    </>
  ), []);

  const renderTermOfUse = () => {
    return (
      <TermOfUseShield
        {
        ...{
          ...props,
          selectedTerm,
          onNextPress: () => setShowTerm(false),
          onSelected: index => setSelectedTerm(index)
        }}
      />
    );
  };

  /** render loading */
  if (isFetching || loading) {
    return renderLoading();
  }

  /** render term off user */
  if (
    ((isShieldAddressDecentralized === false
    && (selectedPrivacy?.currencyType === 1 || selectedPrivacy?.currencyType === 3)
    && !selectedPrivacy?.isVerified
    && selectedPrivacy?.priceUsd <= 0
    && !hasError)
    || (selectedPrivacy?.contractId || selectedPrivacy?.externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH))
    && showTerm
  ) {
    return renderTermOfUse();
  }

  if (selectedTerm === 1 && isShieldAddressDecentralized) {
    return (
      <ShieldDecentralized {...{ ...props, setShowTerm}} />
    );
  }

  return (
    <ErrorBoundary>
      {renderHeader()}
      <WrappedComp {...{ ...props, isFetching, isFetched, hasError, selectedTerm, setSelectedTerm}} />
    </ErrorBoundary>
  );
};

export default compose(
  withAccount,
  withShieldData,
  withLayout_2,
  enhance,
);
