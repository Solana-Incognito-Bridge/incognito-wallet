import http from '@src/services/http';
import { CONSTANT_COMMONS } from '@src/constants';
import convert from '@src/utils/convert';

export const genCentralizedWithdrawAddress = ({
  originalAmount,
  requestedAmount,
  paymentAddress,
  walletAddress,
  tokenId,
  currencyType,
  memo,
  signPublicKeyEncode,
}) => {
  if (!paymentAddress) throw new Error('Missing paymentAddress');
  if (!walletAddress) throw new Error('Missing walletAddress');
  if (!tokenId) throw new Error('Missing tokenId');
  if (!Number.isFinite(originalAmount) || originalAmount === 0) {
    throw new Error('Invalid amount');
  }
  const data = {
    CurrencyType: currencyType,
    AddressType: CONSTANT_COMMONS.ADDRESS_TYPE.WITHDRAW,
    RequestedAmount: String(requestedAmount),
    IncognitoAmount: String(originalAmount),
    PaymentAddress: paymentAddress,
    WalletAddress: walletAddress,
    PrivacyTokenAddress: tokenId,
    SignPublicKeyEncode: signPublicKeyEncode,
    ...(memo ? { Memo: memo } : {}),
  };

  return http.post('ota/generate', data).then((res) => res);
};

export const withdraw = (data) => {
  const {
    isErc20Token,
    isBep20Token,
    isPolygonErc20Token,
    isSPLToken,
    paymentAddress,
    tokenId,
    burningTxId,
    originalAmount,
    requestedAmount,
    tokenContractID,
    walletAddress,
    currencyType,
    userFeesData,
    isUsedPRVFee,
    fast2x,
    signPublicKeyEncode,
  } = data;
  const parseOriginalAmount = Number(originalAmount);
  if (!burningTxId) throw new Error('Missing burningTxId');
  if (isErc20Token && !tokenContractID) {
    throw new Error('Missing tokenContractID');
  }
  if (!paymentAddress) throw new Error('Missing payment address');
  if (!tokenId) throw new Error('Missing token id');
  if (!Number.isFinite(parseOriginalAmount) || parseOriginalAmount === 0) {
    throw new Error('Invalid amount');
  }
  let payload = {
    CurrencyType: currencyType,
    AddressType: CONSTANT_COMMONS.ADDRESS_TYPE.WITHDRAW,
    RequestedAmount: String(requestedAmount),
    IncognitoAmount: String(originalAmount),
    PaymentAddress: paymentAddress,
    Erc20TokenAddress: tokenContractID,
    PrivacyTokenAddress: tokenId,
    IncognitoTx: burningTxId,
    WalletAddress: walletAddress,
    ID: userFeesData?.ID,
    UserFeeSelection: isUsedPRVFee ? 2 : 1,
    UserFeeLevel: fast2x ? 2 : 1,
  };
  if (signPublicKeyEncode) {
    payload.SignPublicKeyEncode = signPublicKeyEncode;
  }
  if (
    currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BNB ||
    isBep20Token
  ) {
    return http.post('bsc/add-tx-withdraw', payload);
  }

  // Polygon Token
  if (
    isPolygonErc20Token ||
    currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC ||
    currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.POLYGON_ERC20
  ) {
    return http.post('plg/add-tx-withdraw', payload);
  }

  // Sol Token
  if (
    isSPLToken ||
    currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.SOL ||
    currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.SPL
  ) {
    return http.post('sol/add-tx-withdraw', payload);
  }

  return http.post('eta/add-tx-withdraw', payload);
};

export const updatePTokenFee = (data) => {
  const {
    fee,
    paymentAddress,
    isUsedPRVFee,
    fast2x,
    txId,
    signPublicKeyEncode,
  } = data;
  if (!isUsedPRVFee) {
    if (!fee) throw new Error('Missing fee');
    const parseFee = convert.toNumber(fee);
    if (!Number.isFinite(parseFee) || parseFee === 0) {
      throw new Error('Invalid fee');
    }
  }
  if (!paymentAddress) throw new Error('Missing paymentAddress');
  if (!txId) {
    throw new Error('Missing tx id');
  }

  let payload = {
    Address: paymentAddress,
    PrivacyFee: String(isUsedPRVFee ? fee : 0),
    TokenFee: String(isUsedPRVFee ? 0 : fee),
    ID: '',
    UserFeeSelection: isUsedPRVFee ? 2 : 1,
    UserFeeLevel: fast2x ? 2 : 1,
    IncognitoTxToPayOutsideChainFee: txId,
  };

  if (signPublicKeyEncode) {
    payload.SignPublicKeyEncode = signPublicKeyEncode;
  }

  return http.post('ota/update-fee', payload);
};

export const estimateUserFees = (data) => {
  const {
    paymentAddress,
    tokenId,
    originalAmount,
    requestedAmount,
    tokenContractID,
    walletAddress,
    currencyType,
    isErc20Token,
    isBep20Token,
    isPolygonErc20Token,
    isSPLToken,
    signPublicKeyEncode,
  } = data;
  if (
    (isBep20Token ||
      isErc20Token ||
      currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.POLYGON) &&
    !tokenContractID
  ) {
    throw new Error('Missing tokenContractID');
  }
  if (!paymentAddress) throw new Error('Missing payment address');
  if (!tokenId) throw new Error('Missing token id');
  const parseOriginalAmount = Number(originalAmount);
  if (!Number.isFinite(parseOriginalAmount) || parseOriginalAmount === 0) {
    throw new Error('Invalid amount');
  }

  let payload = {
    TokenID: tokenId,
    RequestedAmount: String(requestedAmount),
    CurrencyType: currencyType,
    AddressType: CONSTANT_COMMONS.ADDRESS_TYPE.WITHDRAW,
    IncognitoAmount: String(originalAmount),
    PaymentAddress: paymentAddress,
    Erc20TokenAddress: tokenContractID,
    PrivacyTokenAddress: tokenId,
    WalletAddress: walletAddress,
    IncognitoTx: '',
  };

  if (signPublicKeyEncode) {
    payload.SignPublicKeyEncode = signPublicKeyEncode;
  }
  if (
    isBep20Token ||
    currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BNB
  ) {
    return http.post('bsc/estimate-fees', payload);
  }

  // Polygon Token
  if (
    isPolygonErc20Token ||
    currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC ||
    currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.POLYGON_ERC20
  ) {
    return http.post('plg/estimate-fees', payload);
  }

  // Sol Token
  if (
    isSPLToken ||
    currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.SOL ||
    currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.SPL
  ) {
    return http.post('sol/estimate-fees', payload);
  }

  return http.post('eta/estimate-fees', payload);
};
