import {COLORS, FONT} from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  button: {
    marginVertical: 50,
  },
  buttonTitle: {
    fontSize: FONT.SIZE.medium,
    marginBottom: 5,
    ...FONT.STYLE.medium,
  },
  error: {
    color: COLORS.red,
  },
  bold: {
    ...FONT.STYLE.bold,
    color: COLORS.black,
  },
  content: {
    fontSize: FONT.SIZE.regular,
    color: COLORS.lightGrey16,
  },
  historyItem: {
    paddingVertical: 15,
  },
  historyTitle: {
    overflow: 'hidden',
  },
  right: {
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ellipsis: {
    flex: 1,
    marginRight: 25,
  },
});
