import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

const { width, height } = Dimensions.get('window');

export default function AuthWelcome() {
  const { theme, language } = useApp();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 60,
    },
    logo: {
      width: 120,
      height: 120,
      borderRadius: 30,
      marginBottom: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Inter-Bold',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 10,
      fontFamily: language.code === 'ar' ? 'Cairo-Bold' : 'Inter-Bold',
    },
    subtitle: {
      fontSize: 18,
      color: 'rgba(255, 255, 255, 0.9)',
      textAlign: 'center',
      marginBottom: 60,
      fontFamily: language.code === 'ar' ? 'Cairo-Regular' : 'Inter-Regular',
    },
    buttonContainer: {
      width: '100%',
      gap: 16,
    },
    button: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 32,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    primaryButton: {
      backgroundColor: '#FFFFFF',
    },
    buttonText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
      fontFamily: language.code === 'ar' ? 'Cairo-SemiBold' : 'Inter-SemiBold',
    },
    primaryButtonText: {
      color: '#2563EB',
    },
    features: {
      position: 'absolute',
      bottom: 40,
      left: 20,
      right: 20,
    },
    featureText: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      fontFamily: language.code === 'ar' ? 'Cairo-Regular' : 'Inter-Regular',
    },
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#1D4ED8', '#1E40AF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>M</Text>
            </View>
            <Text style={styles.title}>
              {language.code === 'ar' ? 'مايكرو بوس' : 'MicroPOS'}
            </Text>
            <Text style={styles.subtitle}>
              {language.code === 'ar' 
                ? 'نظام إدارة المتاجر الذكي' 
                : 'Smart Retail Management System'
              }
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                {language.code === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/auth/register')}
            >
              <Text style={styles.buttonText}>
                {language.code === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.features}>
            <Text style={styles.featureText}>
              {language.code === 'ar' 
                ? 'إدارة المبيعات • المخزون • العملاء • التقارير' 
                : 'Sales Management • Inventory • Customers • Reports'
              }
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}