import React, {useEffect} from 'react';
import {TouchableOpacity, Text, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function IconButton({
  onPress,
  containerStyle,
  iconName,
  iconSize,
  color,
  iconStyle,
  title,
  textStyle,
}) {
  return (
    <TouchableOpacity onPress={onPress} style={containerStyle}>
      <Icon name={iconName} size={iconSize} color={color} style={iconStyle} />
      {title ? <Text style={textStyle}>{title}</Text> : <></>}
    </TouchableOpacity>
  );
}
