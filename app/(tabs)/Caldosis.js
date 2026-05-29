import { View,Text,Button,StyleSheet,TextInput,TouchableOpacity, Pressable} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useState } from "react";
import { useWindowDimensions } from "react-native";

export default function CalcularDosis() {
  const {width} = useWindowDimensions();
  const [focuss, setFocus] = useState(false);
  const [finish, setFinish] = useState(false);
  const [unidadpeso, setUnidadPeso] = useState('lb');
  const [unidadpeso2, setUnidadPeso2] = useState('lb');
  const [unidadgramo, setUnidadGramo] = useState('mg/kg');
  const [unidadgramo2, setUnidadGramo2] = useState('mg/kg');
  const [peso, setPeso] = useState('');
  const [peso2, setPeso2] = useState('');
  const [dosispeso, setDosispeso] = useState('');
  const [concentracion, setConcentracion] = useState('');
  const [calculofinal, setCalculofinal] = useState(null);
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

  const calculodosis = () => {
    /**Convertimos todos los valores puestos en lb o mg/lb en Kg y mg/kg */
    const pesof1 = verificarLibra(unidadpeso,peso);
    const pesof2 = verificarLibra(unidadpeso2,peso2);
    const dosispesof = verificarVolumen(unidadgramo,dosispeso);
    const concentracionf = verificarVolumen(unidadgramo2,concentracion);

    const dosispesofinal = pesof2 * dosispesof;
    setCalculofinal(((peso * dosispesofinal)/concentracion).toFixed(2));
    setFinish(true);
  }
  const cambiarUnidad = (cambio,tipo) =>{
    cambio((anterior) => (anterior === tipo[0] ? tipo[1]:tipo[0]))
  }
  
    return (
        <View style={styles.container}>
            <View style={styles.container1}>
                <View style={styles.conteiner2}>
                    <Text style={styles.label}>
                        Indique el peso del animal
                    </Text>
                    
                    <View style={styles.inputtext2}>
                        <TextInput value={peso} onChangeText={(text) => soloNumeros(text, setPeso)} 
                        style= {{
                        flex: 1, 
                        padding: 8,
                        borderBottomLeftRadius:10,
                        borderTopLeftRadius: 10,
                        outlineColor:'black', 
                        outlineStyle: 'none'}} 
                        placeholder="Escriba Aqui" 
                        placeholderTextColor={'gray'}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}/>
                          <TouchableOpacity 
                            onPress={() => cambiarUnidad(setUnidadPeso, ['lb', 'kg'])}
                            style={{ 
                            backgroundColor: '#8CD6FF', 
                            padding: 8, 
                            borderBottomRightRadius: 10,
                            borderTopRightRadius: 10, 
                            width: '15%', 
                            alignItems: 'center', 
                            justifyContent: 'center',}}>
                              <Text>{unidadpeso}</Text>
                          </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.conteiner2_5}>
                  <View style={{width: '100%', alignItems:'center'}}>
                    <Text style={styles.label} >Indica la cantidad de dosis recomendada por cada Lb/Kg de peso</Text>
                  </View>
                  <View style={styles.container3}>
                    <View style={styles.inputtext3}>
                      <Text style={[styles.label], {textAlign: 'center'}}>
                          Peso:
                      </Text>
                        <TextInput value={peso2} 
                        onChangeText={(text) => soloNumeros(text, setPeso2)} 
                        style= {{
                        flex: 1, 
                        padding: 8, 
                        width: '50%',
                        borderBottomLeftRadius:10,
                        borderTopLeftRadius: 10,
                        outlineStyle: 'none'}} 
                        placeholder="123" 
                        placeholderTextColor={'gray'}
                        onFocus={() => setFocus(true)}
                        onBlur={() => setFocus(false)}/>
                          <TouchableOpacity 
                            onPress={() => cambiarUnidad(setUnidadPeso2, ['lb', 'kg'])}
                            style={{backgroundColor: '#8CD6FF', padding: 8, borderRadius: 10, width: '30%', 'alignItems': 'center', 'justifyContent': 'center' }}>
                              <Text>{unidadpeso2}</Text>
                          </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{'width': '5%', 'alignItems': 'center', 'justifyContent': 'center'}}>
                    <Text>X</Text>
                  </View>

                  <View style={styles.container3}>
                    <View style={styles.inputtext3}>
                      <Text style={[styles.label], {textAlign: 'center'}}>
                          Dosis:
                      </Text>
                        <TextInput value={dosispeso} 
                        onChangeText={(text) => soloNumeros(text, setDosispeso)} 
                        style= {{'flex': 1, 'padding': 8, 'width': '40%'}} 
                        placeholder="123" 
                        placeholderTextColor={'gray'}/>
                          <TouchableOpacity 
                            onPress={() => cambiarUnidad(setUnidadGramo, ['mg/kg', 'mg/lb'])}
                            style={{ backgroundColor: '#8CD6FF', padding: 8, borderRadius: 10, width: '30%', 'alignItems': 'center', 'justifyContent': 'center'}}>
                              <Text style={styles.label3} numberOfLines={1}>{unidadgramo}</Text>
                          </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.conteiner2}>
                    <Text style={styles.label}>
                        Indique la Concentracion recomendada
                    </Text>
                    
                    <View style={styles.inputtext2}>
                        <TextInput value={concentracion}
                        onChangeText={(text) => soloNumeros(text, setConcentracion)}
                        style= {{'flex': 1, 'padding': 8}} 
                        placeholder="Escriba Aqui" 
                        placeholderTextColor={'gray'}/>
                          <TouchableOpacity 
                            onPress={() => cambiarUnidad(setUnidadGramo2, ['mg/kg', 'mg/lb'])}
                            style={{ backgroundColor: '#8CD6FF', padding: 8, borderRadius: 10, width: '15%', 'alignItems': 'center', 'justifyContent': 'center'  }}>
                              <Text numberOfLines={1}>{unidadgramo2}</Text>
                          </TouchableOpacity>
                    </View>
                </View>

                <Pressable onPress={calculodosis} style={({pressed}) => [
                  styles.buttonfinish,
                  pressed && styles.buttonfinishPressed
                ]}>
                  <Text>
                    Calular
                  </Text>
                </Pressable>
            </View>

            <View style={styles.container1_5}>
              <Text style={styles.label}>El resultado es: </Text>
              <View>
                <Text style={styles.label}>
                  {calculofinal} {unidadgramo2}
                </Text>
              </View>
            </View>

            <StatusBar style="light" />
        </View>
        
    )


}

const CreateStyles = (width,focuss,finish) => {
  const responsive = (mobile,pc) => width < 600 ? mobile:pc;
  const fo = focuss
  const fi = finish
  return StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#fff',
      alignContent: "space-between",
      alignItems: 'center',
      justifyContent:'center',
    },

    container1: {
      flexDirection: responsive('column', 'row'),
      flexWrap: "wrap",
      height: "auto",
      gap: 10,
      justifyContent: "space-around",
      alignItems: responsive('flex-start','center'),
      borderWidth:1,
      borderRadius:10,
      borderColor:'#ccc',
      margin:10,
      paddingBottom: 10
    },

    container1_5: {
      display: fi ? 'auto':'none',
      flexDirection: 'row',
      flexWrap: "wrap",
      height: "auto",
      width: '70%',
      gap: 10,
      justifyContent: "space-around",
      alignItems: responsive('flex-start','center'),
      borderWidth:1,
      borderRadius:10,
      borderColor:'#ccc',
      margin:10,
      paddingBottom: 10
    },

    conteiner2: {
      marginTop: 10,
      width: responsive('100%', '45%'),
      gap: 10,
      
    },    

    conteiner2_5: {
      flexDirection: 'row',
      flexWrap: "wrap",
      marginTop: 10,
      width: responsive('100%', '45%'),
      justifyContent: 'center',
      alignItems: 'center',
      gap: responsive(0,10)
    },  

    container3: {
      width: '45%',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: responsive(0,10)
    },

    label: {
      fontSize: 15,
      marginTop: 10,
      marginLeft: 10,
      marginBottom: 10,
    },

    label2: {
      fontSize: 15,
      marginLeft: 10,
    },

    label3: {
      fontSize: responsive(10,'auto'), 
      paddingTop:responsive(3,'auto'), 
      paddingBottom:responsive(3,'auto')
    },

    inputtext: {
      borderRadius:10,
      borderWidth: 1,
      height: "auto",
      width: "90%",
      alignSelf: "center",
    },

    inputtext2: {
      borderRadius:10,
      borderWidth: 1,
      height: "auto",
      width: "90%",
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      borderColor: fo ? 'blue':'gray',
    },

    inputtext3: {
      borderRadius:10,
      borderWidth: 1,
      height: "auto",
      width: "90%",
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      paddingLeft: 10,
      borderColor: fo ? 'blue': 'gray'
    },

    buttonfinish: {
      width: '90%',
      borderColor: 'transparent',
      borderRadius: 10,
      backgroundColor: '#27BA75',
      padding: 10,
      alignItems: 'center',
      margin: 10,
    },

    buttonfinishPressed: {
      width: '90%',
      borderColor: 'transparent',
      borderRadius: 10,
      backgroundColor: '#27BA75',
      padding: 10,
      alignItems: 'center',
      margin: 10,
      transform: [{scale : 0.95}],
      opacity: 0.8,
    }
  });
}

