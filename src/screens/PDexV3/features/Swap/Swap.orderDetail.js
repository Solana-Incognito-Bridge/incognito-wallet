import React from 'react';
import { StyleSheet } from 'react-native';
import { View2 } from '@src/components/core/View';
import { withLayout_2 } from '@src/components/Layout';
import Header from '@components/Header';
import { ScrollViewBorder, RefreshControl, Text } from '@components/core';
import { useDispatch, useSelector } from 'react-redux';
import { BtnCopy } from '@src/components/Button';
import { ExHandler } from '@src/services/exception';
import LinkingService from '@src/services/linking';
import ClipboardService from '@src/services/clipboard';
import { CONSTANT_CONFIGS } from '@src/constants';
import TradeOrderDetail, {
  styled as orderDetailStyled,
  OrderDetailValue,
} from '@screens/PDexV3/features/Trade/Trade.orderDetail';
import { Row } from '@src/components';
import { orderDetailSelector } from './Swap.selector';
import { actionFetchDataOrderDetail } from './Swap.actions';

const styled = StyleSheet.create({
  container: { flex: 1 },
  scrollview: { flex: 1, paddingTop: 32 },
});

const SwapOrderDetail = () => {
  const dispatch = useDispatch();
  const { fetching: refreshing, order } = useSelector(orderDetailSelector);
  const onRefresh = async () => {
    dispatch(actionFetchDataOrderDetail());
  };
  const factories = React.useMemo(() => {
    if (!order) {
      return [];
    }
    let ft = [];
    if (order?.tradeID) {
      ft.push({
        label: 'Trade ID',
        value: `#${order?.tradeID}`,
        copiable: true,
      });
    }
    ft = ft.concat([
      {
        label: 'Request Tx',
        value: `#${order?.requestTx}`,
        copiable: true,
        openUrl: true,
        handleOpenUrl: () =>
          LinkingService.openUrl(
            `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${order?.requestTx}`,
          ),
      },
      {
        label: 'Time',
        value: order?.timeStr,
      },
      {
        label: 'Sell',
        value: order?.sellStr,
      },
      {
        label: 'Buy',
        value: order?.buyStr,
      },
      {
        label: 'Status',
        value: order?.statusStr,
      },
      {
        label: 'Rate',
        customValue: order?.rateStr && (
          <Row style={orderDetailStyled.rowValue}>
            <Text style={orderDetailStyled.value}>{order?.rateStr}</Text>
          </Row>
        ),
      },
      {
        label: 'Fee',
        value: order?.tradingFeeStr,
      },
    ]);
    if (!order?.tradingFeeByPRV) {
      ft.push({
        label: 'Network fee',
        value: order?.networkfeeAmountStr,
      });
    }
    if (order?.respondTxs?.length > 0) {
      ft.push({
        label: 'Response Tx',
        customValue: (
          <Row
            style={{
              ...orderDetailStyled.rowValue,
              marginLeft: 0,
              flexDirection: 'column',
            }}
          >
            {order?.respondTxs.map((responseTx) => (
              <OrderDetailValue
                copiable
                openUrl
                handleOpenUrl={() =>
                  LinkingService.openUrl(
                    `${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${responseTx}`,
                  )
                }
                value={`#${responseTx}`}
              />
            ))}
          </Row>
        ),
        hookStyled: {
          alignItems: 'flex-start',
        },
        value: order?.respondTxs.map((responseTx) => `\n${responseTx}`).join(),
      });
    }
    ft.push({
      label: 'Exchange',
      value: order?.exchange,
    });
    return ft.filter(
      (ftItem) => !!ftItem && (!!ftItem?.value || !!ftItem?.customValue),
    );
  }, [order]);
  const handleCopy = () => {
    try {
      const data = factories
        .map(({ label, value }) => `${label}: ${value}`)
        .join('\n');
      ClipboardService.set(data, { copiedMessage: 'Copied', errorMessage: '' });
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  React.useEffect(() => {
    dispatch(actionFetchDataOrderDetail());
  }, []);
  return (
    <View2 style={styled.container}>
      <Header
        title="Swap details"
        rightHeader={<BtnCopy onPress={handleCopy} isHeader />}
      />
      <ScrollViewBorder
        style={styled.scrollview}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {factories.length > 0 &&
          factories?.map((item) => (
            <TradeOrderDetail key={item?.label} {...item} />
          ))}
      </ScrollViewBorder>
    </View2>
  );
};

SwapOrderDetail.propTypes = {};

export default withLayout_2(React.memo(SwapOrderDetail));
