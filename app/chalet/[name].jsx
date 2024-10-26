import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, StyleSheet, ActivityIndicator, I18nManager } from 'react-native';
import { TextInput, Button, Switch, Text, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, collection, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { Calendar } from 'react-native-calendars';
import { getAuth } from 'firebase/auth';

I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

const ChaletDetailScreen = () => {
  const route = useRoute();
  const { name } = route.params;
  const navigation = useNavigation();
  const [chalet, setChalet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedResort, setEditedResort] = useState('');
  const [editedOwnerContact, setEditedOwnerContact] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [markedDates, setMarkedDates] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const checkAdminStatus = () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.email === 'admin@gmail.com') {
        setIsAdmin(true);
      }
    };

    const fetchChalet = async () => {
      try {
        const q = query(collection(db, 'chalets'), where('name', '==', name));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const chaletDoc = querySnapshot.docs[0];
          const chaletData = { id: chaletDoc.id, ...chaletDoc.data() };
          setChalet(chaletData);
          setEditedName(chaletData.name);
          setEditedDescription(chaletData.description);
          setEditedPrice(chaletData.price.toString());
          setEditedResort(chaletData.resort);
          setEditedOwnerContact(chaletData.ownerContact);
          setIsPublic(chaletData.isPublic);

          const marked = {};
          if (chaletData.reservations) {
            chaletData.reservations.forEach(reservation => {
              const start = new Date(reservation.rentStartDate);
              const end = new Date(reservation.rentEndDate);
              for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
                const dateString = day.toISOString().split('T')[0];
                marked[dateString] = { selected: true, selectedColor: '#6200ea' };
              }
            });
          }
          setMarkedDates(marked);
        } else {
          Alert.alert("خطأ", "لم يتم العثور على الشاليه.");
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert("خطأ", "فشل في جلب تفاصيل الشاليه.");
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
    fetchChalet();
  }, [name, navigation]);

  const handleSaveButtonPress = async () => {
    if (chalet) {
      const updatedChalet = {
        name: editedName,
        description: editedDescription,
        price: editedPrice,
        resort: editedResort,
        ownerContact: editedOwnerContact,
        isPublic,
      };
      try {
        const chaletRef = doc(db, 'chalets', chalet.id);
        await updateDoc(chaletRef, updatedChalet);
        setChalet({ ...chalet, ...updatedChalet });
        setIsEditing(false);
        Alert.alert('نجاح', 'تم حفظ تفاصيل الشاليه بنجاح!');
      } catch (error) {
        Alert.alert('خطأ', 'فشل في حفظ تفاصيل الشاليه.');
      }
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "حذف الشاليه",
      "هل أنت متأكد من أنك تريد حذف هذا الشاليه؟",
      [
        {
          text: "الغاء",
          style: "cancel"
        },
        {
          text: "حذف",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'chalets', chalet.id));
              navigation.goBack();
            } catch (error) {
              Alert.alert('خطأ', 'فشل في حذف الشاليه.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!chalet) {
    return (
      <View style={styles.container}>
        <Text>لم يتم العثور على الشاليه</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isEditing ? (
        <>
          <TextInput
            label="اسم الشاليه"
            value={editedName}
            onChangeText={setEditedName}
            mode="outlined"
            style={styles.input}
            editable={false}
            textAlign="right"
          />
          <TextInput
            label="الوصف"
            value={editedDescription}
            onChangeText={setEditedDescription}
            mode="outlined"
            multiline
            numberOfLines={5}
            style={styles.input}
            textAlign="right"
          />
          <TextInput
            label="السعر (EGP)"
            value={editedPrice}
            onChangeText={setEditedPrice}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            textAlign="right"
          />
          <TextInput
            label="القرية"
            value={editedResort}
            onChangeText={setEditedResort}
            mode="outlined"
            style={styles.input}
            textAlign="right"
          />
          <TextInput
            label="رقم المالك"
            value={editedOwnerContact}
            onChangeText={setEditedOwnerContact}
            keyboardType="phone-pad"
            mode="outlined"
            style={styles.input}
            textAlign="right"
          />
          <View style={styles.switchContainer}>
            <Text style={styles.label}>عام:</Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              color={theme.colors.primary}
            />
          </View>
          <Button mode="contained" onPress={handleSaveButtonPress} style={styles.button}>
            حفظ التغييرات
          </Button>
        </>
      ) : (
        <>
          <TextInput
            label="اسم الشاليه"
            value={chalet.name}
            mode="outlined"
            style={styles.input}
            editable={false}
            textAlign="right"
          />
          <TextInput
            label="الوصف"
            value={chalet.description}
            mode="outlined"
            multiline
            numberOfLines={5}
            style={styles.input}
            editable={false}
            textAlign="right"
          />
          <TextInput
            label="السعر (EGP)"
            value={chalet.price.toString()}
            mode="outlined"
            style={styles.input}
            editable={false}
            textAlign="right"
          />
          <TextInput
            label="القرية"
            value={chalet.resort}
            mode="outlined"
            style={styles.input}
            editable={false}
            textAlign="right"
          />
          <TextInput
            label="رقم المالك"
            value={chalet.ownerContact}
            mode="outlined"
            style={styles.input}
            editable={false}
            textAlign="right"
          />
          <View style={styles.switchContainer}>
            <Text style={styles.label}>عام:</Text>
            <Switch
              value={chalet.isPublic}
              disabled
            />
          </View>
        </>
      )}
      {isAdmin && !isEditing && (
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={() => setIsEditing(true)} style={styles.button}>
            تعديل
          </Button>
          <Button mode="contained" onPress={handleDelete} buttonColor="#b00020" style={styles.button}>
            حذف الشاليه
          </Button>
        </View>
      )}
      <Calendar markedDates={markedDates} />
      <Button
        mode="contained"
        onPress={() => navigation.navigate('submitReservationScreen', { chaletName: chalet.id })}
        style={styles.button}
      >
        تقديم حجز
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate('chaletReservationsScreen', { chaletName: chalet.id })}
        style={styles.button}
      >
        عرض الحجوزات
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 10,
    textAlign: 'right', 
  },
  button: {
    marginBottom: 10,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'col',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
    textAlign: 'right',
  },
});

export default ChaletDetailScreen;
