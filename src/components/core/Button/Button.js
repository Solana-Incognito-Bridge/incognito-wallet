import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {COLORS, FONT} from '@src/styles';

export const BTNPrimary = React.memo(({
  title,
  background,
  wrapperStyle,
  textStyle,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={[
        styled.wrapper,
        background && { backgroundColor: background },
        wrapperStyle
      ]}
      onPress={onPress}
    >
      <Text style={[styled.primaryText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
});

export const BTNBorder = React.memo(({
  title,
  background,
  wrapperStyle,
  textStyle,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={[
        styled.wrapper,
        styled.border,
        background && { backgroundColor: background },
        wrapperStyle
      ]}
      onPress={onPress}
    >
      <Text style={[styled.normalText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
});

const styled = StyleSheet.create({
  wrapper: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 25
  },
  primaryText: {
    ...FONT.STYLE.medium,
    color: COLORS.white,
    fontSize: FONT.SIZE.medium,
  },
  normalText: {
    ...FONT.STYLE.medium,
    color: COLORS.green2,
    fontSize: FONT.SIZE.medium,
  },
  border: {
    borderColor: COLORS.green2,
    borderWidth: 1
  }
});

BTNPrimary.defaultProps = {
  background: COLORS.green2,
  wrapperStyle: null,
  textStyle: null
};

BTNPrimary.propTypes = {
  title: PropTypes.string.isRequired,
  background: PropTypes.string,
  wrapperStyle: PropTypes.any,
  onPress: PropTypes.func.isRequired,
  textStyle: PropTypes.any,
};

BTNBorder.defaultProps = {
  background: null,
  wrapperStyle: null,
  textStyle: null
};

BTNBorder.propTypes = {
  title: PropTypes.string.isRequired,
  background: PropTypes.string,
  wrapperStyle: PropTypes.any,
  onPress: PropTypes.func.isRequired,
  textStyle: PropTypes.any,
};

