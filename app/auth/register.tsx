import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Register() {
  const { theme, language, register } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    gradient: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    header: {
      flexDirection: language.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginBottom: 20,
      marginTop: 20,
    },
    backButton: {
      padding: 8,
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginLeft: language.isRTL ? 0 : 16,
      marginRight: language.isRTL ? 16 : 0,
      fontFamily: language.code === 'ar' ? 'Cairo-Bold' : 'Inter-Bold',
    },
    formContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 24,
      padding: 24,
      marginTop: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 8,
      fontFamily: language.code === 'ar' ? 'Cairo-Bold' : 'Inter-Bold',
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
      fontFamily: language.code === 'ar' ? 'Cairo-Regular' : 'Inter-Regular',
    },
    loginContainer: {
      flexDirection: language.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
    },
    loginText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontFamily: language.code === 'ar' ? 'Cairo-Regular' : 'Inter-Regular',
    },
    loginLink: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
      marginLeft: language.isRTL ? 0 : 4,
      marginRight: language.isRTL ? 4 : 0,
      fontFamily: language.code === 'ar' ? 'Cairo-SemiBold' : 'Inter-SemiBold',
    },
  });

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert(
        language.code === 'ar' ? 'خطأ' : 'Error',
        language.code === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields'
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert(
        language.code === 'ar' ? 'خطأ' : 'Error',
        language.code === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match'
      );
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert(
        language.code === 'ar' ? 'خطأ' : 'Error',
        language.code === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters'
      );
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const success = register(formData);
      setLoading(false);
      
      if (success) {
        Alert.alert(
          language.code === 'ar' ? 'تم إنشاء الحساب' : 'Account Created',
          language.code === 'ar' ? 'تم إنشاء حسابك بنجاح' : 'Your account has been created successfully',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } else {
        Alert.alert(
          language.code === 'ar' ? 'خطأ' : 'Error',
          language.code === 'ar' ? 'فشل في إنشاء الحساب' : 'Failed to create account'
        );
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#1D4ED8', '#1E40AF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.content}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <ArrowLeft 
                  size={24} 
                  color="#FFFFFF" 
                  style={{ transform: [{ scaleX: language.isRTL ? -1 : 1 }] }}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {language.code === 'ar' ? 'إنشاء حساب' : 'Create Account'}
              </Text>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>
                {language.code === 'ar' ? 'إنشاء حساب جديد' : 'Create New Account'}
              </Text>
              <Text style={styles.subtitle}>
                {language.code === 'ar' 
                  ? 'أنشئ حسابك للبدء في استخدام مايكرو بوس' 
                  : 'Create your account to get started with MicroPOS'
                }
              </Text>

              <Input
                label={language.code === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder={language.code === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                icon={<User size={20} color={theme.colors.textSecondary} />}
              />

              <Input
                label={language.code === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder={language.code === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Mail size={20} color={theme.colors.textSecondary} />}
              />

              <Input
                label={language.code === 'ar' ? 'اسم المتجر (اختياري)' : 'Business Name (Optional)'}
                value={formData.businessName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, businessName: text }))}
                placeholder={language.code === 'ar' ? 'أدخل اسم متجرك' : 'Enter your business name'}
                icon={<Building size={20} color={theme.colors.textSecondary} />}
              />

              <Input
                label={language.code === 'ar' ? 'كلمة المرور' : 'Password'}
                value={formData.password}
                onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                placeholder={language.code === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                secureTextEntry={!showPassword}
                icon={<Lock size={20} color={theme.colors.textSecondary} />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff size={20} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                }
              />

              <Input
                label={language.code === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                placeholder={language.code === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                secureTextEntry={!showConfirmPassword}
                icon={<Lock size={20} color={theme.colors.textSecondary} />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                }
              />

              <Button
                title={language.code === 'ar' ? 'إنشاء الحساب' : 'Create Account'}
                onPress={handleRegister}
                loading={loading}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  {language.code === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
                </Text>
                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                  <Text style={styles.loginLink}>
                    {language.code === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}