import { actionLogEvent } from '@src/screens/Performance';
import http from '@src/services/http';
import isArray from 'lodash/isArray';

export const getWalletAccounts = async (masterAccountPublicKey, dispatch) => {
  let result = [];
  try {
    const url = `hd-wallet/recovery?Key=${masterAccountPublicKey}`;
    const res = await http.get(url);
    if (dispatch) {
      await dispatch(
        actionLogEvent({
          desc: `RESULT getWalletAccounts ${JSON.stringify(res)}`,
        }),
      );
    }
    result = res?.Accounts?.map((account) => ({
      name: account.Name,
      id: account.AccountID,
    }));
  } catch (error) {
    if (dispatch) {
      await dispatch(
        actionLogEvent({
          desc: `ERROR getWalletAccounts ${JSON.stringify(error)}`,
        }),
      );
    }
    throw error;
  }
  return result;
};

export const updateWalletAccounts = (masterAccountPublicKey, accounts) => {
  const accountInfos = accounts.map((item) => ({
    Name: item.name,
    AccountID: item.id,
  }));

  return http
    .put('hd-wallet/recovery', {
      Key: masterAccountPublicKey,
      Accounts: accountInfos,
    })
    .catch((e) => e);
};
