import { Text, TouchableOpacity, View } from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
import { sectionStyle } from './style';

const SectionItem = ({ data: { icon, title, desc, handlePress } }) => (
  <TouchableOpacity style={sectionStyle.item} onPress={handlePress}>
    <View style={sectionStyle.iconContainer}>{icon}</View>
    <View style={sectionStyle.infoContainer}>
      <Text style={sectionStyle.titleItem}>{title}</Text>
      <Text>{desc}</Text>
    </View>
  </TouchableOpacity>
);

const Section = ({ label, items, customItems, headerRight }) => (
  <View style={sectionStyle.container}>
    <View style={sectionStyle.header}>
      <Text style={sectionStyle.label}>{label}</Text>
      {headerRight}
    </View>
    <View style={sectionStyle.items}>
      {customItems
        ? customItems
        : (items &&
            items.map((item, index) => <SectionItem key={index} data={item} />)
        )
      }
    </View>
  </View>
);

const itemShape = PropTypes.shape({
  icon: PropTypes.node,
  title: PropTypes.string,
  desc: PropTypes.string,
  handlePress: PropTypes.func
});

Section.defaultProps = {
  label: '',
  items: undefined,
  customItems: undefined
};
Section.propTypes = {
  label: PropTypes.string,
  items: PropTypes.arrayOf(itemShape),
  customItems: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.element), PropTypes.element ]),
};

SectionItem.defaultProps = {
  data: undefined,
};
SectionItem.propTypes = {
  data: itemShape
};

export default Section;
