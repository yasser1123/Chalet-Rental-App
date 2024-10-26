import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Button, TextInput, Text, Title } from 'react-native-paper';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { router } from 'expo-router';

const firebaseConfig = {
  apiKey: "AIzaSyD8bAK12lgZhYtrSM-odzaEjdS_OZmRCdA",
  authDomain: "chalet-rental-app.firebaseapp.com",
  projectId: "chalet-rental-app",
  storageBucket: "chalet-rental-app.appspot.com",
  messagingSenderId: "345787228069",
  appId: "1:345787228069:web:d8466b77e9f0e58900124c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication, username, setUsername }) => (
  <View style={styles.authContainer}>
    <Title style={styles.title}>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</Title>
    {!isLogin && (
      <TextInput
        style={styles.input}
        label="اسم المستخدم"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
      />
    )}
    <TextInput
      style={styles.input}
      label="البريد الإلكتروني"
      value={email}
      onChangeText={setEmail}
      mode="outlined"
      keyboardType="email-address"
    />
    <TextInput
      style={styles.input}
      label="كلمة المرور"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      mode="outlined"
    />
    <Button mode="contained" onPress={handleAuthentication} style={styles.button}>
      {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
    </Button>
    <Button onPress={() => setIsLogin(!isLogin)} style={styles.toggleButton}>
      {isLogin ? 'هل تحتاج إلى حساب؟ إنشاء حساب' : 'هل لديك حساب بالفعل؟ تسجيل الدخول'}
    </Button>
  </View>
);

const AuthenticatedScreen = ({ user, handleLogout, username }) => (
  <View style={styles.authContainer}>
    <Title style={styles.title}>مرحبا, {username || 'User'}!</Title>
    <Text style={styles.emailText}>{user.email}</Text>
    <Button mode="contained" onPress={() => router.push('chaletList')} style={styles.button}>
      انتقل إلى الشاشة الرئيسية
    </Button>
    <Button mode="contained" onPress={handleLogout} style={styles.logoutButton}>
      تسجيل الخروج
    </Button>
  </View>
);

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user profile:', error.message);
        }
      } else {
        setUserProfile(null);
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully!');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), { username, email });
        console.log('User created successfully!');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <AuthenticatedScreen user={user} handleLogout={handleLogout} username={userProfile?.username} />
      ) : (
        <AuthScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}
          username={username}
          setUsername={setUsername}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#6200ea',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#6200ea',
  },
  toggleButton: {
    marginTop: 16,
    color: '#6200ea',
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#b00020',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
