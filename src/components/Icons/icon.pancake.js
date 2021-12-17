import React from 'react';
import { StyleSheet } from 'react-native';
import { Image } from '@src/components/core';
import { COLORS } from '@src/styles';
import pancakeSrcIcon from '@src/assets/images/new-icons/pancake.png';

const styled = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.black,
    borderRadius: 80,
  },
});

const PancakeIcon = (props) => {
  return <Image source={pancakeSrcIcon} style={styled.icon} />;
};

PancakeIcon.propTypes = {};

export default PancakeIcon;
