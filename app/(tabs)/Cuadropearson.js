import { View,Text,Button,StyleSheet,TextInput,TouchableOpacity, Pressable, ScrollView} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import { Picker } from '@react-native-picker/picker';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function CalcularDosis() {
  const {width} = useWindowDimensions();
  const styles = CreateStyles(width);
  const [proteico, setProteico] = useState('');
  const [nutreico, setNutreico] = useState('');
  const [valDeseado, setValDeseado] = useState('');
  const [parteProteico, setParteProteico] = useState('');
  const [parteNutreico, setParteNutreico] = useState('');
  const [proporcionProteico, setProporcionProteico] = useState('');
  const [proporcionNutreico, setProporcionNutreico] = useState('');

  const ingredientesProteicos = [
    { label: 'DDGS CEBADA (24.9%)', value: 24.9 },
    { label: 'DDGS MAIZ 7.5%EE-6.8%ALM (27.5%)', value: 27.5 },
    { label: 'DDGS MAIZ 12.5%EE-3.5%ALM (28%)', value: 28 },
    { label: 'DDGS MAIZ 12.5%EE-6.8%ALM (27.4%)', value: 27.4 },
    { label: 'DDGS SORGO (30.2%)', value: 30.2 },
    { label: 'DDGS TRIGO (33.6%)', value: 33.6 },
    { label: 'BAGAZO CERVEZA (24.3%)', value: 24.3 },
    { label: 'GLUTEN FEED MAIZ 20.5% (20.5%)', value: 20.5 },
    { label: 'GLUTEN MEAL MAIZ 60% (60%)', value: 60 },
    { label: 'SEMILLA ALGODON (20.8%)', value: 20.8 },
    { label: 'HARINA DE ALGODON 38 (38.7%)', value: 38.7 },
    { label: 'ALTRAMUZ DULCE AUSTRALIANO (31.7%)', value: 31.7 },
    { label: 'HNA.CACAHUETE 48 (48.1%)', value: 48.1 },
    { label: 'HNA.CACAHUETE 52 (52.5%)', value: 52.5 },
    { label: 'HNA. CAMELINA SOLVENTES (37%)', value: 37 },
    { label: 'TORTA CAMELINA PRESION (33.9%)', value: 33.9 },
    { label: 'HNA. COLZA 00 SOLVENTES 33%PB (33%)', value: 33 },
    { label: 'HNA. COLZA 00 SOLVENTES 36%PB (36%)', value: 36 },
    { label: 'TORTA COLZA 00 PRESION 7.3%EE (31.2%)', value: 31.2 },
    { label: 'TORTA COLZA 00 PRESION 12.7EE (29.7%)', value: 29.7 },
    { label: 'TORTA COPRA PRESION (20.8%)', value: 20.8 },
    { label: 'HNA. COPRA SOLVENTE (21.4%)', value: 21.4 },
    { label: 'HNA.GIRASOL 28 (28%)', value: 28 },
    { label: 'HNA.GIRASOL 32 (32%)', value: 32 },
    { label: 'HNA.GIRASOL 36 (36%)', value: 36 },
    { label: 'TORTA GIRASOL PRESION 31%PB (31%)', value: 31 },
    { label: 'TORTA GIRASOL PRESION 34%PB (34%)', value: 34 },
    { label: 'GUISANTES PRIMAVERA (21.5%)', value: 21.5 },
    { label: 'GUISANTES TRATADOS CALOR (20.6%)', value: 20.6 },
    { label: 'HABA CABALLAR <0.5% Taninos (26.5%)', value: 26.5 },
    { label: 'HABA CABALLAR DESCASCARILLADA (30%)', value: 30 },
    { label: 'LENTEJAS (24.4%)', value: 24.4 },
    { label: 'SEMILLA LINO (22%)', value: 22 },
    { label: 'TORTA LINO PRESION (31.5%)', value: 31.5 },
    { label: 'HNA.LINO SOLVENTE (34%)', value: 34 },
    { label: 'HABA SOJA TOSTADA (37%)', value: 37 },
    { label: 'HABA SOJA EXTRUSIONADA (37%)', value: 37 },
    { label: 'HNA.SOJA 44 (44%)', value: 44 },
    { label: 'HNA.SOJA 45,5 (45.5%)', value: 45.5 },
    { label: 'HNA.SOJA 47 (47%)', value: 47 },
    { label: 'HNA.SOJA 48.5 (48.5%)', value: 48.5 },
    { label: 'HNA.SOJA 51 MICRONIZADA (51.4%)', value: 51.4 },
    { label: 'VEZA COMUN (26.5%)', value: 26.5 },
    { label: 'YEROS (22%)', value: 22 },
    { label: 'CONC.PROTEINA SOJA-EXTR. (65%)', value: 65 },
    { label: 'CONC.PROTEINA SOJA-FERM. (53.8%)', value: 53.8 },
    { label: 'AISLADO PROTEINA SOJA (87%)', value: 87 },
    { label: 'CONC. PROTEINA GUISANTE (51.5%)', value: 51.5 },
    { label: 'AISLADO PROTEINA GUISANTE (76.4%)', value: 76.4 },
    { label: 'PROTEINA DE PATATA (79%)', value: 79 },
    { label: 'CONC. PROTEINA ARROZ (65.6%)', value: 65.6 },
    { label: 'PROT. TRIGO HIDROLIZADO (78%)', value: 78 },
    { label: 'LEVADURA CERVEZA (46%)', value: 46 },
    { label: 'ALFALFA EN RAMA DESH. (20%)', value: 20 },
    { label: 'CARNE 44/15/28 (43.7%)', value: 43.7 },
    { label: 'CARNE 50/14/26 (49.3%)', value: 49.3 },
    { label: 'CARNE 52/14/25 (52.3%)', value: 52.3 },
    { label: 'CARNE 57/13/24 (56.6%)', value: 56.6 },
    { label: 'SUBP. MATADERO AVES (61.8%)', value: 61.8 },
    { label: 'CARNE AVES 65/13/16 (64.8%)', value: 64.8 },
    { label: 'PESCADO 59/9/21 (59%)', value: 59 },
    { label: 'PESCADO 62/9/18 (62.2%)', value: 62.2 },
    { label: 'PESCADO 67/10/15 (66.6%)', value: 66.6 },
    { label: 'PESCADO 70/9/13 (70%)', value: 70 },
    { label: 'PLUMAS HIDROLIZADA (83.9%)', value: 83.9 },
    { label: 'HNA SANGRE SPRAY (87%)', value: 87 },
    { label: 'HEMOGLOBINA (91.5%)', value: 91.5 },
    { label: 'PLASMA ANIMAL 70% PB (70.6%)', value: 70.6 },
    { label: 'PLASMA ANIMAL 78% PB (78%)', value: 78 },
    { label: 'HARINA HUEVO (47%)', value: 47 },
    { label: 'HIDR. MUCOSA PORC. 52 (52.9%)', value: 52.9 },
    { label: 'HIDR. MUCOSA PORC. 62 (62%)', value: 62 },
    { label: 'HIDR. MUCOSA PORC. 70 (70.1%)', value: 70.1 },
    { label: 'CASEINA (87%)', value: 87 },
    { label: 'LECHE DESCREMADA (34.2%)', value: 34.2 },
    { label: 'LECHE DESCREM.DESNATURA (34%)', value: 34 },
    { label: 'SUERO DELACTOS.22/39/22 (21%)', value: 21 },
    { label: 'SUERO DELACTOS.25/45/20 (25.5%)', value: 25.5 },
    { label: 'SUERO DELACTOS.20 GRASA (20.4%)', value: 20.4 },
    { label: 'FOSFATO MONOAMONICO (68.8%)', value: 68.8 },
    { label: 'UREA (287.5%)', value: 287.5 },
    { label: 'SULFATO DE AMONIO (130%)', value: 130 },
    { label: 'CLORURO AMONICO (163.6%)', value: 163.6 },
    { label: 'DL METIONINA (58.4%)', value: 58.4 },
    { label: 'L METIONINA (58.4%)', value: 58.4 },
    { label: 'DL-MET SODICA (23.6%)', value: 23.6 },
    { label: 'L-LISINA HCL (94.4%)', value: 94.4 },
    { label: 'L-LISINA 50 (60%)', value: 60 },
    { label: 'SULFATO DE L-LISINA (80%)', value: 80 },
    { label: 'L-TREONINA (72.5%)', value: 72.5 },
    { label: 'L-TRIPTOFANO (84.5%)', value: 84.5 },
    { label: 'L-VALINA (72.4%)', value: 72.4 },
    { label: 'L-ARGININA (196.9%)', value: 196.9 },
    { label: 'L-ISOLEUCINA (68%)', value: 68 },
    { label: 'L-HISTIDINA HCl (125.3%)', value: 125.3 },
    { label: 'FORMIATO AMONICO (135.5%)', value: 135.5 },
    { label: 'PROPIONATO AMONICO (96.15%)', value: 96.15 }
  ];

  const ingredientesNutreicos = [
    { label: "ARROZ PARTIDO", value: 7.5 },
    { label: "AVENA", value: 9.9 },
    { label: "AVENA DECORTICADA", value: 14 },
    { label: "CEBADA 2C 11.3 PB", value: 11.3 },
    { label: "CEBADA 2C 9.6 PB", value: 9.6 },
    { label: "CENTENO NACIONAL", value: 9.4 },
    { label: "CENTENO ALEMÁN", value: 10.1 },
    { label: "MAIZ NACIONAL", value: 7.3 },
    { label: "MAIZ RICO EN ACEITE", value: 8.4 },
    { label: "SORGO BLANCO", value: 8.9 },
    { label: "TRIGO BLANDO 12.9 PB", value: 12.9 },
    { label: "TRIGO BLANDO 11.2 PB", value: 11.2 },
    { label: "TRIGO BLANDO 10.2 PB", value: 10.2 },
    { label: "TRIGO BLANDO INGLES", value: 11 },
    { label: "TRIGO DURO", value: 13.8 },
    { label: "TRITICALE", value: 10.7 },
    { label: "ARROZ TRATADO CALOR", value: 7.5 },
    { label: "MAIZ TRATADO CALOR", value: 7.3 },
    { label: "SORGO BLANCO TRATADO POR CALOR", value: 8.9 },
    { label: "SALVADO ARROZ 14%EE", value: 13.8 },
    { label: "SALVADO ARROZ 17 EE", value: 13.6 },
    { label: "SALVADO ARROZ DESENGRASADO", value: 14.8 },
    { label: "HARINILLAS MAIZ 6%EE", value: 8.3 },
    { label: "GLUTEN FEED MAIZ 19%", value: 19 },
    { label: "SALVADO TRIGO 15% ALMIDÓN", value: 15.4 },
    { label: "SALVADO TRIGO 20% ALMIDÓN", value: 15 },
    { label: "TERCERILLAS TRIGO 25% ALMIDÓN", value: 14.3 },
    { label: "HARINILLAS TRIGO 30% ALM", value: 14.7 },
    { label: "HARINA GALLETA 2.5% CENIZAS", value: 10.4 },
    { label: "HARINA GALLETA 6% CENIZAS", value: 10.7 },
    { label: "PAN RALLADO", value: 13 },
    { label: "RAICILLAS MALTA 19", value: 19.1 },
    { label: "BELLOTA ENTERA", value: 2.6 },
    { label: "BELLOTA DECORTICADA", value: 3.2 },
    { label: "MANDIOCA 62.5", value: 2.4 },
    { label: "MANDIOCA 65", value: 2.4 },
    { label: "MANDIOCA 70", value: 2.5 },
    { label: "MELAZA CAÑA", value: 4.3 },
    { label: "MELAZA REMOLACHA", value: 9.1 },
    { label: "VINAZAS REMOLACHA", value: 17.9 },
    { label: "PATATA", value: 8.9 },
    { label: "BATATA", value: 3.3 },
    { label: "SEMILLA COLZA 00", value: 19 },
    { label: "SEMILLA GIRASOL", value: 16.4 },
    { label: "SEMILLA GIRASOL ALTO OLEICO", value: 16.9 },
    { label: "TORTA PALMISTE PRESION", value: 15.6 },
    { label: "HNA.PALMISTE SOLVENTES", value: 16.3 },
    { label: "ALFALFA HENIF. GRANULADA (17.5%PB)", value: 17.5 },
    { label: "ALFALFA HENIF. GRANULADA (15%PB)", value: 15 },
    { label: "HARINA FORRAJERA MEZCLA (12.5%PB)", value: 12.5 },
    { label: "CASCARA DE ALGODON", value: 6.3 },
    { label: "CASCARILLA ARROZ", value: 2.6 },
    { label: "CASCARILLA AVENA", value: 3.8 },
    { label: "CASCARILLA GIRASOL", value: 5.7 },
    { label: "CASCARILLA HABA CABALLAR", value: 9.5 },
    { label: "CASCARILLA SOJA 10%PB", value: 10 },
    { label: "CASCARILLA SOJA 12%PB", value: 12 },
    { label: "GARROFA", value: 4.5 },
    { label: "HOJA DE OLIVO", value: 8.4 },
    { label: "PULPA ACEITUNA INTEGRAL", value: 9.6 },
    { label: "PULPA ACEITUNA PARC. DESENGRASADA", value: 9.9 },
    { label: "ORUJO ACEITUNA EXTRACTADO", value: 10.9 },
    { label: "GRANILLA DE UVA ENTERA", value: 9.3 },
    { label: "HNA EXTRACCION GRANILLA UVA", value: 11.1 },
    { label: "ORUJO UVA", value: 11.2 },
    { label: "PAJA DE CEREALES", value: 4.6 },
    { label: "PAJA TRATADA CON SOSA", value: 3.6 },
    { label: "PAJA DE LENTEJA", value: 6 },
    { label: "PULPA CÍTRICOS (NARANJA+MANDARINA)", value: 6.1 },
    { label: "PULPA MANZANA", value: 5.5 },
    { label: "PULPA REMOLACHA 4% CENIZAS", value: 8.6 },
    { label: "PULPA REMOLACHA 7.5% CENIZAS", value: 7.9 },
    { label: "SUERO ACIDO", value: 9.4 },
    { label: "SUERO DULCE OVINO", value: 14.1 },
    { label: "SUERO DULCE VACUNO", value: 12.5 },
    { label: "SUERO REENGRAS. 50", value: 6.2 },
    { label: "PERMEATO DE SUERO", value: 3.5 },
    { label: "HARINA HUESOS DESGELATINIZADOS", value: 8 }
  ];

  const soloNumeros = (text, enviovariable) =>{
    const remplazanumero = text.replace(/[^0-9]/g, '');
    enviovariable(remplazanumero);
  }

  useEffect(() => {
  calcularPartes();
  }, [valDeseado, proteico, nutreico]);

  useEffect(() => {
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

  return () => {
    ScreenOrientation.unlockAsync();
  };
}, []);

  const verificarLibra = (unidad,valor) => {
    return unidad === 'lb' ? valor * 0.453592 : valor;
  }

  const verificarVolumen = (unidad,valor) => {
    return unidad === 'mg/lb' ? valor * 2.20462 : valor;
  }

  const cambiarUnidad = (cambio,tipo) =>{
    cambio((anterior) => (anterior === tipo[0] ? tipo[1]:tipo[0]))
  }

  const calcularPartes = () => {
    if (valDeseado === '') {
      setParteProteico('');
      setParteNutreico('');
      return;
    }

    const proteicoValor = proteico;
    const nutreicoValor = nutreico;
    const valDeseadoValor = valDeseado;

    setParteProteico(Math.abs(nutreicoValor - valDeseadoValor));
    setParteNutreico(Math.abs(proteicoValor - valDeseadoValor));

    const sumaPartes = parteProteico + parteNutreico;
    setProporcionProteico(((parteProteico / sumaPartes) * 100).toFixed(2));
    setProporcionNutreico(((parteNutreico / sumaPartes) * 100).toFixed(2));
  }

  return (
    <ScrollView horizontal={true} style={styles.container}
    contentContainerStyle={styles.inside_container}> 
          <View style={styles.container1}>
        <View style={styles.fila1}>
          <View style={[styles.container2, {justifyContent: 'center'}]}>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Ingrediente</Text>
          </View>

          <View style={styles.container2}>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Proteina Bruta</Text>
          </View>

          <View style={styles.container2}>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Concentracion deseada</Text>
          </View>

          <View style={styles.container2}>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Partes</Text>
          </View>

          <View style={styles.container2}>
            <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Proporcion por Fuentes</Text>
          </View>

          <View style={styles.lineaseparadora} />
        </View>



        <View style={styles.fila2}>
          <View style={styles.container2}>
            <Picker
              style={styles.selectPicker}
              selectedValue={proteico}
              onValueChange={(itemValue) => setProteico(itemValue)}
            >
              {ingredientesProteicos.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>

            <Picker
              style={styles.selectPicker}
              selectedValue={nutreico}
              onValueChange={(itemValue) => setNutreico(itemValue)}
            >
              {ingredientesNutreicos.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.squarePearson}>
              <View style={styles.container3}>
                <Text style={{ textAlign: 'center' }}> {proteico} </Text>
                <Text style={{ textAlign: 'center' }}>{nutreico}</Text>
              </View>

              <View style={[styles.container3, {justifyContent: 'center'}]}>
                <TextInput value={valDeseado} onChangeText={(text) => soloNumeros(text,setValDeseado)} 
                style={{ 
                  textAlign: 'center',
                  borderColor: '#ccc',
                  borderWidth: 1,
                  borderRadius: 5,
                  height: 30,
                 }} />
              </View>

              <View style={styles.container3}>
                <Text style={{ textAlign: 'center' }}> {parteProteico} </Text>
                <Text style={{ textAlign: 'center' }}>{parteNutreico}</Text>
              </View>              
          </View>

          <View style={styles.container2}>
              <Text style={{ textAlign: 'center' }}> {proporcionProteico}% </Text>
              <Text style={{ textAlign: 'center' }}> {proporcionNutreico}%</Text>
          </View>

          
        </View>
      </View>

      <StatusBar style="light" />
    </ScrollView>
  );
}

const CreateStyles = (width) => {
  const responsive = (mobile,pc) => width < 800 ? mobile:pc;
  
  return StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#fff',
    },

    inside_container: {
      flexGrow: 1,
      alignContent: "space-between",
      alignItems: 'center',
      justifyContent:'center',
    },

    container1: {
      gap: 10,
      alignItems: 'start',
      borderWidth:1,
      borderRadius:10,
      borderColor:'#ccc',   
      margin:10,
      paddingBottom: 10,
      minWidth: 980,
      minHeight: 300,
      width: '95%',
      height:'50%',
    },

    fila1: {
      width: '100%',
      flexDirection:'row',
      flexWrap:'wrap',
      justifyContent: "space-around",
      alignItems: 'center',
    },
      
    fila2: {
      width: '95%',
      height: "70%",
      justifyContent: "space-between",
      margin: 20,
      flexDirection:'row',
    },

    container2: {
      width: '15%',
      justifyContent: "space-between",
      margin: 5,
    },

    container3: {
      width: '15%',
      height: '90%',
      justifyContent: "space-between",
      margin: 10,
      textAlign: 'center',
    },

    lineaseparadora: {
      width: '100%',
      height: 0,
      borderColor: '#ccc',
      borderWidth:1,
    },
    
    selectPicker: {
      height: 40,
      width: '100%',
    },

    squarePearson: {
      width: "55%",
      height: "100%",
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginLeft: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }
  });
}

