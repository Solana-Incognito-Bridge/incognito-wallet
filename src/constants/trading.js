import {TX_STATUS} from '@src/redux/utils/history';

const PROTOCOLS = {
  OX: '0x',
  KYBER: 'Kyber',
  UNISWAP: 'Uniswap',
};

const ERC20_NETWORK = {
  Kyber: 'Kyber',
  Uniswap: 'Uniswap',
  PDex: 'Incognito',
};

export const HISTORY_STATUS_CODE = {
  REJECTED: 26,
  ACCEPTED: 18,
  PENDING: 1
};

export const HISTORY_STATUS = {
  REFUND: ['refund', 'xPoolTradeRefundFee', 'xPoolTradeRefundSellingToken'],
  REJECTED: ['rejected', 'withPRVFeeRejected'],
  ACCEPTED: ['accepted', 'xPoolTradeAccepted', TX_STATUS.TXSTATUS_SUCCESS],
  FAIL: [TX_STATUS.TXSTATUS_FAILED, TX_STATUS.TXSTATUS_CANCELED],

};

let kyberTradeAddress = '';
let uniswapTradeAddress = '';
let kyberFee = 0;
let uniswapFee = 0;

const setDAppAddresses = ({
  Kyber,
  Uniswap,
}) => {
  if (Kyber) {
    kyberTradeAddress = Kyber;
  }

  if (Uniswap) {
    uniswapTradeAddress = Uniswap;
  }
};

const getDAppAddresses = () => {
  return {
    Kyber: kyberTradeAddress,
    kyber: kyberTradeAddress,
    Uniswap: uniswapTradeAddress,
    uniswap: uniswapTradeAddress,
  };
};

const getFees = () => {
  return {
    Kyber: kyberFee,
    kyber: kyberFee,
    Uniswap: uniswapFee,
    uniswap: uniswapFee,
  };
};

const setFees = ({
  Kyber,
  Uniswap,
}) => {
  if (Kyber) {
    kyberFee = Kyber;
  }

  if (Uniswap) {
    uniswapFee = Uniswap;
  }
};

export default {
  PROTOCOLS,
  ERC20_NETWORK,
  setDAppAddresses,
  getDAppAddresses,
  setFees,
  getFees,
};
