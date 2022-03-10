import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';
import AppImg from '@assets/images/app-icon.png';

const styled = StyleSheet.create({
  icon: {
    width: 34,
    height: 34,
    backgroundColor: COLORS.black,
    borderRadius: 80,
  },
});

const AppIcon = (props) => {
  return <Image source={AppImg} style={[styled.icon, props?.style]} />;
};

AppIcon.propTypes = {};

export default AppIcon;
