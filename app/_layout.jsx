import * as React from 'react';
import { AppRegistry, I18nManager } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { name as appName } from '../app.json';
import { Stack } from "expo-router";

I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

const App = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="chaletList" options={{ title: 'قائمة الشاليهات' }} />
      <Stack.Screen name="chalet/[name]" options={{ title: 'تفاصيل الشاليه' }} />
      <Stack.Screen name="submitReservationScreen" options={{ title: 'تقديم الحجز' }} />
      <Stack.Screen name="chaletReservationsScreen" options={{ title: 'حجوزات الشاليه' }} />
      <Stack.Screen name="AddChalet" options={{ title: 'إضافة شاليه' }} />
    </Stack>
  );
};

const Main = () => {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
};

AppRegistry.registerComponent(appName, () => Main);
