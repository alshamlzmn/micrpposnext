import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { useApp } from '@/contexts/AppContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const { theme, language } = useApp();
  
  const styles = StyleSheet.create({
    button: {
      borderRadius: 8,
      flexDirection: language.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      ...(size === 'small' && { paddingVertical: 8, paddingHorizontal: 12 }),
      ...(size === 'medium' && { paddingVertical: 12, paddingHorizontal: 16 }),
      ...(size === 'large' && { paddingVertical: 16, paddingHorizontal: 24 }),
      ...(variant === 'primary' && {
        backgroundColor: theme.colors.primary,
      }),
      ...(variant === 'secondary' && {
        backgroundColor: theme.colors.secondary,
      }),
      ...(variant === 'outline' && {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      }),
      ...(variant === 'ghost' && {
        backgroundColor: 'transparent',
      }),
      ...(variant === 'ghost' && {
        paddingVertical: size === 'small' ? 6 : size === 'medium' ? 10 : 14,
      }),
      ...((disabled || loading) && {
        opacity: 0.5,
      }),
    },
    text: {
      fontWeight: '600',
      textAlign: 'center',
      fontFamily: language.code === 'ar' ? 'Cairo-SemiBold' : 'Inter-SemiBold',
      ...(size === 'small' && { fontSize: 14 }),
      ...(size === 'medium' && { fontSize: 16 }),
      ...(size === 'large' && { fontSize: 18 }),
      ...(variant === 'primary' && {
        color: '#FFFFFF',
      }),
      ...(variant === 'secondary' && {
        color: '#FFFFFF',
      }),
      ...(variant === 'outline' && {
        color: theme.colors.primary,
      }),
      ...(variant === 'ghost' && {
        color: theme.colors.primary,
      }),
    },
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#FFFFFF'} 
        />
      ) : (
        <>
          {typeof icon === 'string' ? <Text style={styles.text}>{icon}</Text> : icon}
          {title && <Text style={[styles.text, textStyle]}>{title}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
}