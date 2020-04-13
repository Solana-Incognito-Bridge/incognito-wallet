const isMainnet = global.isMainnet ?? true;
const prefix_network = 'testnet';
const KEYS = {
  PASSPHRASE_KEY: '$password',
  DEFAULT_ACCOUNT_NAME: '$DEFAULT_ACCOUNT_NAME',
  DISPLAYED_WIZARD: '$DISPLAYED_WIZARD',
  GAME_PLAYER_ID: '$GAME_PLAYER_ID',
  USER: 'USER_OBJECT_KEY',
  LIST_DEVICE: 'PRODUCT_LIST_KEY',
  LIST_TOKEN: 'LIST_TOKEN',
  USER_UNFOLLOWING_TOKEN_ID_LIST: '$USER_UNFOLLOWING_TOKEN_ID_LIST',
  DEX: '$DEX',
  DEX_HISTORY: '$DEX_HISTORY',
  UNISWAP_HISTORY: '$UNISWAP_HISTORY',
  SEEN_DEPOSIT_GUIDE: '$SEEN_DEPOSIT_GUIDE',
  PIN: '$PIN',
  IS_CHECK_FOLLOWED_TOKEN: '$IS_CHECK_FOLLOWED_TOKEN',
  IS_BACKEDUP_ACCOUNT: '$IS_BACKEDUP_ACCOUNT',
  REDUX_STATE_RECEIVERS_IN_NETWORK: '$REDUX_STATE_RECEIVERS_IN_NETWORK',
  REDUX_STATE_RECEIVERS_OUT_NETWORK: '$REDUX_STATE_RECEIVERS_OUT_NETWORK',
  WITHDRAWAL_DATA: '$WITHDRAWAL_DATA',
  SUBSCRIBE_TOPIC_KEY: 'all-production',
  BACKUP_STAKE_KEY: '$BACKUP_STAKE_KEY',
};

const KEYS_TESTNET = {
  PASSPHRASE_KEY: `${prefix_network}_$password`,
  DEFAULT_ACCOUNT_NAME: `${prefix_network}_$DEFAULT_ACCOUNT_NAME`,
  DISPLAYED_WIZARD: '$DISPLAYED_WIZARD',
  GAME_PLAYER_ID: `${prefix_network}_$GAME_PLAYER_ID`,
  USER: `${prefix_network}_USER_OBJECT_KEY`,
  LIST_DEVICE: `${prefix_network}_PRODUCT_LIST_KEY`,
  LIST_TOKEN: `${prefix_network}_LIST_TOKEN`,
  USER_UNFOLLOWING_TOKEN_ID_LIST: `${prefix_network}_$USER_UNFOLLOWING_TOKEN_ID_LIST`,
  DEX: `${prefix_network}_DEX`,
  UNISWAP_HISTORY: `${prefix_network}_UNISWAP_HISTORY`,
  DEX_HISTORY: `${prefix_network}_$DEX_HISTORY`,
  SEEN_DEPOSIT_GUIDE: `${prefix_network}_$SEEN_DEPOSIT_GUIDE`,
  PIN: `${prefix_network}_$PIN`,
  IS_CHECK_FOLLOWED_TOKEN: `${prefix_network}_$IS_CHECK_FOLLOWED_TOKEN`,
  IS_BACKEDUP_ACCOUNT: `${prefix_network}_$IS_BACKEDUP_ACCOUNT`,
  REDUX_STATE_RECEIVERS_IN_NETWORK: `${prefix_network}_$REDUX_STATE_RECEIVERS_IN_NETWORK`,
  REDUX_STATE_RECEIVERS_OUT_NETWORK: `${prefix_network}_$REDUX_STATE_RECEIVERS_OUT_NETWORK`,
  WITHDRAWAL_DATA: `${prefix_network}_$WITHDRAWAL_DATA`,
  SUBSCRIBE_TOPIC_KEY: 'all-staging',
  BACKUP_STAKE_KEY: `${prefix_network}_$BACKUP_STAKE_KEY`,
};

const PASSPHRASE_KEY_REVERVE = isMainnet
  ? KEYS_TESTNET.PASSPHRASE_KEY
  : KEYS.PASSPHRASE_KEY;

const MERGE_KEY = isMainnet ? KEYS : KEYS_TESTNET;
// const MERGE_KEY =  KEYS;
export default {
  ...MERGE_KEY,
  PASSPHRASE_KEY_REVERVE: PASSPHRASE_KEY_REVERVE,
};
