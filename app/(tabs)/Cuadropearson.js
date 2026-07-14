import { View,Text,Button,StyleSheet,TextInput,TouchableOpacity, Pressable} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import { useWindowDimensions } from "react-native";

export default function CalcularDosis() {
  const {width} = useWindowDimensions();
  const styles = CreateStyles(width,focuss,finish);

  const soloNumeros = (text, enviovariable) =>{
    const remplazanumero = text.replace(/[^0-9]/g, '');
    enviovariable(remplazanumero);
  }

  const verificarLibra = (unidad,valor) => {
    return unidad === 'lb' ? valor * 0.453592 : valor;
  }

  const verificarVolumen = (unidad,valor) => {
    return unidad === 'mg/lb' ? valor * 2.20462 : valor;
  }

  const cambiarUnidad = (cambio,tipo) =>{
    cambio((anterior) => (anterior === tipo[0] ? tipo[1]:tipo[0]))
  }
  
    return (
        <View style={styles.container}>
            <View style={styles.container1}>
                
            </View>


            <StatusBar style="light" />
        </View>
        
    )


}

const CreateStyles = (width) => {
  const responsive = (mobile,pc) => width < 800 ? mobile:pc;
  
}

