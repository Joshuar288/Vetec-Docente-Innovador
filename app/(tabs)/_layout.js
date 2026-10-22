import { Tabs } from "expo-router"
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Tablayout() {
    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="Caldosis" options={{title: "Calcular Dosis"}}/>
            <Tabs.Screen name="Cuadropearson" options={{title : "Cuadrado de Pearson"}}/>
        </Tabs>
        </SafeAreaView>
    )
}
