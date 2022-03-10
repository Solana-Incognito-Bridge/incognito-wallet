import React from 'react';
import { StyleSheet, ImageProps } from 'react-native';
import { Image } from '@src/components/core';
import { COLORS } from '@src/styles';
import uniSrcIcon from '@src/assets/images/new-icons/uni.png';

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const UniIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={uniSrcIcon} style={[styled.icon, style]} {...rest} />;
};

UniIcon.propTypes = {};

export default UniIcon;
