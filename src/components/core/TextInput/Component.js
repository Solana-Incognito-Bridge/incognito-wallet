import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  TextInput as RNComponent,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '@src/styles';
import styleSheet from './style';

const TextInput = ({
  containerStyle,
  inputStyle,
  style,
  prependView,
  appendView,
  label,
  onFocus,
  onBlur,
  clearable,
  maxLength,
  onRef,
  labelStyle,
  oldVersion = false,
  canEditable,
  rightLabel,
  numberOfLines,
  ...props
}) => {
  const [focus, setFocus] = useState(false);
  let textInput = React.createRef();

  React.useEffect(() => {
    if (textInput && onRef) {
      onRef(textInput);
    }
  }, [textInput]);

  function handleFocus() {
    setFocus(true);
    if (typeof onFocus === 'function') {
      onFocus.apply(this, arguments);
    }
  }

  function handleBlur() {
    setFocus(false);
    if (typeof onBlur === 'function') {
      onBlur.apply(this, arguments);
    }
  }

  function handleClear() {
    const { onChangeText } = props;
    textInput.current.clear();
    Keyboard.dismiss();
    if (onChangeText) {
      onChangeText('');
    }
  }

  console.log('SANG TEST: ', canEditable, numberOfLines === 0);
  return (
    <View style={[styleSheet.container, style]}>
      {label && (
        <View style={[styleSheet.labelContainer]}>
          <Text
            style={[
              styleSheet.label,
              oldVersion && styleSheet.labelOld,
              labelStyle,
              focus && oldVersion && styleSheet.labelFocus,
            ]}
          >
            {label}
          </Text>
          {rightLabel}
        </View>
      )}
      <View
        style={[
          styleSheet.row,
          oldVersion && styleSheet.rowOld,
          containerStyle,
          focus && oldVersion && styleSheet.focus,
          !canEditable && numberOfLines === 0 && styleSheet.autoRow,
        ]}
      >
        {appendView}
        {canEditable ? (
          <RNComponent
            ref={textInput}
            allowFontScaling={false}
            placeholderTextColor={COLORS.colorGreyBold}
            returnKeyType="done"
            maxLength={maxLength}
            style={[
              styleSheet.input,
              oldVersion && styleSheet.oldInput,
              inputStyle,
            ]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoCapitalize="none"
            spellCheck={false}
            textAlignVertical="center"
            autoCompleteType="off"
            autoCorrect={false}
            ellipsizeMode="middle"
            numberOfLines={1}
            {...props}
          />
        ) : (
          <Text
            style={styleSheet.input}
            numberOfLines={numberOfLines}
            ellipsizeMode="middle"
          >
            {props?.defaultValue || ''}
          </Text>
        )}

        {clearable && focus && (
          <TouchableOpacity onPress={handleClear}>
            <Icon
              name="ios-close-circle"
              type="ionicon"
              color={COLORS.newGrey}
              size={20}
            />
          </TouchableOpacity>
        )}
        {prependView}
      </View>
    </View>
  );
};

TextInput.defaultProps = {
  label: null,
  containerStyle: null,
  inputStyle: null,
  prependView: null,
  appendView: null,
  clearable: false,
  onChangeText: undefined,
  onFocus: undefined,
  onBlur: undefined,
  style: null,
  maxLength: null,
  labelStyle: null,
  oldVersion: false,
  onRef: null,
  canEditable: true,
  rightLabel: null,
  numberOfLines: 1,
};

TextInput.propTypes = {
  containerStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  prependView: PropTypes.element,
  appendView: PropTypes.element,
  label: PropTypes.string,
  clearable: PropTypes.bool,
  onChangeText: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  style: PropTypes.object,
  maxLength: PropTypes.number,
  labelStyle: PropTypes.any,
  oldVersion: PropTypes.bool,
  onRef: PropTypes.func,
  canEditable: PropTypes.bool,
  rightLabel: PropTypes.element,
  numberOfLines: PropTypes.number,
};

export default TextInput;
