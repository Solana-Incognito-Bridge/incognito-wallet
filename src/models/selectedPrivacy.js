/* eslint-disable import/no-cycle */
import { CONSTANT_COMMONS, CONSTANT_CONFIGS } from '@src/constants';
import { BIG_COINS } from '@src/screens/DexV2/constants';
import { PRV_ID } from '@screens/Dex/constants';
import { detectToken } from '@src/utils/misc';
import PToken from './pToken';

function getNetworkName() {
  let name = 'Unknown';
  const isETH =
    this?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ETH;
  const isBSC =
    this?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BNB;
  const isBNB =
    this?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BNB;
  const isMATIC =
    this?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC;

  if (isBSC) {
    name ='BEP20 BSC';
  } else if (isBNB) {
    name ='BNB Chain';
  } else if (this.isIncognitoToken || this.isMainCrypto) {
    name = 'Incognito';
  } else if (this.isPrivateCoin) {
    name = `${this.name}`;
  } else if (this.isErc20Token) {
    name = 'ERC20';
  } else if (this.isBep20Token) {
    name = 'BEP20';
  } else if (this.isBep2Token) {
    name = 'BEP2';
  } else if (this.isPolygonErc20Token) {
    name = 'Polygon ERC20';
  }

  let rootNetworkName = name;
  if (isETH || this?.isErc20Token) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.ETHEREUM;
  } else if (isBSC || this?.isBep20Token) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.BSC;
  } else if (isBNB || this?.isBep2Token) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.BINANCE;
  } else if (isMATIC || this?.isPolygonErc20Token) {
    rootNetworkName = CONSTANT_COMMONS.NETWORK_NAME.POLYGON;
  }
  return {
    networkName: name,
    rootNetworkName,
  };
}

function combineData(pData, incognitoData, defaultData) {
  if (this.isPToken) {
    return pData || incognitoData;
  }

  if (this.isIncognitoToken) {
    return incognitoData || pData;
  }

  return defaultData;
}

function getIconUrl(chainTokenImageUri) {
  let uri;

  if (this.tokenId === PRV_ID) {
    return 'https://statics.incognito.org/wallet/cryptocurrency-icons/32@2x/color/prv@2x.png';
  }

  if (this.isMainCrypto || this.isPToken) {
    let formatedSymbol = String(
      this.symbol || this.externalSymbol,
    ).toUpperCase();
    uri = `${CONSTANT_CONFIGS.CRYPTO_ICON_URL}/${formatedSymbol}.png`;
  } else {
    uri = chainTokenImageUri;
  }

  return uri;
}

class SelectedPrivacy {
  constructor(account = {}, token = {}, pTokenData: PToken = {}, _tokenID) {
    const tokenId = pTokenData?.tokenId || token?.id;
    const isUnknown = _tokenID !== PRV_ID && !tokenId;
    const unknownText = 'Incognito Token';

    this.currencyType = pTokenData.currencyType;
    this.isToken = tokenId !== CONSTANT_COMMONS.PRV_TOKEN_ID && !!tokenId; // all kind of tokens (private tokens, incognito tokens)
    this.isMainCrypto = _tokenID === PRV_ID; // PRV
    this.isPrivateToken =
      pTokenData?.type === CONSTANT_COMMONS.PRIVATE_TOKEN_TYPE.TOKEN; // ERC20 tokens, BEP2 tokens
    this.isPrivateCoin =
      pTokenData?.type === CONSTANT_COMMONS.PRIVATE_TOKEN_TYPE.COIN; // pETH, pBTC, pTOMO,...
    this.isPToken = !!pTokenData.pSymbol; // pToken is private token (pETH <=> ETH, pBTC <=> BTC, ...)
    this.isIncognitoToken =
      (!this.isPToken && !this.isMainCrypto) ||
      detectToken.ispNEO(this?.tokenId); // is tokens were issued from users
    this.isErc20Token =
      this.isPrivateToken &&
      this.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20;
    this.isBep2Token =
      this.isPrivateToken &&
      this.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BNB_BEP2;
    this.isPolygonErc20Token =
      this.isPrivateToken &&
      this.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.POLYGON_ERC20;
    this.isBep20Token =
      this.isPrivateToken &&
      this.currencyType ===
        CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BEP20;
    this.symbol = combineData.call(
      this,
      pTokenData?.pSymbol,
      token?.symbol,
      CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
    );
    this.name = combineData.call(
      this,
      pTokenData?.name,
      token?.name,
      isUnknown ? unknownText : 'Privacy',
    );
    this.displayName = combineData.call(
      this,
      `Privacy ${pTokenData?.symbol}`,
      token?.name,
      isUnknown ? unknownText : 'Privacy',
    );

    this.tokenId = _tokenID
      ? _tokenID
      : this.isMainCrypto
        ? CONSTANT_COMMONS.PRV_TOKEN_ID
        : tokenId;
    this.contractId = pTokenData.contractId;
    this.decimals = this.isMainCrypto
      ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY
      : pTokenData.decimals;
    this.pDecimals = this.isMainCrypto
      ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY
      : pTokenData.pDecimals || 0;
    this.externalSymbol = pTokenData.symbol;
    this.paymentAddress = account.PaymentAddress;
    this.isWithdrawable = this.isPToken;
    this.isDeposable = this.isPToken;
    this.isDecentralized =
      this.isErc20Token ||
      (this.isToken &&
        this.currencyType ===
          CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ETH) ||
      this.isBep20Token ||
      (this.isToken &&
        this.currencyType ===
          CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BSC_BNB) ||
      this.isPolygonErc20Token ||
      (this.isToken &&
        this.currencyType ===
          CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.MATIC);
    this.isCentralized = this.isToken && !this.isDecentralized;
    this.incognitoTotalSupply =
      (this.isIncognitoToken && Number(token?.totalSupply)) || 0;
    this.isVerified = combineData.call(
      this,
      pTokenData?.verified,
      token?.verified,
      !isUnknown,
    ); // PRV always is verified
    this.priceUsd = pTokenData?.priceUsd || 0;
    this.externalPriceUSD = pTokenData?.externalPriceUSD || 0;
    this.pricePrv = pTokenData?.pricePrv || 0;
    this.pairWithPrv = pTokenData?.pairPrv;
    const { networkName, rootNetworkName } = getNetworkName.call(this);
    this.networkName = networkName;
    this.rootNetworkName = rootNetworkName;
    this.isUSDT = this.tokenId === BIG_COINS.USDT;
    this.isPRV = this.tokenId === BIG_COINS.PRV;
    this.symbol = this.externalSymbol || this.symbol || '';
    if (!this.symbol && this.isIncognitoToken && !this.isMainCrypto) {
      this.symbol = 'INC';
    }
    this.amount = token?.amount;
    if (this.isMainCrypto) {
      this.amount = account?.value;
      this.symbol = CONSTANT_COMMONS.PRV.symbol;
    }
    this.amount = this.amount || 0;
    this.listChildToken = pTokenData?.listChildToken;
    this.iconUrl = getIconUrl.call(this, token?.image || pTokenData.image);
    this.change = pTokenData?.change;
    this.defaultPoolPair = pTokenData?.defaultPoolPair;
    this.defaultPairToken = pTokenData?.defaultPairToken;
    this.network = pTokenData.network;
    this.hasSameSymbol = pTokenData.hasSameSymbol;
  }
}

export default SelectedPrivacy;
