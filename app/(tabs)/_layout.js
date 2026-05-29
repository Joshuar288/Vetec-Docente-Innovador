import { Tabs } from "expo-router"
import { StackScreenTitle } from "expo-router/build/layouts/stack-utils"
export default function Tablayout() {
    return (
        <Tabs>
            <Tabs.Screen name="Caldosis" options={{title: "Calcular Dosis", headerTitle: "Vamos a Calular la Dosis Perfecta"}}/>
            <Tabs.Screen name="Cuadropearson" options={{title : "Cuadrado de Pearson", headerTitle: "Realiza Cuadrado de Pearson Facilmente"}}/>
        </Tabs>
    )
}