import React from 'react';
import { StyleSheet, ImageProps } from 'react-native';
import { Image } from '@src/components/core';
import curveSrcIcon from '@src/assets/images/new-icons/curve.png';

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
  },
});

const CurveIcon = (props: ImageProps) => {
  const { style, ...rest } = props;
  return <Image source={curveSrcIcon} style={[styled.icon, style]} {...rest} />;
};

CurveIcon.propTypes = {};

export default CurveIcon;
