import { PRV_ID } from '@src/constants/common';
import uniq from 'lodash/uniq';
import memoize from 'lodash/memoize';
import { createSelector } from 'reselect';

export const followed = (state) => state?.token?.followed || [];
export const isGettingBalance = (state) => state?.token?.isGettingBalance || [];
export const pTokens = (state) => state?.token?.pTokens || [];
export const internalTokens = (state) => state?.token?.internalTokens || [];
export const tokensFollowedSelector = createSelector(
  followed,
  (tokens) => tokens,
);
export const pTokensSelector = createSelector(
  (state) => state?.token?.pTokens,
  (pTokens) =>
    pTokens.map((token) => ({ ...token, tokenID: token?.tokenId })) || [],
);

export const internalTokensSelector = createSelector(
  (state) => state?.token?.internalTokens,
  (internalTokens) =>
    internalTokens.map((token) => ({ ...token, tokenID: token?.id })) || [],
);

export const historyTokenSelector = createSelector(
  (state) => state?.token?.history,
  (history) => history,
);

export const isTokenFollowedSelector = createSelector(
  tokensFollowedSelector,
  (tokens) => (tokenId) => tokens.find((token) => token?.id === tokenId),
);

export const toggleUnVerifiedTokensSelector = createSelector(
  (state) => state?.token?.toggleUnVerified,
  (toggleUnVerified) => toggleUnVerified,
);

export const receiveHistorySelector = createSelector(
  (state) => state?.token?.receiveHistory,
  historyTokenSelector,
  (receiveHistory, history) => {
    const {
      oversize,
      refreshing: refreshingReceiveHistory,
      isFetched: isFetchedReceiveHistory,
      isFetching: isFetchingReceiveHistory,
      notEnoughData: notEnoughDataReceiveHistory,
    } = receiveHistory;
    const {
      histories,
      isFetched,
      isFetching,
      refreshing: refreshingHistory,
    } = history;
    const refreshing = refreshingHistory || refreshingReceiveHistory;
    const notEnoughData =
      (histories?.length < 10 || notEnoughDataReceiveHistory) &&
      !isFetchingReceiveHistory &&
      isFetchedReceiveHistory &&
      !oversize;
    const showEmpty =
      histories?.length === 0 &&
      isFetched &&
      !isFetching &&
      !notEnoughData &&
      !oversize;
    const isLoadmore =
      !notEnoughData &&
      !!receiveHistory?.isFetching &&
      !receiveHistory?.refreshing &&
      !oversize;
    return {
      ...receiveHistory,
      isLoadmore,
      refreshing,
      notEnoughData,
      showEmpty,
    };
  },
);

export const defaultPTokensIDsSelector = createSelector(
  pTokensSelector,
  (pTokens) =>
    pTokens.filter((token) => token.default).map((token) => token?.tokenId),
);

export const allTokensIDsSelector = createSelector(
  pTokensSelector,
  internalTokensSelector,
  (pTokens, internalTokens) => {
    let result =
      uniq(
        [{ tokenID: PRV_ID }, ...pTokens, ...internalTokens]
          .filter((token) => !!token?.tokenID)
          .map((token) => token?.tokenID),
      ) || [];
    return result;
  },
);

export const isGettingBalanceSelector = createSelector(
  isGettingBalance,
  (tokens) => tokens,
);

export const isGettingBalanceTokenByIdSelector = createSelector(
  isGettingBalanceSelector,
  (tokens) =>
    memoize((tokenId) =>
      tokens?.length > 0 ? tokens?.includes(tokenId) : false,
    ),
);

export const getBalanceTokenByIdSelector = createSelector(
  tokensFollowedSelector,
  (followed) =>
    memoize((tokenId) => {
      let balance = 0;
      try {
        const foundToken = followed.find((token) => token?.id === tokenId);
        if (foundToken) {
          balance = foundToken?.balance || 0;
        }
      } catch (error) {
        console.log('error-getBalanceTokenByIdSelector', error, tokenId);
      }
      return balance;
    }),
);

export default {
  followed,
  isGettingBalance,
  pTokens,
  internalTokens,
  tokensFollowedSelector,
  pTokensSelector,
  internalTokensSelector,
  historyTokenSelector,
  isTokenFollowedSelector,
  toggleUnVerifiedTokensSelector,
  receiveHistorySelector,
  defaultPTokensIDsSelector,
  allTokensIDsSelector,
  isGettingBalanceSelector,
  isGettingBalanceTokenByIdSelector,
  getBalanceTokenByIdSelector,
};
