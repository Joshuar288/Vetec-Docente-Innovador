import { Tabs } from 'expo-router';
import { Platform, Text } from 'react-native';

export default function ComercioTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: Platform.OS !== 'android',
        headerStyle: { backgroundColor: '#FFF7FB' },
        headerTintColor: '#94154E',
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: '#D62476',
        tabBarInactiveTintColor: '#718096',
        tabBarStyle: {
          borderTopColor: '#F5C8DD',
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Tabs.Screen
        name="Kardex"
        options={{
          title: 'Tarjetas Kardex',
          headerTitle: 'Gestión de Tarjetas Kardex',
          tabBarLabel: 'Kardex',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18, fontWeight: '900' }}>K</Text>
          ),
        }}
      />
    </Tabs>
  );
}
