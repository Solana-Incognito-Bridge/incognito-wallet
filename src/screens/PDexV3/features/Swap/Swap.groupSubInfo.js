import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from '@src/components/core';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import History from './Swap.orderHistory';
import {
  TAB_REWARD_HISTORY_ID,
  SCREENS_TO_SHOW_REWARD_HISTORY_TAB,
  ROOT_TAB_SWAP_HISTORY,
  TAB_SWAP_HISTORY_ID
} from './Swap.constant';
import RewardHistory from './Swap.rewardHistory';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
  },
});

const GroupSubInfo = () => {
  const navigation = useNavigation();
  return (
    <View style={styled.container}>
      <Tabs rootTabID={ROOT_TAB_SWAP_HISTORY}>
        <View
          tabID={TAB_SWAP_HISTORY_ID}
          label="Swap history"
          onChangeTab={() => null}
          upperCase={false}
        >
          <History />
        </View>
        {SCREENS_TO_SHOW_REWARD_HISTORY_TAB.includes(
          navigation?.state?.routeName,
        ) ? (
          // eslint-disable-next-line react/jsx-indent
            <View
              tabID={TAB_REWARD_HISTORY_ID}
              label="Trading rewards"
              onChangeTab={() => null}
              upperCase={false}
            >
              <RewardHistory />
            </View>
          ) : (
            <View tabID="" label="" onChangeTab={() => null} upperCase={false}>
              <View />
            </View>
          )}
      </Tabs>
    </View>
  );
};

GroupSubInfo.propTypes = {};

export default React.memo(GroupSubInfo);
