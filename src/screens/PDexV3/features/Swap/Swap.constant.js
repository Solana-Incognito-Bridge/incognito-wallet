import routeNames from '@src/router/routeNames';

export const ACTION_FETCHING = '[pDexV3][swap] Fetching data';
export const ACTION_FETCHED = '[pDexV3][swap] Fetched data';
export const ACTION_FETCH_FAIL = '[pDexV3][swap] Fetch fail data';

export const ACTION_SET_SELL_TOKEN = '[pDexV3][swap] Set sell token';
export const ACTION_SET_BUY_TOKEN = '[pDexV3][swap] Set buy token';
export const ACTION_SET_FEE_TOKEN = '[pDexV3][swap] Set fee token';
export const ACTION_SET_FOCUS_TOKEN = '[pDexV3][swap] Set focus token';

export const ACTION_SET_SELECTING_TOKEN = '[pDexV3][swap] Set selecting token';
export const ACTION_SET_SWAPING_TOKEN = '[pDexV3][swap] Set swapingToken token';
export const ACTION_SET_INITIING_SWAP = '[pDexV3][swap] Set initing token';

export const ACTION_SET_PERCENT = '[pDexV3][swap] Set percent';

export const ACTION_RESET = '[pDexV3][swap] Reset';
export const ACTION_FETCH_SWAP = '[pDexV3][swap] Fetching swap';
export const ACTION_FETCHED_LIST_PAIRS = '[pDexV3][swap] Fetched list pairs';

export const ACTION_FETCHING_ORDERS_HISTORY =
  '[pDexV3][swap] Fetching history order';
export const ACTION_FETCHED_ORDERS_HISTORY =
  '[pDexV3][swap] Fetched history order';
export const ACTION_FETCH_FAIL_ORDERS_HISTORY =
  '[pDexV3][swap] Fetch fail history order';
export const ACTION_FETCH_ORDER_DETAIL = '[pDexV3][swap] Fetch order detail';
export const ACTION_FETCHING_ORDER_DETAIL =
  '[pDexV3][swap] Fetching order detail';
export const ACTION_FETCHED_ORDER_DETAIL =
  '[pDexV3][swap] Fetched order detail';
export const ACTION_SET_DEFAULT_PAIR = '[pDexV3][swap] Set default pair';
export const ACTION_TOGGLE_PRO_TAB = '[pDexV3][swap] Toggle pro tab';

export const ACTION_CHANGE_SELECTED_PLATFORM =
  '[pDexV3][swap] Change selected platform';
export const ACTION_CHANGE_STATUS_VISIBLE_PLATFORM =
  '[pDexV3][swap] Change status visible platform';

export const ACTION_SAVE_LAST_FIELD = '[pDexV3][swap] Save last field';
export const ACTION_CHANGE_ESTIMATE_DATA =
  '[pDexV3][swap] Change estimate data';
export const ACTION_SET_ERROR = '[pDexV3][swap] Action set error';
export const ACTION_SET_DEFAULT_EXCHANGE =
  '[pDexV3][swap] Set default exchange';
export const ACTION_REMOVE_ERROR =
  '[pDexV3][swap] Action remove error from platforms';
export const ACTION_FREE_HISTORY_ORDERS = '[pDexV3][swap] Free history orders';

export const ACTION_CHANGE_SLIPPAGE = '[pDexV3][swap] Change slippage';

export const ACTION_FETCHING_REWARD_HISTORY =
  '[pDexV3][swap] Fetching reward history';
export const ACTION_FETCHED_REWARD_HISTORY =
  '[pDexV3][swap] Fetched reward history';
export const ACTION_FETCH_FAIL_REWARD_HISTORY =
  '[pDexV3][swap] Fetch fail reward history';

export const ACTION_RESET_DATA = '[pDexV3][swap] Reset data';

export const TAB_SIMPLE_ID = '[swap] simple';
export const TAB_PRO_ID = '[swap] pro';
export const ROOT_TAB_ID = 'ROOT_TAB_SWAP';

export const ROOT_TAB_SUB_INFO = 'ROOT_TAB_SUB_INFO';
export const TAB_HISTORY_ID = '[swap_sub_info] history order';

export const ROOT_TAB_SWAP_HISTORY = 'ROOT_TAB_SWAP_HISTORY';
export const TAB_SWAP_HISTORY_ID = 'swap_sub_info] swap history';
export const TAB_REWARD_HISTORY_ID = '[swap_sub_info] reward history';

export const SCREENS_TO_SHOW_REWARD_HISTORY_TAB = [
  routeNames.PrivacyAppsPancake,
  routeNames.PrivacyAppsUni,
  routeNames.PrivacyAppsCurve,
];

export const formConfigs = {
  formName: 'FORM_SWAP',
  selltoken: 'selltoken',
  buytoken: 'buytoken',
  slippagetolerance: 'slippagetolerance',
  feetoken: 'feetoken',
};

export const KEYS_PLATFORMS_SUPPORTED = {
  incognito: 'incognito',
  pancake: 'pancake',
  uni: 'uni',
  curve: 'curve',
};

export const PLATFORMS_SUPPORTED = [
  {
    id: KEYS_PLATFORMS_SUPPORTED.incognito,
    title: 'Incognito',
    desc: '',
    visible: true,
    isSelected: true,
  },
  {
    id: KEYS_PLATFORMS_SUPPORTED.pancake,
    title: 'PancakeSwap',
    desc: '',
    visible: true,
    isSelected: false,
  },
  {
    id: KEYS_PLATFORMS_SUPPORTED.uni,
    title: 'Uniswap',
    desc: '',
    visible: true,
    isSelected: false,
  },
  {
    id: KEYS_PLATFORMS_SUPPORTED.curve,
    title: 'Curve',
    desc: '',
    visible: true,
    isSelected: false,
  },
];
