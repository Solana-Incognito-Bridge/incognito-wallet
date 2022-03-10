import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Divider,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from '@src/components/core';
import { useSelector } from 'react-redux';
import { Row } from '@src/components';
import { FONT, COLORS } from '@src/styles';
import formatUtil from '@src/utils/format';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { PRV } from '@src/constants/common';
import { swapHistorySelector } from './Swap.selector';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
  },
  flatlist: {
    flex: 1,
    paddingBottom: 24,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  itemDesc: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 5,
  },
  itemWrapper: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

const RewardHistoryItem = React.memo(({ data }) => {
  const { createdAt, rewardAmount, tx } = data;

  const navigation = useNavigation();

  const navigateToRewardHistoryDetailScreen = () => {
    navigation.navigate(routeNames.SwapRewardHistoryDetail, {
      rewardHistoryDetail: data,
    });
  };
  return (
    <TouchableOpacity
      onPress={navigateToRewardHistoryDetailScreen}
      style={styled.itemContainer}
    >
      <View style={styled.itemWrapper}>
        <Row style={{ ...styled.row }}>
          <View style={{ flex: 1, marginRight: 48 }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[
                styled.itemDesc,
                { color: COLORS.lightGrey36, marginBottom: 4 },
              ]}
            >
              #{tx}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[styled.itemDesc, {}]}
            >
              {formatUtil.formatDateTime(createdAt)}
            </Text>
          </View>
          <View>
            <Text
              numberOfLines={1}
              ellipsizeMode="middle"
              style={[styled.itemDesc]}
            >
              {formatUtil.amountVer2(rewardAmount, PRV.pDecimals)} PRV
            </Text>
          </View>
        </Row>
      </View>
    </TouchableOpacity>
  );
});

const RewardHistory = () => {
  const { isFetching } = useSelector(swapHistorySelector);
  const rewardHistories = useSelector(
    (state) => state.pDexV3.swap.rewardHistories,
  );
  return (
    <View style={styled.container}>
      <FlatList
        refreshControl={<RefreshControl refreshing={isFetching} />}
        data={rewardHistories}
        keyExtractor={(item, index) => index?.toString()}
        renderItem={({ item, index }) => (
          <>
            <RewardHistoryItem
              data={item}
              visibleDivider={index !== rewardHistories.length - 1}
            />
            {index !== rewardHistories.length - 1 && <Divider />}
          </>
        )}
        contentContainerStyle={styled.flatlist}
      />
    </View>
  );
};

RewardHistory.propTypes = {};

export default React.memo(RewardHistory);
