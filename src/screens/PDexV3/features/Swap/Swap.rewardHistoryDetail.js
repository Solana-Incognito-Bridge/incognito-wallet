import React from 'react';
import { StyleSheet } from 'react-native';
import { View2 } from '@src/components/core/View';
import { withLayout_2 } from '@src/components/Layout';
import Header from '@components/Header';
import { ScrollViewBorder } from '@components/core';
import { useNavigation } from 'react-navigation-hooks';
import formatUtil from '@src/utils/format';
import ClipboardService from '@src/services/clipboard';
import { ExHandler } from '@src/services/exception';
import { BtnCopy } from '@src/components/Button';
import TradeOrderDetail, {
  styled as orderDetailStyled,
  OrderDetailValue,
} from '@screens/PDexV3/features/Trade/Trade.orderDetail';
import { Row } from '@src/components';
import LinkingService from '@src/services/linking';
import { CONSTANT_CONFIGS } from '@src/constants';
import { PRV } from '@src/constants/common';

const styled = StyleSheet.create({
  container: { flex: 1 },
  scrollview: { flex: 1, paddingTop: 32 },
  itemLeftContainer: { flex: 1, marginRight: 10 },
  itemRightContainer: {flex: 1, marginLeft: 0},
});

const SwapRewardHistoryDetail = () => {
  const navigation = useNavigation();
  const { rewardHistoryDetail } = navigation.state?.params;

  const data = [
    {
      label: 'Paid out at',
      value: formatUtil.formatDateTime(rewardHistoryDetail?.createdAt),
    },
    {
      label: 'Total trading volume',
      value: (rewardHistoryDetail?.sumTotalVolume)?.toFixed(4),
    },
    {
      label: 'Your trading volume',
      value: (rewardHistoryDetail?.totalVolume)?.toFixed(4),
    },
    {
      label: 'Reward amount',
      value: `${formatUtil.amountVer2(rewardHistoryDetail?.rewardAmount, PRV.pDecimals)} PRV`,
    },
    {
      label: 'Calculated from',
      value: formatUtil.formatDateTime(rewardHistoryDetail?.fromTime),
    },
    {
      label: 'Calculated to',
      value: formatUtil.formatDateTime(rewardHistoryDetail?.toTime),
    },
    {
      label: 'Tx',
      customValue: (
        <Row
          style={{
            ...orderDetailStyled.rowValue,
            marginLeft: 0,
            flexDirection: 'column',
          }}
        >
          <OrderDetailValue
            copiable
            openUrl
            handleOpenUrl={() =>
              LinkingService.openUrl(
                `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${rewardHistoryDetail?.tx}`,
              )
            }
            value={`#${rewardHistoryDetail?.tx}`}
            containerStyle={styled.itemRightContainer}
          />
        </Row>
      ),
      hookStyled: {
        alignItems: 'flex-start',
      },
      value: `#${rewardHistoryDetail?.tx}`,
    },
  ];

  const handleCopy = () => {
    try {
      const copyData = data
        .map(({ label, value }) => `${label}: ${value}`)
        .join('\n');
      ClipboardService.set(copyData, {
        copiedMessage: 'Copied',
        errorMessage: '',
      });
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  return (
    <View2 style={styled.container}>
      <Header
        title="Trading rewards detail"
        rightHeader={<BtnCopy onPress={handleCopy} isHeader />}
      />
      <ScrollViewBorder style={styled.scrollview}>
        {data.length > 0 &&
          data?.map((item) => (
            <TradeOrderDetail
              labelStyle={styled.itemLeftContainer}
              valueContainerStyle={styled.itemRightContainer}
              key={item?.label}
              {...item}
            />
          ))}
      </ScrollViewBorder>
    </View2>
  );
};

SwapRewardHistoryDetail.propTypes = {};

export default withLayout_2(React.memo(SwapRewardHistoryDetail));
