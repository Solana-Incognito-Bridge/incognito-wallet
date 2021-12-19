import React from 'react';
import { Image } from 'react-native';
import srcInfoIcon from '@src/assets/images/icons/info_icon.png';
import srcInfoIconBlack from '@src/assets/images/icons/info_icon_black.png';
import PropTypes from 'prop-types';
import { Image1 } from '@components/core';

const InfoIcon = (props) => {
  const { isBlack } = props;
  return (
    <Image1
      source={isBlack ? srcInfoIconBlack : srcInfoIcon}
      style={{
        width: 18,
        height: 18,
      }}
    />
  );
};

InfoIcon.defaultProps = {
  isBlack: false,
};

InfoIcon.propTypes = {
  isBlack: PropTypes.bool,
};

export default InfoIcon;
