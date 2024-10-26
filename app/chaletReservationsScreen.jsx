import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Text, Button, Card, useTheme } from 'react-native-paper';

const ChaletReservationsScreen = () => {
  const route = useRoute();
  const { chaletName } = route.params;
  const [reservations, setReservations] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchReservations = async () => {
      const docRef = doc(db, 'chalets', chaletName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReservations(docSnap.data().reservations || []);
      }
    };
    fetchReservations();
  }, [chaletName]);

  const deleteReservation = async (reservationIndex) => {
    const docRef = doc(db, 'chalets', chaletName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const chaletData = docSnap.data();
      const updatedReservations = chaletData.reservations.filter((_, index) => index !== reservationIndex);

      try {
        await updateDoc(docRef, { reservations: updatedReservations });
        setReservations(updatedReservations);
        Alert.alert('نجاح', 'تم حذف الحجز بنجاح.');
      } catch (error) {
        console.error('Error deleting reservation:', error);
        Alert.alert('خطأ', 'فشل في حذف الحجز.');
      }
    }
  };

  const renderItem = ({ item, index }) => (
    <Card style={styles.item}>
      <Card.Content>
        <Text style={styles.text}>تاريخ البداية: {new Date(item.rentStartDate).toDateString()}</Text>
        <Text style={styles.text}>تاريخ النهاية: {new Date(item.rentEndDate).toDateString()}</Text>
        <Text style={styles.text}>اسم العميل: {item.customerName}</Text>
        <Text style={styles.text}>هاتف العميل: {item.customerPhone}</Text>
        <Text style={styles.text}>عدد الأشخاص: {item.numberOfPeople}</Text>
        <Text style={styles.text}>ملاحظات: {item.notes}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() =>
            Alert.alert(
              "حذف الحجز",
              "هل أنت متأكد أنك تريد حذف هذا الحجز؟",
              [
                { text: "إلغاء", style: "cancel" },
                { text: "حذف", style: "destructive", onPress: () => deleteReservation(index) }
              ]
            )
          }
          color={theme.colors.error}
        >
          حذف الحجز
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {reservations.length === 0 ? (
        <Text style={styles.noReservationsText}>لا توجد حجوزات لهذا الشاليه.</Text>
      ) : (
        <FlatList
          data={reservations}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  noReservationsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    padding: 16,
  },
  item: {
    marginBottom: 16,
  },

});

export default ChaletReservationsScreen;
