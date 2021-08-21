import { COLORS } from '@src/styles';
import {
  ACCOUNT_CONSTANT,
  Validator,
} from 'incognito-chain-web-js/build/wallet';

export const {
  TX_STATUS,
  STATUS_CODE_SHIELD_DECENTRALIZED,
  STATUS_CODE_SHIELD_CENTRALIZED,
  STATUS_CODE_UNSHIELD_DECENTRALIZED,
  STATUS_CODE_UNSHIELD_CENTRALIZED,
  TX_TYPE,
  STATUS_CODE_SHIELD_PORTAL,
  STATUS_CODE_UNSHIELD_PORTAL,
} = ACCOUNT_CONSTANT;

const PORTAL_STATUS_DETAIL = {
  [STATUS_CODE_UNSHIELD_PORTAL.PENDING]: 'The unshielding request is waiting to process.',
  [STATUS_CODE_UNSHIELD_PORTAL.PROCESSING]: 'Your token is being sent out to your address.',
  [STATUS_CODE_UNSHIELD_PORTAL.COMPLETE]: '',
  [STATUS_CODE_UNSHIELD_PORTAL.REFUND]: 'The unshielding request was refunded to your account. Please try again.'
};

export const TX_STATUS_COLOR = {
  [TX_STATUS.PROCESSING]: COLORS.colorGreyBold,
  [TX_STATUS.TXSTATUS_UNKNOWN]: COLORS.orange,
  [TX_STATUS.TXSTATUS_FAILED]: COLORS.red,
  [TX_STATUS.TXSTATUS_PENDING]: COLORS.colorBlue,
  [TX_STATUS.TXSTATUS_SUCCESS]: COLORS.green,
};

export const getStatusColorShield = (history) => {
  let statusColor = '';
  try {
    new Validator('getStatusColorShield-history', history).required().object();
    const { decentralized, status } = history;
    switch (decentralized) {
    case 0: {
      // centralized
      if (STATUS_CODE_SHIELD_CENTRALIZED.COMPLETE.includes(status)) {
        statusColor = COLORS.green;
      } else {
        statusColor = COLORS.colorGreyBold;
      }
      break;
    }
    case 1:
    case 2: {
      // decetralized
      if (STATUS_CODE_SHIELD_DECENTRALIZED.COMPLETE.includes(status)) {
        statusColor = COLORS.green;
      } else {
        statusColor = COLORS.colorGreyBold;
      }
      break;
    }
    default:
      break;
    }
  } catch (error) {
    console.log('getStatusColorShield', error);
  }
  return statusColor;
};

export const getStatusColorUnshield = (history) => {
  let statusColor = '';
  try {
    new Validator('getStatusColorUnshield-history', history)
      .required()
      .object();
    const { decentralized, status } = history;
    switch (decentralized) {
    case 0: {
      // centralized
      if (STATUS_CODE_UNSHIELD_CENTRALIZED.COMPLETE === status) {
        statusColor = COLORS.green;
      } else {
        statusColor = COLORS.colorGreyBold;
      }
      break;
    }
    case 1:
    case 2: {
      // decetralized
      if (STATUS_CODE_UNSHIELD_DECENTRALIZED.COMPLETE === status) {
        statusColor = COLORS.green;
      } else {
        statusColor = COLORS.colorGreyBold;
      }
      break;
    }
    default:
      break;
    }
  } catch (error) {
    console.log('getStatusColorUnshield', error);
  }

  return statusColor;
};

export const getPortalStatusColor = (history) => {
  let statusColor = '';
  try {
    new Validator('getPortalStatusColor-history', history).required().object();
    const { txType, status } = history;
    switch (txType) {
    case TX_TYPE.SHIELDPORTAL: {
      // shield
      if (status === STATUS_CODE_SHIELD_PORTAL.SUCCESS) {
        statusColor = COLORS.green;
      } else {
        statusColor = COLORS.colorGreyBold;
      }
      break;
    }
    case TX_TYPE.UNSHIELDPORTAL: {
      // unshield
      if (status === STATUS_CODE_UNSHIELD_PORTAL.COMPLETE) {
        statusColor = COLORS.green;
      } else if (status === STATUS_CODE_UNSHIELD_PORTAL.REFUND) {
        statusColor = COLORS.red;
      } else {
        statusColor = COLORS.colorGreyBold;
      }
      break;
    }
    default:
      break;
    }
  } catch (error) {
    console.log('getPortalStatusColor', error);
  }
  return statusColor;
};

export const getPortalStatusDetail = (history) => {
  let statusDetail = '';
  try {
    new Validator('getPortalStatusColor-history', history).required().object();
    const { txType, status } = history;
    switch (txType) {
    case TX_TYPE.SHIELDPORTAL: {
      break;
    }
    case TX_TYPE.UNSHIELDPORTAL: {
      statusDetail = PORTAL_STATUS_DETAIL[status];
      break;
    }
    default:
      break;
    }
  } catch (error) {
    console.log('getPortalStatusDetail', error);
  }
  return statusDetail;
};