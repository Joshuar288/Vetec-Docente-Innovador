import { Tabs } from "expo-router"
import { StackScreenTitle } from "expo-router/build/layouts/stack-utils"
import { Platform } from 'react-native';

export default function Tablayout() {
    return (
        <Tabs>
            <Tabs.Screen name="Caldosis" options={{title: "Calcular Dosis", headerShown: Platform.OS === 'android' ? false : true, headerTitle:  "Vamos a Calular la Dosis Perfecta"}}/>
            <Tabs.Screen name="Cuadropearson" options={{title : "Cuadrado de Pearson", headerShown: Platform.OS === 'android' ? false : true, headerTitle: "Realiza Cuadrado de Pearson Facilmente"}}/>
        </Tabs>
    )
}