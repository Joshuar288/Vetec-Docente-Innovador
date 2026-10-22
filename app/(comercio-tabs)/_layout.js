import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ComercioTabsLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
    <Tabs
      screenOptions={{
        headerShown: false,
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
          tabBarLabel: 'Kardex',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18, fontWeight: '900' }}>K</Text>
          ),
        }}
      />
    </Tabs>
    </SafeAreaView>
  );
}
