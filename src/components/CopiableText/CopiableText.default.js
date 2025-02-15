import React from 'react';
import { StyleSheet, Clipboard } from 'react-native';
import { ButtonBasic } from '@src/components/Button';
import { View3 } from '@src/components/core/View';
import { Text9 } from '@src/components/core/Text';
import { FONT } from '@src/styles';
import PropTypes from 'prop-types';

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
  },
  btnStyle: {
    height: 40,
    paddingHorizontal: 20,
    maxWidth: 100
  },
  titleStyle: {
    fontSize: FONT.SIZE.regular - 1,
  },
});

const CopiableText = props => {
  const { data, textStyle, btnStyle } = props;
  const [copied, setCopied] = React.useState(false);
  const handleCopyText = () => {
    Clipboard.setString(data);
    setCopied(true);
  };
  return (
    <View3 style={styled.container}>
      <Text9 style={[styled.text, textStyle]} numberOfLines={1} ellipsizeMode="middle">
        {data}
      </Text9>
      <ButtonBasic
        btnStyle={[styled.btnStyle, btnStyle]}
        titleStyle={styled.titleStyle}
        title={copied ? 'Copied' : 'Copy'}
        onPress={handleCopyText}
      />
    </View3>
  );
};

CopiableText.defaultProps = {
  textStyle: undefined
};

CopiableText.propTypes = {
  data: PropTypes.string.isRequired,
  textStyle: PropTypes.any
};

export default CopiableText;
