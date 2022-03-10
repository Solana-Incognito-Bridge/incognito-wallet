import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView, Text, TouchableOpacity } from '@src/components/core';
import Row from '@src/components/Row';
import PropTypes from 'prop-types';
import { FONT } from '@src/styles';
import ModalBottomSheet from '@src/components/Modal/features/ModalBottomSheet';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme';
import { AppIcon, PancakeIcon, UniIcon, CurveIcon } from '@src/components/Icons';
import { KEYS_PLATFORMS_SUPPORTED } from '@src/screens/PDexV3/features/Swap';

const styled = StyleSheet.create({
  touchWrapper: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
  },
  item: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    ...FONT.TEXT.incognitoP1,
    marginLeft: 10,
    flex: 1,
  },
  titleSelectItem: {
    ...FONT.TEXT.incognitoH6,
    marginLeft: 14,
    flex: 1,
  },
  desc: {
    fontSize: FONT.SIZE.regular,
    fontFamily: FONT.NAME.regular,
    width: '100%',
    textAlign: 'right',
  },
  left: {
    maxWidth: 120,
    display: 'flex',
    alignItems: 'center',
  },
  right: {
    flex: 1,
    marginLeft: 15,
  },
  scrollview: {
    flex: 1,
    paddingHorizontal: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 24,
    resizeMode: 'contain',
  },
  selectedIcon: {
    width: 15,
    height: 15,
    borderRadius: 15,
    resizeMode: 'contain',
  },
});

export const SelectItem = React.memo(
  ({
    id,
    title,
    desc,
    onPressItem,
    itemStyled,
    isSelectItem,
    lastChild = false,
    firstChild = false,
  }) => {
    const colors = useSelector(colorsSelector);
    let icon = null;
    switch (id) {
    case KEYS_PLATFORMS_SUPPORTED.incognito:
      icon = (
        <AppIcon style={!isSelectItem ? styled.selectedIcon : styled.icon} />
      );
      break;
    case KEYS_PLATFORMS_SUPPORTED.pancake:
      icon = (
        <PancakeIcon
          style={!isSelectItem ? styled.selectedIcon : styled.icon}
        />
      );
      break;
    case KEYS_PLATFORMS_SUPPORTED.uni:
      icon = (
        <UniIcon style={!isSelectItem ? styled.selectedIcon : styled.icon} />
      );
      break;
    case KEYS_PLATFORMS_SUPPORTED.curve:
      icon = (
        <CurveIcon style={!isSelectItem ? styled.selectedIcon : styled.icon} />
      );
      break;
    default:
      break;
    }
    return (
      <TouchableOpacity
        onPress={() => {
          if (typeof onPressItem === 'function') {
            // from props
            onPressItem(id);
          }
        }}
        style={[
          styled.touchWrapper,
          isSelectItem
            ? {
              padding: 0,
              borderRadius: 0,
              paddingHorizontal: 24,
              paddingVertical: 16,
              borderBottomWidth: 2,
              borderBottomColor: lastChild ? 'transparent' : colors.grey8,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              borderTopLeftRadius: firstChild ? 24 : 0,
              borderTopRightRadius: firstChild ? 24 : 0,
            }
            : {
              backgroundColor: colors.grey9,
              borderColor: colors.against,
              borderWidth: 1
            },
        ]}
      >
        <Row style={[styled.item, itemStyled]}>
          <Row style={styled.left}>
            {icon && icon}
            <Text
              style={isSelectItem ? styled.titleSelectItem : styled.title}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </Row>
          <View style={styled.right}>
            <Text style={styled.desc} numberOfLines={1} ellipsizeMode="tail">
              {desc}
            </Text>
          </View>
        </Row>
      </TouchableOpacity>
    );
  },
);

SelectItem.defaultProps = {
  isSelectItem: true,
};

SelectItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  srcIcon: PropTypes.any,
  onPressItem: PropTypes.func.isRequired,
  isSelectItem: PropTypes.bool,
};

const SelectOptionModal = ({ options }) => {
  return (
    <ModalBottomSheet
      style={{
        height: 130,
        paddingHorizontal: 0,
        paddingVertical: 0,
      }}
      customContent={(
        <ScrollView style={styled.scrollview}>
          {options.map((option, index, arr) => (
            <SelectItem
              key={option?.id}
              {...{
                ...option,
                lastChild: index === arr.length - 1,
                firstChild: index === 0,
              }}
            />
          ))}
        </ScrollView>
      )}
    />
  );
};

SelectOptionModal.propTypes = {};

export default React.memo(SelectOptionModal);
