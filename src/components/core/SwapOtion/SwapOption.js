import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  Text,
  TouchableOpacity,
  View,
} from '@src/components/core';
import { COLORS, FONT } from '@src/styles';


const styled = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: COLORS.colorGreyBold,
    fontFamily: FONT.NAME.specialMedium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.medium + 4,
  },
  contentView: {
    margin: 4,
  },
  selectedButton: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    padding: 15,
    borderRadius: 16,
    borderWidth: 0,
    backgroundColor: '#EFEFEF',
  },
  unSelectedButon: {
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.colorGreyLight,
  },
});

const SwapOption = (props) => {
  const {
    platforms,
  } = props || {};
  const [selectedPlatform, setSelectedPlatform] = React.useState(0);
  const handlePress = (index) => {
    setSelectedPlatform(index);
  };

  return (
    <View style={styled.container}>
      { platforms && platforms.length > 1 &&
        platforms.map((item, index) => {
          return (
            <TouchableOpacity
              style={index === selectedPlatform ? styled.selectedButton : styled.unSelectedButon}
              key={`key-${index}`}
              onPress={() => handlePress(index)}
            >
              <View style={styled.contentView}>
                <Text style={[styled.text, { marginRight: 20, color: index === selectedPlatform ? COLORS.black : COLORS.colorGreyBold }]}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      }
    </View>
  );
};

SwapOption.defaultProps = {
};

SwapOption.propTypes = {
  platforms: PropTypes.array,
};

export default React.memo(SwapOption);
