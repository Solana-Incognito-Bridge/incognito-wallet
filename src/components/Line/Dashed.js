import React from 'react';
import {Image, StyleSheet} from 'react-native';
import srcDashed from '@src/assets/images/icons/dashed.png';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {
    height: 2,
    width: '100%',
    marginVertical: 10,
  },
});

const Dashed = ({source, ...rest}) => {
  return <Image source={source} style={styled.container} {...rest} />;
};

Dashed.defaultProps = {
  source: srcDashed,
};

Dashed.propTypes = {
  source: PropTypes.string,
};

export default Dashed;
