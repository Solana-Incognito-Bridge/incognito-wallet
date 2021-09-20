import { createSelector } from 'reselect';
import { getPrivacyDataByTokenID as getPrivacyDataByTokenIDSelector } from '@src/redux/selectors/selectedPrivacy';
import BigNumber from 'bignumber.js';
import {
  getExchangeRate,
  getPrincipal,
  getReward,
  getShareStr,
} from '@screens/PDexV3';
import format from '@src/utils/format';
import convert from '@utils/convert';

export const portfolioSelector = createSelector(
  (state) => state.pDexV3,
  ({ portfolio }) => {
    return portfolio;
  },
);

export const shareDetailsSelector = createSelector(
  portfolioSelector,
  ({ shareDetails }) => shareDetails
);

export const isFetchingSelector = createSelector(
  portfolioSelector,
  ({ isFetching }) => isFetching
);

export const listShareSelector = createSelector(
  portfolioSelector,
  shareDetailsSelector,
  getPrivacyDataByTokenIDSelector,
  (portfolio, shareDetails, getPrivacyDataByTokenID) => {
    const { data } = portfolio;
    return data.map((item) => {
      const {
        tokenId1,
        tokenId2,
        share,
        totalShare,
        token1Reward,
        token2Reward,
        poolId,
      } = item;
      const poolDetail = shareDetails.find((share) => poolId === share.poolId);
      const { amp, apy, token1Value: token1PoolValue, token2Value: token2PoolValue, withdrawing, withdrawable } = poolDetail || {};
      const token1 = getPrivacyDataByTokenID(tokenId1);
      const token2 = getPrivacyDataByTokenID(tokenId2);
      const shareId = `${item?.tokenId1}-${item?.tokenId2}`;
      const exchangeRateStr = getExchangeRate(
        token1,
        token2,
        token1PoolValue,
        token2PoolValue,
      );
      const principalStr = getPrincipal(
        token1,
        token2,
        token1PoolValue,
        token2PoolValue,
      );
      const shareStr = getShareStr(share, totalShare);
      const rewardStr = getReward(token1, token2, token1Reward, token2Reward);
      const hookFactories = [
        {
          label: 'APY',
          value: `${apy}%`,
        },
        {
          label: 'AMP',
          value: amp,
        },
        {
          label: 'Exchange rate',
          value: exchangeRateStr,
        },
        {
          label: 'Principal',
          value: principalStr,
        },
        {
          label: 'Share',
          value: shareStr,
        },
        {
          label: 'Reward',
          value: rewardStr,
          isClaimReward: true,
          withdrawing,
          withdrawable,
          shareId,
        },
      ];
      return {
        ...item,
        shareId,
        token1,
        token2,
        exchangeRateStr,
        principalStr,
        shareStr,
        rewardStr,
        hookFactories,
        amp,
        apy,
        token1PoolValue,
        token2PoolValue,
      };
    });
  },
);

export const listShareIDsSelector = createSelector(
  listShareSelector,
  (listShare) => listShare.map((item) => item?.shareId),
);

export const getDataByShareIdSelector = createSelector(
  listShareSelector,
  (listShare) => (shareId) =>
    listShare.find((item) => item?.shareId === shareId),
);

export const getDataShareByPoolIdSelector = createSelector(
  listShareSelector,
  (listShare) => (poolId) =>
    listShare.find((item) => item?.poolId === poolId),
);

export const totalShareSelector = createSelector(
  listShareSelector,
  (listShare) => {
    const rewardUSD = listShare.reduce((prev, cur) => {
      const { token1, token2, token2Reward } = cur;
      const token1Reward = 2;
      const _reward1USD = convert.toOriginalAmount(new BigNumber(token1Reward).multipliedBy(token1.priceUsd ?? 0).toNumber(), token1.pDecimals);
      const _reward2USD = convert.toOriginalAmount(new BigNumber(token2Reward).multipliedBy(token2.priceUsd ?? 0).toNumber(), token2.pDecimals);
      return prev.plus(_reward1USD).plus(_reward2USD);
    }, new BigNumber('0')).toNumber();
    return format.amountFull(rewardUSD, 9, true);
  }
);
