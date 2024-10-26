import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Button, Card, useTheme, Title } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { db } from './firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const ChaletList = () => {
  const [chalets, setChalets] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    const fetchChalets = async () => {
      setLoading(true);
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        let q;
        if (currentUser && currentUser.email === 'admin@gmail.com') {
          setIsAdmin(true);
          q = query(collection(db, 'chalets'));
        } else {
          q = query(collection(db, 'chalets'), where('isPublic', '==', true));
        }
        const querySnapshot = await getDocs(q);
        const fetchedChalets = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setChalets(fetchedChalets);
      } catch (error) {
        console.error("Error fetching chalets: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChalets();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}>Chalets' List</Text>
      <FlatList
        data={chalets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.chaletItem}>
            <Card.Content>
              <Text style={styles.chaletName}>الاسم: {item.name}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('chalet/[name]', { name: item.name })}>
                عرض التفاصيل
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
      {isAdmin && (
        <Button mode="contained" onPress={() => navigation.navigate('AddChalet')}>
          إضافة شاليه
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chaletItem: {
    marginBottom: 12,
  },
  chaletName: {
    fontSize: 18,
  },
  title: {
    fontSize: 32,         // Larger font size
    fontWeight: 'bold',   // Make it bold
    color: '#2E86C1',     // Choose a primary color (adjust as needed)
    textAlign: 'center',  // Center the text
    marginVertical: 20,   // Add some spacing around the title
  },
});

export default ChaletList;
