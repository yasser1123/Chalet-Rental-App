import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Text, TextInput, Button } from 'react-native-paper';

const SubmitReservationScreen = () => {
  const route = useRoute();
  const { chaletName } = route.params;
  const [rentStartDate, setRentStartDate] = useState(new Date());
  const [rentEndDate, setRentEndDate] = useState(new Date());
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [notes, setNotes] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleReservation = async () => {
    try {
      const docRef = doc(db, 'chalets', chaletName);
      await updateDoc(docRef, {
        reservations: arrayUnion({
          rentStartDate: rentStartDate.toISOString(),
          rentEndDate: rentEndDate.toISOString(),
          customerName,
          customerPhone,
          numberOfPeople,
          notes,
        }),
      });
      Alert.alert('نجاح', 'تم تقديم الحجز بنجاح!');
    } catch (error) {
      console.error('خطأ في تقديم الحجز:', error);
      Alert.alert('خطأ', 'فشل في تقديم الحجز. حاول مرة أخرى.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>تاريخ بداية الإيجار:</Text>
      <Button onPress={() => setShowStartDatePicker(true)}>
        {rentStartDate.toDateString()}
      </Button>
      {showStartDatePicker && (
        <DateTimePicker
          value={rentStartDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) setRentStartDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>تاريخ نهاية الإيجار:</Text>
      <Button onPress={() => setShowEndDatePicker(true)}>
        {rentEndDate.toDateString()}
      </Button>
      {showEndDatePicker && (
        <DateTimePicker
          value={rentEndDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setRentEndDate(selectedDate);
          }}
        />
      )}

      <TextInput
        label="اسم العميل"
        value={customerName}
        onChangeText={setCustomerName}
        mode="outlined"
        style={styles.input}
        textAlign="right"
      />

      <TextInput
        label="رقم هاتف العميل"
        value={customerPhone}
        onChangeText={setCustomerPhone}
        keyboardType="phone-pad"
        mode="outlined"
        style={styles.input}
        textAlign="right"
      />

      <TextInput
        label="عدد الأشخاص"
        value={numberOfPeople}
        onChangeText={setNumberOfPeople}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
        textAlign="right"
      />

      <TextInput
        label="ملاحظات"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={5}
        mode="outlined"
        style={[styles.input, styles.notes]}
        textAlign="right"
      />

      <Button mode="contained" onPress={handleReservation} style={styles.button}>
        تقديم الحجز
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    textAlign: "right",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
    textAlign: 'right', 
  },
  notes: {
    height: 100,
    textAlignVertical: 'top',
    textAlign: 'right', 
  },
  button: {
    marginTop: 16,
  },
});

export default SubmitReservationScreen;
