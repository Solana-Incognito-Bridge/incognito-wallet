import React from 'react';
import { StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { LoadingContainer, Text, View } from '@src/components/core';
import { ExHandler } from '@src/services/exception';
import { FONT } from '@src/styles';
import { ButtonBasic } from '@src/components/Button';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 3,
  },
  btnStyle: {
    marginTop: 15,
    width: 100,
    height: 40,
  },
  titleStyle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 3,
  },
});

const enhance = (WrappedComp) => (props) => {
  const [checking, setChecking] = React.useState(false);
  const [connected, setConnected] = React.useState(false);
  const checkStatusNetwork = async () => {
    try {
      await setChecking(true);
      const { isConnected } = await NetInfo.fetch();
      await setConnected(isConnected);
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      await setChecking(false);
    }
  };
  React.useEffect(() => {
    checkStatusNetwork();
  }, []);
  if (checking) {
    return <LoadingContainer size="large" />;
  }
  if (!connected) {
    return (
      <View style={styled.container} borderTop>
        <Text style={styled.text}>
          Your internet connection is currently unstable. Please check your
          network settings and try again!
        </Text>
        <ButtonBasic
          btnStyle={styled.btnStyle}
          title="Try again"
          onPress={checkStatusNetwork}
          titleStyle={styled.titleStyle}
        />
      </View>
    );
  }
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance
);
