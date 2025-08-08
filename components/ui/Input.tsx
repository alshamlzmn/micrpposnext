import React from 'react';
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native';
import { useApp } from '@/contexts/AppContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export function Input({ label, error, icon, rightIcon, style, loading, ...props }: InputProps) {
  const { theme, language } = useApp();
  
  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: language.isRTL ? 'right' : 'left',
      fontFamily: language.code === 'ar' ? 'Cairo-Medium' : 'Inter-Medium',
    },
    inputContainer: {
      flexDirection: language.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: error ? theme.colors.error : theme.colors.border,
      borderRadius: 8,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.colors.text,
      textAlign: language.isRTL ? 'right' : 'left',
      fontFamily: language.code === 'ar' ? 'Cairo-Regular' : 'Inter-Regular',
    },
    error: {
      fontSize: 12,
      color: theme.colors.error,
      marginTop: 4,
      textAlign: language.isRTL ? 'right' : 'left',
      fontFamily: language.code === 'ar' ? 'Cairo-Regular' : 'Inter-Regular',
    },
    icon: {
      marginHorizontal: 8,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {icon && (
          <View style={styles.icon}>
            {typeof icon === 'string' ? <Text>{icon}</Text> : icon}
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.textSecondary}
          editable={!loading}
          {...props}
        />
        {rightIcon && (
          <View style={styles.icon}>
            {typeof rightIcon === 'string' ? <Text>{rightIcon}</Text> : rightIcon}
          </View>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}