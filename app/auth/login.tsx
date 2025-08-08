import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Login() {
  const { theme, language, login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      marginBottom: 40,
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
    forgotPassword: {
      alignSelf: 'center',
      marginTop: 16,
      marginBottom: 24,
    },
    forgotPasswordText: {
      fontSize: 14,
      color: theme.colors.primary,
      fontFamily: language.code === 'ar' ? 'Cairo-Medium' : 'Inter-Medium',
    },
    registerContainer: {
      flexDirection: language.isRTL ? 'row-reverse' : 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
    },
    registerText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontFamily: language.code === 'ar' ? 'Cairo-Regular' : 'Inter-Regular',
    },
    registerLink: {
      fontSize: 14,
      color: theme.colors.primary,
      fontWeight: '600',
      marginLeft: language.isRTL ? 0 : 4,
      marginRight: language.isRTL ? 4 : 0,
      fontFamily: language.code === 'ar' ? 'Cairo-SemiBold' : 'Inter-SemiBold',
    },
  });

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        language.code === 'ar' ? 'خطأ' : 'Error',
        language.code === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields'
      );
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const success = login(email, password);
      setLoading(false);
      
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          language.code === 'ar' ? 'خطأ في تسجيل الدخول' : 'Login Error',
          language.code === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password'
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
                {language.code === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.title}>
                {language.code === 'ar' ? 'مرحباً بعودتك' : 'Welcome Back'}
              </Text>
              <Text style={styles.subtitle}>
                {language.code === 'ar' 
                  ? 'سجل دخولك للوصول إلى حسابك' 
                  : 'Sign in to access your account'
                }
              </Text>

              <Input
                label={language.code === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                value={email}
                onChangeText={setEmail}
                placeholder={language.code === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Mail size={20} color={theme.colors.textSecondary} />}
              />

              <Input
                label={language.code === 'ar' ? 'كلمة المرور' : 'Password'}
                value={password}
                onChangeText={setPassword}
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

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  {language.code === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                </Text>
              </TouchableOpacity>

              <Button
                title={language.code === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                onPress={handleLogin}
                loading={loading}
              />

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>
                  {language.code === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"}
                </Text>
                <TouchableOpacity onPress={() => router.push('/auth/register')}>
                  <Text style={styles.registerLink}>
                    {language.code === 'ar' ? 'إنشاء حساب' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}