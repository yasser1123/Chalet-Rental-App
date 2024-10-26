import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Switch, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from './firebaseConfig';

const AddChaletScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [resort, setResort] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.email === 'admin@gmail.com') {
      setIsAdmin(true);
    }
  }, []);

  const handleAddChalet = async () => {
    try {
      const newChalet = {
        name,
        description,
        price,
        resort,
        ownerContact,
        isPublic,
        createdAt: new Date(),
      };
      await addDoc(collection(db, 'chalets'), newChalet);
      router.push('/chaletList');
    } catch (error) {
      console.error('Error adding chalet: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="اسم الشاليه"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="المواصفات"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={5}
        style={styles.input}
      />
      <TextInput
        label="السعر "
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="المنتجع"
        value={resort}
        onChangeText={setResort}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="رقم مالك الشاليه"
        value={ownerContact}
        onChangeText={setOwnerContact}
        keyboardType="phone-pad"
        mode="outlined"
        style={styles.input}
      />
      {isAdmin && (
        <View style={styles.switchContainer}>
          <Text style={styles.label}>عام</Text>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            color={theme.colors.primary}
          />
        </View>
      )}
      <Button mode="contained" onPress={handleAddChalet} style={styles.button}>
      إضافة شاليه
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    marginBottom: 12,
    width: '100%',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 18,
    marginRight: 8,
  },
  button: {
    marginTop: 20,
    width: '100%',
  },
});

export default AddChaletScreen;
