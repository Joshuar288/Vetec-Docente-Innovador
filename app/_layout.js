import { Stack } from 'expo-router';
import AccountProvider from '../components/AccountProvider';
import { useAccount } from '../components/AccountProvider';
import { ActivityIndicator, View } from 'react-native';
import { accessMode } from '../utils/accountAccess';

function Navigation() {
  const account = useAccount();
  const { user, guest } = account;
  const mode = accessMode(account);
  if (mode === 'loading') return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator accessibilityLabel="Cargando sesión" /></View>;
  const canEnter = mode === 'account' || mode === 'guest';
  return <Stack key={user?.id || (guest ? 'guest' : 'signed-out')} screenOptions={{ headerShown: false }}>
    <Stack.Protected guard={!user}><Stack.Screen name="login" /></Stack.Protected>
    <Stack.Protected guard={mode === 'profile'}><Stack.Screen name="completar-perfil" /></Stack.Protected>
    <Stack.Protected guard={canEnter}>
      <Stack.Screen name="index" />
      <Stack.Screen name="cuenta" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(comercio-tabs)" />
    </Stack.Protected>
    <Stack.Screen name="auth/callback" />
  </Stack>;
}

export default function RootLayout() {
  return <AccountProvider><Navigation /></AccountProvider>;
}
