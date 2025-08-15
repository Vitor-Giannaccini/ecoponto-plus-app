// components/CategoryIcon.js

import React from 'react';
import { Ionicons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';

const CategoryIcon = ({ icon, size, color, style }) => {
  if (!icon) return null;

  if (icon.library === 'Ionicons') {
    return <Ionicons name={icon.name} size={size} color={color} style={style} />;
  }
  if (icon.library === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={icon.name} size={size} color={color} style={style} />;
  }
  if (icon.library === 'FontAwesome6') {
    return <FontAwesome6 name={icon.name} size={size} color={color} style={style} />;
  }
  return null;
};

export default CategoryIcon;