import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Wallet, 
  Plus, 
  Minus, 
  Calendar,
  FileText,
  X,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
} from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CashboxTransaction } from '@/types/global';

export default function Cashbox() {
  const { 
    theme, 
    language, 
    cashboxTransactions, 
    addCashboxTransaction, 
    updateCashboxTransaction,
    deleteCashboxTransaction,
    getCashboxBalance,
    settings,
  } = useApp();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSubtractModal, setShowSubtractModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<CashboxTransaction | null>(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    descriptionAr: '',
    isActive: true,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5865F2',
    },
    header: {
      backgroundColor: '#5865F2',
      paddingHorizontal: 20,
      paddingVertical: 15,
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      fontFamily: 'Cairo-Bold',
    },
    content: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      padding: 16,
    },
    balanceCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    balanceLabel: {
      fontSize: 16,
      color: '#666',
      marginBottom: 8,
      fontFamily: 'Cairo-Regular',
    },
    balanceAmount: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#5865F2',
      marginBottom: 20,
      fontFamily: 'Cairo-Bold',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    actionButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    addButton: {
      backgroundColor: '#10B981',
    },
    subtractButton: {
      backgroundColor: '#EF4444',
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 16,
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
    },
    transactionCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 12,
    },
    addIcon: {
      backgroundColor: '#10B981' + '20',
    },
    subtractIcon: {
      backgroundColor: '#EF4444' + '20',
    },
    transactionInfo: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 4,
      fontFamily: 'Cairo-Bold',
      textAlign: 'right',
    },
    transactionDate: {
      fontSize: 12,
      color: '#666',
      fontFamily: 'Cairo-Regular',
      textAlign: 'right',
    },
    transactionAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: 'Cairo-Bold',
      marginRight: 12,
    },
    addAmount: {
      color: '#10B981',
    },
    subtractAmount: {
      color: '#EF4444',
    },
    inactiveTransaction: {
      opacity: 0.5,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 50,
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
      fontFamily: 'Cairo-Regular',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      width: '90%',
      maxWidth: 400,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      fontFamily: 'Cairo-Bold',
    },
    closeButton: {
      padding: 4,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    switchLabel: {
      fontSize: 16,
      color: '#333',
      fontFamily: 'Cairo-Medium',
    },
    transactionActions: {
      flexDirection: 'row',
      gap: 8,
    },
    editButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#5865F2' + '20',
    },
    deleteButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: '#EF4444' + '20',
    },
  });

  const currentBalance = getCashboxBalance();
  const todayTransactions = cashboxTransactions.filter(t => {
    const today = new Date();
    const transactionDate = new Date(t.date);
    return transactionDate.toDateString() === today.toDateString();
  });

  const handleAddTransaction = (type: 'add' | 'subtract') => {
    if (!formData.amount || !formData.descriptionAr) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const transaction: CashboxTransaction = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(formData.amount),
      description: formData.description || formData.descriptionAr,
      descriptionAr: formData.descriptionAr,
      date: new Date(),
      isActive: formData.isActive,
      source: 'manual',
    };

    addCashboxTransaction(transaction);
    
    setFormData({
      amount: '',
      description: '',
      descriptionAr: '',
      isActive: true,
    });
    
    setShowAddModal(false);
    setShowSubtractModal(false);
    
    Alert.alert('نجح', `تم ${type === 'add' ? 'إضافة' : 'خصم'} المبلغ بنجاح`);
  };

  const handleEditTransaction = (transaction: CashboxTransaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount.toString(),
      description: transaction.description,
      descriptionAr: transaction.descriptionAr,
      isActive: transaction.isActive,
    });
    setShowEditModal(true);
  };

  const handleUpdateTransaction = () => {
    if (!editingTransaction || !formData.amount || !formData.descriptionAr) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const updatedTransaction: CashboxTransaction = {
      ...editingTransaction,
      amount: parseFloat(formData.amount),
      description: formData.description || formData.descriptionAr,
      descriptionAr: formData.descriptionAr,
      isActive: formData.isActive,
    };

    updateCashboxTransaction(updatedTransaction);
    
    setFormData({
      amount: '',
      description: '',
      descriptionAr: '',
      isActive: true,
    });
    
    setEditingTransaction(null);
    setShowEditModal(false);
    
    Alert.alert('نجح', 'تم تحديث المعاملة بنجاح');
  };

  const handleDeleteTransaction = (transaction: CashboxTransaction) => {
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد من حذف هذه المعاملة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'حذف', 
          style: 'destructive',
          onPress: () => {
            deleteCashboxTransaction(transaction.id);
            Alert.alert('نجح', 'تم حذف المعاملة بنجاح');
          }
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTransactionSourceText = (source: string) => {
    const sources = {
      manual: 'يدوي',
      sale: 'مبيعات',
      purchase: 'مشتريات',
      expense: 'مصروفات',
      customer: 'عميل',
      supplier: 'مورد',
    };
    return sources[source as keyof typeof sources] || source;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الصندوق</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>رصيد الصندوق</Text>
          <Text style={styles.balanceAmount}>
            {currentBalance.toFixed(2)} {settings.currencySymbol}
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.addButton]}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>إضافة</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.subtractButton]}
              onPress={() => setShowSubtractModal(true)}
            >
              <Minus size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>خصم</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>معاملات اليوم</Text>
        
        {todayTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Wallet size={64} color="#999" />
            <Text style={styles.emptyText}>لا توجد معاملات اليوم</Text>
          </View>
        ) : (
          todayTransactions.map((transaction) => (
            <View 
              key={transaction.id} 
              style={[
                styles.transactionCard,
                !transaction.isActive && styles.inactiveTransaction,
              ]}
            >
              <View style={styles.transactionActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditTransaction(transaction)}
                >
                  <Edit size={16} color="#5865F2" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteTransaction(transaction)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.transactionAmount,
                  transaction.type === 'add' ? styles.addAmount : styles.subtractAmount,
                ]}
              >
                {transaction.type === 'add' ? '+' : '-'}{transaction.amount.toFixed(2)}
              </Text>
              
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>
                  {transaction.descriptionAr}
                </Text>
                <Text style={styles.transactionDate}>
                  {formatDate(transaction.date)} • {getTransactionSourceText(transaction.source)}
                </Text>
              </View>
              
              <View
                style={[
                  styles.transactionIcon,
                  transaction.type === 'add' ? styles.addIcon : styles.subtractIcon,
                ]}
              >
                {transaction.type === 'add' ? (
                  <TrendingUp size={20} color="#10B981" />
                ) : (
                  <TrendingDown size={20} color="#EF4444" />
                )}
              </View>
            </View>
          ))
        )}

        {cashboxTransactions.length > todayTransactions.length && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>جميع المعاملات</Text>
            {cashboxTransactions.slice(0, 10).map((transaction) => (
              <View 
                key={transaction.id} 
                style={[
                  styles.transactionCard,
                  !transaction.isActive && styles.inactiveTransaction,
                ]}
              >
                <View style={styles.transactionActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditTransaction(transaction)}
                  >
                    <Edit size={16} color="#5865F2" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTransaction(transaction)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[
                    styles.transactionAmount,
                    transaction.type === 'add' ? styles.addAmount : styles.subtractAmount,
                  ]}
                >
                  {transaction.type === 'add' ? '+' : '-'}{transaction.amount.toFixed(2)}
                </Text>
                
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDescription}>
                    {transaction.descriptionAr}
                  </Text>
                  <Text style={styles.transactionDate}>
                    {formatDate(transaction.date)} • {getTransactionSourceText(transaction.source)}
                  </Text>
                </View>
                
                <View
                  style={[
                    styles.transactionIcon,
                    transaction.type === 'add' ? styles.addIcon : styles.subtractIcon,
                  ]}
                >
                  {transaction.type === 'add' ? (
                    <TrendingUp size={20} color="#10B981" />
                  ) : (
                    <TrendingDown size={20} color="#EF4444" />
                  )}
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Add Transaction Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إضافة مبلغ للصندوق</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowAddModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Input
              label="المبلغ *"
              value={formData.amount}
              onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
              placeholder="0.00"
              keyboardType="numeric"
            />

            <Input
              label="البيان (العربية) *"
              value={formData.descriptionAr}
              onChangeText={(text) => setFormData(prev => ({ ...prev, descriptionAr: text }))}
              placeholder="وصف المعاملة"
            />

            <Input
              label="البيان (English)"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Transaction description"
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>تفعيل المعاملة</Text>
              <Switch
                value={formData.isActive}
                onValueChange={(value) => setFormData(prev => ({ ...prev, isActive: value }))}
                trackColor={{ false: '#E0E0E0', true: '#10B981' }}
                thumbColor={formData.isActive ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="إلغاء"
                onPress={() => setShowAddModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="إضافة"
                onPress={() => handleAddTransaction('add')}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Subtract Transaction Modal */}
      <Modal visible={showSubtractModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>خصم مبلغ من الصندوق</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowSubtractModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Input
              label="المبلغ *"
              value={formData.amount}
              onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
              placeholder="0.00"
              keyboardType="numeric"
            />

            <Input
              label="البيان (العربية) *"
              value={formData.descriptionAr}
              onChangeText={(text) => setFormData(prev => ({ ...prev, descriptionAr: text }))}
              placeholder="وصف المعاملة"
            />

            <Input
              label="البيان (English)"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Transaction description"
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>تفعيل المعاملة</Text>
              <Switch
                value={formData.isActive}
                onValueChange={(value) => setFormData(prev => ({ ...prev, isActive: value }))}
                trackColor={{ false: '#E0E0E0', true: '#10B981' }}
                thumbColor={formData.isActive ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="إلغاء"
                onPress={() => setShowSubtractModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="خصم"
                onPress={() => handleAddTransaction('subtract')}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>تعديل المعاملة</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowEditModal(false)}
              >
                <X size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <Input
              label="المبلغ *"
              value={formData.amount}
              onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
              placeholder="0.00"
              keyboardType="numeric"
            />

            <Input
              label="البيان (العربية) *"
              value={formData.descriptionAr}
              onChangeText={(text) => setFormData(prev => ({ ...prev, descriptionAr: text }))}
              placeholder="وصف المعاملة"
            />

            <Input
              label="البيان (English)"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Transaction description"
            />

            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>تفعيل المعاملة</Text>
              <Switch
                value={formData.isActive}
                onValueChange={(value) => setFormData(prev => ({ ...prev, isActive: value }))}
                trackColor={{ false: '#E0E0E0', true: '#10B981' }}
                thumbColor={formData.isActive ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="إلغاء"
                onPress={() => setShowEditModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title="حفظ"
                onPress={handleUpdateTransaction}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}