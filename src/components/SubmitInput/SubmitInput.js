import React from 'react';
import { StyleSheet, Clipboard } from 'react-native';
import { ButtonBasic } from '@src/components/Button';
import { View3 } from '@src/components/core/View';
import { Text9 } from '@src/components/core/Text';
import { FONT } from '@src/styles';
import PropTypes from 'prop-types';
import { TextInput, Toast } from '@components/core';
import http from '@services/http';
import useDebounceSelector from '@src/shared/hooks/debounceSelector';
import { defaultAccountSelector } from '@src/redux/selectors/account';

const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    flex: 1,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    marginHorizontal: 15,
    marginTop: 0
  },
  btnStyle: {
    height: 40,
    paddingHorizontal: 20,
    maxWidth: 115
  },
  titleStyle: {
    fontSize: FONT.SIZE.regular - 1,
  },
});

const SubmitInput = props => {
  const { placeHolder, textStyle, btnStyle, containerStyle } = props;
  const [text, setText] = React.useState('');
  const [isSubmited, setIsSubmited] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const account = useDebounceSelector(defaultAccountSelector);
  const handleSubmitInput = React.useCallback(async () => {
    try {
      setIsSubmited(false);
      setIsSubmitting(true);
      await http.post('sol/add-tx-transfer', {
        TxID: text,
        WalletAddress: account?.paymentAddress
      });
      setIsSubmited(true);
      Toast.showSuccess('Submited');
    } catch (e) {
      Toast.showError(`Submit failed with error ${e}`);
      console.log('SUBMIT FAIL', e);
    } finally {
      setIsSubmitting(false);
    }
  }, [text]);
  const onChangeText = React.useCallback((text) => {
    setText(text);
  }, []);
  return (
    <View3 style={[styled.container, containerStyle]}>
      <TextInput style={[styled.text, textStyle]} numberOfLines={1} placeholder={placeHolder} onChangeText={onChangeText} />
      <ButtonBasic
        btnStyle={[styled.btnStyle, btnStyle]}
        titleStyle={styled.titleStyle}
        title={isSubmited ? 'Submited' : isSubmitting ? 'Submitting' : 'Submit'}
        onPress={handleSubmitInput}
      />
    </View3>
  );
};

SubmitInput.defaultProps = {
  textStyle: undefined,
  btnStyle: undefined
};

SubmitInput.propTypes = {
  placeHolder: PropTypes.string.isRequired,
  textStyle: PropTypes.any,
  btnStyle: PropTypes.any,
  onSubmit: PropTypes.func.isRequired,
};

export default SubmitInput;
