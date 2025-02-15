import React from 'react';
import PropTypes from 'prop-types';
import Header, { MarketTabs } from '@screens/MainTabBar/features/Market/Market.header';
import {TokenFollow} from '@components/Token';
import MarketList from '@components/Token/Token.marketList';
import withMarket from '@screens/MainTabBar/features/Market/Market.enhance';
import { batch, useDispatch, useSelector } from 'react-redux';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { actionChangeTab } from '@components/core/Tabs/Tabs.actions';
import { ROOT_TAB_TRADE, TAB_BUY_LIMIT_ID } from '@screens/PDexV3/features/Trade/Trade.constant';
import { actionInit, actionSetPoolSelected } from '@screens/PDexV3/features/OrderLimit';
import { marketTabSelector } from '@screens/Setting';
import { PRVIDSTR } from 'incognito-chain-web-js/build/wallet';

const Market = React.memo((props) => {
  const { handleToggleFollowToken, keySearch, onFilter, ...rest } = props;
  const activeTab = useSelector(marketTabSelector);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const onOrderPress = (item) => {
    const poolId = item.defaultPoolPair;
    navigation.navigate(routeNames.Trade, { tabIndex: 0 });
    if (poolId) {
      batch(() => {
        dispatch(actionSetPoolSelected(poolId));
        dispatch(actionChangeTab({ rootTabID: ROOT_TAB_TRADE, tabID: TAB_BUY_LIMIT_ID }));
        setTimeout(() => {
          dispatch(actionInit());
        }, 200);
      });
    }
  };
  return (
    <>
      <Header onFilter={onFilter} />
      <MarketList
        keySearch={keySearch}
        {...rest}
        renderItem={(item) => (
          <TokenFollow
            item={item}
            key={item.tokenId}
            hideStar={activeTab !== MarketTabs.FAVORITE || item.tokenId === PRVIDSTR}
            handleToggleFollowToken={handleToggleFollowToken}
            onPress={() => onOrderPress(item)}
          />
        )}
      />
    </>
  );
});

Market.propTypes = {
  handleToggleFollowToken: PropTypes.func.isRequired,
  keySearch: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired
};

export default withMarket(Market);
