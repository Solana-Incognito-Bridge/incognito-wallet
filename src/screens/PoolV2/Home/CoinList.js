import React from 'react';
import PropTypes from 'prop-types';
import upToIcon from '@src/assets/images/icons/upto_icon.png';
import sumIcon from '@src/assets/images/icons/sum_icon.png';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image, RefreshControl,
} from '@components/core';
import mainStyles from '@screens/PoolV2/style';
import { Row, PRVSymbol, ImageCached } from '@src/components';
import {ArrowRightGreyIcon, LockIcon} from '@components/Icons';
import { useNavigation } from 'react-navigation-hooks';
import ROUTE_NAMES from '@routers/routeNames';
import { PRV_ID } from '@src/screens/DexV2/constants';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme/theme.selector';

import { selectedPrivacySelector } from '@src/redux/selectors';
import globalStyled from '@src/theme/theme.styled';
import styles from './style';


export const LockTimeComp = React.memo(() => {
  const colors = useSelector(colorsSelector);
  return (
    <Row style={[mainStyles.wrapperLock, { backgroundColor: colors.background3 }]}>
      <LockIcon />
    </Row>
  );
});

export const SumIconComp = React.memo(() => {
  return (
    <Image
      source={sumIcon}
      style={{
        width: 16,
        height: 16,
        marginBottom: 8,
        marginRight: 8
      }}
    />
  );
});

export const UpToIconComp = ({ style }) => {
  const colors = useSelector(colorsSelector);
  return (
    <Image
      source={upToIcon}
      style={[mainStyles.iconUp, { tintColor: colors.blue1 }, style]}
    />
  );
};

const CoinList = ({
  coins,
  groupedCoins,
  userData,
  groupedUserData,
  histories,
  withdrawable,
  loading,
  onLoad,
  account,
  isLoadingHistories,
}) => {
  const getPrivacyDataByTokenID = useSelector(selectedPrivacySelector.getPrivacyDataByTokenID);
  const navigation = useNavigation();
  const colors = useSelector(colorsSelector);
  const handleHistory = () => {
    navigation.navigate(ROUTE_NAMES.PoolV2History, {
      coins,
    });
  };

  const renderEmpty = () => {
    return (
      <>
        <ScrollView
          refreshControl={(
            <RefreshControl
              refreshing={loading}
              onRefresh={() => onLoad(account)}
            />
          )}
          style={[styles.scrollView, { paddingHorizontal: 0 }]}
        >
          {groupedCoins.map((item) => {
            const { iconUrl } = getPrivacyDataByTokenID(item.id);
            return (
              <Row
                centerVertical
                style={[
                  mainStyles.coin,
                  { borderBottomWidth: 1, borderBottomColor: colors.border4, paddingVertical: 16, marginBottom: 0 },
                  globalStyled.defaultPaddingHorizontal,
                ]}
                key={`${item.id} ${item.locked}`}
              >
                <ImageCached uri={iconUrl} style={{ width: 32, height: 32, marginRight: 14 }} />
                <Text style={[mainStyles.coinName, { marginBottom: 0 }]}>{item.name}</Text>
                <Row style={[mainStyles.flex, mainStyles.emptyRight]}>
                  {item.locked && <UpToIconComp style={{ marginBottom: 0 }} />}
                  <Text style={[mainStyles.coinExtra, mainStyles.textRight, { color: colors.blue1, marginLeft: 4, marginBottom: 0 }]}>{item.displayInterest}</Text>
                </Row>
              </Row>
            );
          })}
          <View style={[globalStyled.defaultPaddingHorizontal, { marginVertical: 15 }]}>
            {renderRate()}
          </View>
        </ScrollView>
      </>
    );
  };

  const renderRate = () => {
    if (!isLoadingHistories && !histories?.length) {
      return (
        <Text style={mainStyles.coinExtra}>
          Rates subject to change at any time.
        </Text>
      );
    }
  };

  const handleOpenMigrate = (data) => {
    navigation.navigate(ROUTE_NAMES.PoolV2ProvideMigrateInput, {
      data,
      coins,
    });
  };

  const handleShowLockHistory = (coin) => {
    if (!coin.locked) {
      return null;
    }

    navigation.navigate(ROUTE_NAMES.PoolV2ProvideLockHistory, {
      coin,
      userData,
    });
  };

  const renderBtnMirage = (item) => {
    return (
      <TouchableOpacity style={[mainStyles.btnMirage, { backgroundColor: colors.background3 }]} onPress={() => handleOpenMigrate(item)}>
        <Text style={mainStyles.mirageText}>Migrate</Text>
      </TouchableOpacity>
    );
  };

  const renderBtnViewDetails = (item) => {
    return (
      <TouchableOpacity style={[mainStyles.btnViewDetail, {borderColor: colors.contrast}]} onPress={() => handleShowLockHistory(item)}>
        <Text style={mainStyles.viewDetailText}>View details</Text>
      </TouchableOpacity>
    );
  };

  const renderMainCoin = (item) => {
    const mapCoin = item.coin;
    const provideBalance = item.balance;
    return (
      <View style={mainStyles.wrapTitle}>
        <Text style={[mainStyles.coinName, { marginBottom: 0 }]}>{item.symbol}</Text>
        {item.locked && (
          <>
            <LockTimeComp />
            {renderBtnViewDetails(mapCoin)}
          </>
        )}
        {(!item.locked && mapCoin.id === PRV_ID && !!provideBalance) && renderBtnMirage(item)}
      </View>
    );
  };

  const renderUpToAPY = (item) => {
    return (
      <Row style={{alignItems: 'center'}}>
        <Text style={[mainStyles.coinExtra, { color: colors.blue1 }]}>{item.coin.displayInterest}</Text>
        {item.locked && <UpToIconComp />}
      </Row>
    );
  };

  const renderUserData = () => {
    return (
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={loading}
            onRefresh={() => onLoad(account)}
          />
        )}
        style={[styles.scrollView, { paddingHorizontal: 0 }]}
      >
        {groupedUserData.map((item) => {
          const mapCoin = item.coin;
          if (!mapCoin) return null;
          const { iconUrl } = getPrivacyDataByTokenID(item.id);
          return (
            <View style={[globalStyled.defaultPaddingHorizontal, { flexDirection: 'row', borderBottomColor: colors.border4, borderBottomWidth: 1, marginBottom: 15 }]}>
              <ImageCached uri={iconUrl} style={{ width: 32, height: 32, marginTop: 10, marginRight: 14 }} />
              <View key={`${item.id} ${item.locked}`} style={[mainStyles.coin, { flex: 1, marginBottom: 10 }]}>
                <View key={`${item.id} ${item.locked}`}>
                  <View>
                    <Row>
                      <View>
                        {renderMainCoin(item)}
                        {renderUpToAPY(item)}
                      </View>
                      <View style={[mainStyles.flex]}>
                        <Text style={[mainStyles.coinName, mainStyles.textRight, { marginBottom: 10 }]}>
                          {item.displayBalance}
                        </Text>
                        {!!item.displayPendingBalance && (
                          <Text style={[mainStyles.coinExtra, mainStyles.textRight]}>
                            + {item.displayPendingBalance}
                          </Text>
                        )}
                        {!!item.displayUnstakeBalance && (
                          <Text style={[mainStyles.coinExtra, mainStyles.textRight]}>
                            - {item.displayUnstakeBalance}
                          </Text>
                        )}
                        <Row
                          style={[mainStyles.textRight, mainStyles.justifyRight]}
                          center
                        >
                          {item.locked && <SumIconComp />}
                          <PRVSymbol style={[mainStyles.coinInterest, {color: colors.text6}]} />
                          <Text style={[mainStyles.coinInterest, {color: colors.text6}]}>
                            {item.displayReward}
                          </Text>
                        </Row>
                        {!!item.displayWithdrawReward && (
                          <Text style={[mainStyles.coinExtra, mainStyles.textRight]}>
                            - {item.displayWithdrawReward}
                          </Text>
                        )}
                      </View>
                    </Row>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
        {renderRate()}
      </ScrollView>
    );
  };

  const renderBottom = () => {
    if (isLoadingHistories) {
      return (
        <View style={styles.rateChange}>
          <ActivityIndicator />
        </View>
      );
    }

    if (histories?.length > 0) {
      return (
        <View style={[styles.rateChange]}>
          <TouchableOpacity onPress={handleHistory}>
            <Row center spaceBetween style={mainStyles.flex}>
              <Text style={[styles.rateStyle, { marginLeft: 20 }]}>Provider history</Text>
              <ArrowRightGreyIcon style={[{ marginRight: 10 }]} />
            </Row>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderContent = () => {
    if (withdrawable) {
      return renderUserData();
    }

    return renderEmpty();
  };

  return (
    <View style={mainStyles.coinContainer}>
      {renderContent()}
      {/*{renderBottom()}*/}
    </View>
  );
};

CoinList.propTypes = {
  coins: PropTypes.array,
  groupedCoins: PropTypes.array,
  groupedUserData: PropTypes.array,
  userData: PropTypes.array,
  histories: PropTypes.array,
  withdrawable: PropTypes.bool,
  onLoad: PropTypes.func,
  loading: PropTypes.bool,
  account: PropTypes.object.isRequired,
  isLoadingHistories: PropTypes.bool,
};

CoinList.defaultProps = {
  coins: [],
  groupedCoins: [],
  groupedUserData: [],
  userData: [],
  histories: [],
  withdrawable: false,
  onLoad: undefined,
  loading: false,
  isLoadingHistories: false,
};

export default React.memo(CoinList);
