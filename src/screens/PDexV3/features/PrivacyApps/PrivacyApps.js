import React from 'react';
import { StyleSheet } from 'react-native';
import { withLayout_2 } from '@src/components/Layout';
import { View } from '@src/components/core';
import { PancakeIcon2, UniIcon2, CurveIcon2, RaydiumIcon2 } from '@src/components/Icons';
import { useDispatch, useSelector } from 'react-redux';
import { FONT } from '@src/styles';
import { KEYS_PLATFORMS_SUPPORTED } from '@screens/PDexV3/features/Swap';
import {
  ROOT_TAB_TRADE,
  TAB_SWAP_ID,
  TAB_BUY_LIMIT_ID,
} from '@screens/PDexV3/features/Trade';
import { useFocusEffect, useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import Header from '@src/components/Header';
import { activedTabSelector, actionChangeTab } from '@src/components/core/Tabs';
import { FlatList } from '@src/components/core/FlatList';
import { compose } from 'recompose';
import withLazy from '@components/LazyHoc/LazyHoc';
import PrivacyAppsItem from './PrivacyApps.item';

const styled = StyleSheet.create({
  flatListContainer: {
    flexGrow: 1,
    padding: 20
  },
  itemSpace: {
    height: 20,
  },
});

const PrivacyApps = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const getActivedTab = useSelector(activedTabSelector);
  const onPressItem = (id) => {
    switch (id) {
    case KEYS_PLATFORMS_SUPPORTED.pancake:
      navigation.navigate(routeNames.PrivacyAppsPancake);
      break;
    case KEYS_PLATFORMS_SUPPORTED.uni:
      navigation.navigate(routeNames.PrivacyAppsUni);
      break;
    case KEYS_PLATFORMS_SUPPORTED.curve:
      navigation.navigate(routeNames.PrivacyAppsCurve);
      break;
    case KEYS_PLATFORMS_SUPPORTED.raydium:
      navigation.navigate(routeNames.PrivacyAppsRaydium);
      break;
    default:
      break;
    }
  };
  const factories = React.useMemo(() => {
    return [
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.raydium,
        icon: <RaydiumIcon2 />,
        headerTitle: 'pRaydium',
        headerSub: 'Private Raydium',
        groupActions: [
          {
            id: 'Solana',
            title: 'Solana',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Explore DeFi on Solana with full anonymity for your swap and assets.',
        onPressItem,
      },
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.pancake,
        icon: <PancakeIcon2 />,
        headerTitle: 'pPancake',
        headerSub: 'Private PancakeSwap',
        groupActions: [
          {
            id: 'BSC',
            title: 'Binance Smart Chain',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Trade anonymously on Binance Smart Chain’s leading DEX. Deep liquidity and super low fees – now with privacy.',
        onPressItem,
      },
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.uni,
        icon: <UniIcon2 />,
        headerTitle: 'pUniswap',
        headerSub: 'Private Uniswap',
        groupActions: [
          {
            id: 'POLYGON',
            title: 'Polygon',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Trade confidentially on everyone’s favorite DEX. Faster and cheaper thanks to Polygon, and private like all Incognito apps.',
        onPressItem,
      },
      {
        privacyAppId: KEYS_PLATFORMS_SUPPORTED.curve,
        icon: <CurveIcon2 />,
        headerTitle: 'pCurve',
        headerSub: 'Private Curve',
        groupActions: [
          {
            id: 'POLYGON',
            title: 'Polygon',
          },
          {
            id: 'DEX',
            title: 'DEX',
          },
        ],
        desc: 'Trade anonymously on Polygon’s leading DEX. Deep liquidity and super low fees – now with privacy.',
        onPressItem,
      },
    ];
  }, []);
  useFocusEffect(() => {
    const activeTabTrade = getActivedTab(ROOT_TAB_TRADE);
    if (activeTabTrade === TAB_SWAP_ID) {
      dispatch(
        actionChangeTab({ rootTabID: ROOT_TAB_TRADE, tabID: TAB_BUY_LIMIT_ID }),
      );
    }
  });

  const renderItem = React.useCallback(({ item }) => {
    return <PrivacyAppsItem {...item} />;
  }, []);

  const renderItemSeparatorComponent = () => {
    return <View style={styled.itemSpace} />;
  };
  return (
    <>
      <Header
        title="Privacy apps"
        titleStyled={[{ ...FONT.TEXT.incognitoH4 }]}
        hideBackButton
      />
      <View borderTop fullFlex>
        <FlatList
          data={factories}
          keyExtractor={(item) => item?.privacyAppId}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparatorComponent}
          contentContainerStyle={styled.flatListContainer}
        />
      </View>
    </>
  );
};

PrivacyApps.propTypes = {};

export default compose(
  withLazy,
  withLayout_2
)(React.memo(PrivacyApps));
