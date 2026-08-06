import { View,Text,Button,StyleSheet,TextInput,TouchableOpacity, Pressable, ScrollView, Animated, Dimensions, Image} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef, useMemo} from "react";
import { useWindowDimensions } from "react-native";
import { Picker } from '@react-native-picker/picker';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useIsFocused } from '@react-navigation/native';

export default function CalcularDosis() {
  const {width} = useWindowDimensions();
  const {height} = useWindowDimensions();
  const styles = CreateStyles(width, height);
  const [proteico, setProteico] = useState(0);
  const [nutreico, setNutreico] = useState(0);
  const [valDeseado, setValDeseado] = useState(0);
  const [parteProteico, setParteProteico] = useState(0);
  const [parteNutreico, setParteNutreico] = useState(0);
  const [proporcionProteico, setProporcionProteico] = useState('Sin Calcular ');
  const [proporcionNutreico, setProporcionNutreico] = useState('Sin Calcular ');
  const isFocused = useIsFocused();
  const [idProteico, setIdProteico] = useState(0);
  const [idNutreico, setIdNutreico] = useState(0);
  const [ingredienteProteico, setIngredienteProteico] = useState('Sin ingrediente seleccionado');
  const [ingredienteNutreico, setIngredienteNutreico] = useState('Sin ingrediente seleccionado');
  const [librasProteico, setLibrasProteico] = useState('Sin Calcular');
  const [librasNutreico, setLibrasNutreico] = useState('Sin Calcular');
  const moveX = useRef(new Animated.Value(0)).current;
  const moveY = useRef(new Animated.Value(0)).current;
  const logoPositions = useMemo(() => {
    return Array.from({ length: 50 }, () => ({
      top: Math.random() * height,
      left: Math.random() * width,
    }));
  }, [width, height]);

useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.parallel([
        Animated.timing(moveX, {
          toValue: -30,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(moveY, {
          toValue: -30,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(moveX, {
          toValue: 30,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(moveY, {
          toValue: 30,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]),
    ])
  ).start();
}, []);

const ingredientesProteicos = [
  { id: 0, label: 'DDGS CEBADA (24.9%)', value: 24.9 },
  { id: 1, label: 'DDGS MAIZ 7.5%EE-6.8%ALM (27.5%)', value: 27.5 },
  { id: 2, label: 'DDGS MAIZ 12.5%EE-3.5%ALM (28%)', value: 28 },
  { id: 3, label: 'DDGS MAIZ 12.5%EE-6.8%ALM (27.4%)', value: 27.4 },
  { id: 4, label: 'DDGS SORGO (30.2%)', value: 30.2 },
  { id: 5, label: 'DDGS TRIGO (33.6%)', value: 33.6 },
  { id: 6, label: 'BAGAZO CERVEZA (24.3%)', value: 24.3 },
  { id: 7, label: 'GLUTEN FEED MAIZ 20.5% (20.5%)', value: 20.5 },
  { id: 8, label: 'GLUTEN MEAL MAIZ 60% (60%)', value: 60 },
  { id: 9, label: 'SEMILLA ALGODON (20.8%)', value: 20.8 },
  { id: 10, label: 'HARINA DE ALGODON 38 (38.7%)', value: 38.7 },
  { id: 11, label: 'ALTRAMUZ DULCE AUSTRALIANO (31.7%)', value: 31.7 },
  { id: 12, label: 'HNA.CACAHUETE 48 (48.1%)', value: 48.1 },
  { id: 13, label: 'HNA.CACAHUETE 52 (52.5%)', value: 52.5 },
  { id: 14, label: 'HNA. CAMELINA SOLVENTES (37%)', value: 37 },
  { id: 15, label: 'TORTA CAMELINA PRESION (33.9%)', value: 33.9 },
  { id: 16, label: 'HNA. COLZA 00 SOLVENTES 33%PB (33%)', value: 33 },
  { id: 17, label: 'HNA. COLZA 00 SOLVENTES 36%PB (36%)', value: 36 },
  { id: 18, label: 'TORTA COLZA 00 PRESION 7.3%EE (31.2%)', value: 31.2 },
  { id: 19, label: 'TORTA COLZA 00 PRESION 12.7EE (29.7%)', value: 29.7 },
  { id: 20, label: 'TORTA COPRA PRESION (20.8%)', value: 20.8 },
  { id: 21, label: 'HNA. COPRA SOLVENTE (21.4%)', value: 21.4 },
  { id: 22, label: 'HNA.GIRASOL 28 (28%)', value: 28 },
  { id: 23, label: 'HNA.GIRASOL 32 (32%)', value: 32 },
  { id: 24, label: 'HNA.GIRASOL 36 (36%)', value: 36 },
  { id: 25, label: 'TORTA GIRASOL PRESION 31%PB (31%)', value: 31 },
  { id: 26, label: 'TORTA GIRASOL PRESION 34%PB (34%)', value: 34 },
  { id: 27, label: 'GUISANTES PRIMAVERA (21.5%)', value: 21.5 },
  { id: 28, label: 'GUISANTES TRATADOS CALOR (20.6%)', value: 20.6 },
  { id: 29, label: 'HABA CABALLAR <0.5% Taninos (26.5%)', value: 26.5 },
  { id: 30, label: 'HABA CABALLAR DESCASCARILLADA (30%)', value: 30 },
  { id: 31, label: 'LENTEJAS (24.4%)', value: 24.4 },
  { id: 32, label: 'SEMILLA LINO (22%)', value: 22 },
  { id: 33, label: 'TORTA LINO PRESION (31.5%)', value: 31.5 },
  { id: 34, label: 'HNA.LINO SOLVENTE (34%)', value: 34 },
  { id: 35, label: 'HABA SOJA TOSTADA (37%)', value: 37 },
  { id: 36, label: 'HABA SOJA EXTRUSIONADA (37%)', value: 37 },
  { id: 37, label: 'HNA.SOJA 44 (44%)', value: 44 },
  { id: 38, label: 'HNA.SOJA 45,5 (45.5%)', value: 45.5 },
  { id: 39, label: 'HNA.SOJA 47 (47%)', value: 47 },
  { id: 40, label: 'HNA.SOJA 48.5 (48.5%)', value: 48.5 },
  { id: 41, label: 'HNA.SOJA 51 MICRONIZADA (51.4%)', value: 51.4 },
  { id: 42, label: 'VEZA COMUN (26.5%)', value: 26.5 },
  { id: 43, label: 'YEROS (22%)', value: 22 },
  { id: 44, label: 'CONC.PROTEINA SOJA-EXTR. (65%)', value: 65 },
  { id: 45, label: 'CONC.PROTEINA SOJA-FERM. (53.8%)', value: 53.8 },
  { id: 46, label: 'AISLADO PROTEINA SOJA (87%)', value: 87 },
  { id: 47, label: 'CONC. PROTEINA GUISANTE (51.5%)', value: 51.5 },
  { id: 48, label: 'AISLADO PROTEINA GUISANTE (76.4%)', value: 76.4 },
  { id: 49, label: 'PROTEINA DE PATATA (79%)', value: 79 },
  { id: 50, label: 'CONC. PROTEINA ARROZ (65.6%)', value: 65.6 },
  { id: 51, label: 'PROT. TRIGO HIDROLIZADO (78%)', value: 78 },
  { id: 52, label: 'LEVADURA CERVEZA (46%)', value: 46 },
  { id: 53, label: 'ALFALFA EN RAMA DESH. (20%)', value: 20 },
  { id: 54, label: 'CARNE 44/15/28 (43.7%)', value: 43.7 },
  { id: 55, label: 'CARNE 50/14/26 (49.3%)', value: 49.3 },
  { id: 56, label: 'CARNE 52/14/25 (52.3%)', value: 52.3 },
  { id: 57, label: 'CARNE 57/13/24 (56.6%)', value: 56.6 },
  { id: 58, label: 'SUBP. MATADERO AVES (61.8%)', value: 61.8 },
  { id: 59, label: 'CARNE AVES 65/13/16 (64.8%)', value: 64.8 },
  { id: 60, label: 'PESCADO 59/9/21 (59%)', value: 59 },
  { id: 61, label: 'PESCADO 62/9/18 (62.2%)', value: 62.2 },
  { id: 62, label: 'PESCADO 67/10/15 (66.6%)', value: 66.6 },
  { id: 63, label: 'PESCADO 70/9/13 (70%)', value: 70 },
  { id: 64, label: 'PLUMAS HIDROLIZADA (83.9%)', value: 83.9 },
  { id: 65, label: 'HNA SANGRE SPRAY (87%)', value: 87 },
  { id: 66, label: 'HEMOGLOBINA (91.5%)', value: 91.5 },
  { id: 67, label: 'PLASMA ANIMAL 70% PB (70.6%)', value: 70.6 },
  { id: 68, label: 'PLASMA ANIMAL 78% PB (78%)', value: 78 },
  { id: 69, label: 'HARINA HUEVO (47%)', value: 47 },
  { id: 70, label: 'HIDR. MUCOSA PORC. 52 (52.9%)', value: 52.9 },
  { id: 71, label: 'HIDR. MUCOSA PORC. 62 (62%)', value: 62 },
  { id: 72, label: 'HIDR. MUCOSA PORC. 70 (70.1%)', value: 70.1 },
  { id: 73, label: 'CASEINA (87%)', value: 87 },
  { id: 74, label: 'LECHE DESCREMADA (34.2%)', value: 34.2 },
  { id: 75, label: 'LECHE DESCREM.DESNATURA (34%)', value: 34 },
  { id: 76, label: 'SUERO DELACTOS.22/39/22 (21%)', value: 21 },
  { id: 77, label: 'SUERO DELACTOS.25/45/20 (25.5%)', value: 25.5 },
  { id: 78, label: 'SUERO DELACTOS.20 GRASA (20.4%)', value: 20.4 },
  { id: 79, label: 'FOSFATO MONOAMONICO (68.8%)', value: 68.8 },
  { id: 80, label: 'UREA (287.5%)', value: 287.5 },
  { id: 81, label: 'SULFATO DE AMONIO (130%)', value: 130 },
  { id: 82, label: 'CLORURO AMONICO (163.6%)', value: 163.6 },
  { id: 83, label: 'DL METIONINA (58.4%)', value: 58.4 },
  { id: 84, label: 'L METIONINA (58.4%)', value: 58.4 },
  { id: 85, label: 'DL-MET SODICA (23.6%)', value: 23.6 },
  { id: 86, label: 'L-LISINA HCL (94.4%)', value: 94.4 },
  { id: 87, label: 'L-LISINA 50 (60%)', value: 60 },
  { id: 88, label: 'SULFATO DE L-LISINA (80%)', value: 80 },
  { id: 89, label: 'L-TREONINA (72.5%)', value: 72.5 },
  { id: 90, label: 'L-TRIPTOFANO (84.5%)', value: 84.5 },
  { id: 91, label: 'L-VALINA (72.4%)', value: 72.4 },
  { id: 92, label: 'L-ARGININA (196.9%)', value: 196.9 },
  { id: 93, label: 'L-ISOLEUCINA (68%)', value: 68 },
  { id: 94, label: 'L-HISTIDINA HCl (125.3%)', value: 125.3 },
  { id: 95, label: 'FORMIATO AMONICO (135.5%)', value: 135.5 },
  { id: 96, label: 'PROPIONATO AMONICO (96.15%)', value: 96.15 }
];

const ingredientesNutreicos = [
    { id: 0, label: "ARROZ PARTIDO", value: 7.5 },
    { id: 1, label: "AVENA", value: 9.9 },
    { id: 2, label: "AVENA DECORTICADA", value: 14 },
    { id: 3, label: "CEBADA 2C 11.3 PB", value: 11.3 },
    { id: 4, label: "CEBADA 2C 9.6 PB", value: 9.6 },
    { id: 5, label: "CENTENO NACIONAL", value: 9.4 },
    { id: 6, label: "CENTENO ALEMÁN", value: 10.1 },
    { id: 7, label: "MAIZ NACIONAL", value: 7.3 },
    { id: 8, label: "MAIZ RICO EN ACEITE", value: 8.4 },
    { id: 9, label: "SORGO BLANCO", value: 8.9 },
    { id: 10, label: "TRIGO BLANDO 12.9 PB", value: 12.9 },
    { id: 11, label: "TRIGO BLANDO 11.2 PB", value: 11.2 },
    { id: 12, label: "TRIGO BLANDO 10.2 PB", value: 10.2 },
    { id: 13, label: "TRIGO BLANDO INGLES", value: 11 },
    { id: 14, label: "TRIGO DURO", value: 13.8 },
    { id: 15, label: "TRITICALE", value: 10.7 },
    { id: 16, label: "ARROZ TRATADO CALOR", value: 7.5 },
    { id: 17, label: "MAIZ TRATADO CALOR", value: 7.3 },
    { id: 18, label: "SORGO BLANCO TRATADO POR CALOR", value: 8.9 },
    { id: 19, label: "SALVADO ARROZ 14%EE", value: 13.8 },
    { id: 20, label: "SALVADO ARROZ 17 EE", value: 13.6 },
    { id: 21, label: "SALVADO ARROZ DESENGRASADO", value: 14.8 },
    { id: 22, label: "HARINILLAS MAIZ 6%EE", value: 8.3 },
    { id: 23, label: "GLUTEN FEED MAIZ 19%", value: 19 },
    { id: 24, label: "SALVADO TRIGO 15% ALMIDÓN", value: 15.4 },
    { id: 25, label: "SALVADO TRIGO 20% ALMIDÓN", value: 15 },
    { id: 26, label: "TERCERILLAS TRIGO 25% ALMIDÓN", value: 14.3 },
    { id: 27, label: "HARINILLAS TRIGO 30% ALM", value: 14.7 },
    { id: 28, label: "HARINA GALLETA 2.5% CENIZAS", value: 10.4 },
    { id: 29, label: "HARINA GALLETA 6% CENIZAS", value: 10.7 },
    { id: 30, label: "PAN RALLADO", value: 13 },
    { id: 31, label: "RAICILLAS MALTA 19", value: 19.1 },
    { id: 32, label: "BELLOTA ENTERA", value: 2.6 },
    { id: 33, label: "BELLOTA DECORTICADA", value: 3.2 },
    { id: 34, label: "MANDIOCA 62.5", value: 2.4 },
    { id: 35, label: "MANDIOCA 65", value: 2.4 },
    { id: 36, label: "MANDIOCA 70", value: 2.5 },
    { id: 37, label: "MELAZA CAÑA", value: 4.3 },
    { id: 38, label: "MELAZA REMOLACHA", value: 9.1 },
    { id: 39, label: "VINAZAS REMOLACHA", value: 17.9 },
    { id: 40, label: "PATATA", value: 8.9 },
    { id: 41, label: "BATATA", value: 3.3 },
    { id: 42, label: "SEMILLA COLZA 00", value: 19 },
    { id: 43, label: "SEMILLA GIRASOL", value: 16.4 },
    { id: 44, label: "SEMILLA GIRASOL ALTO OLEICO", value: 16.9 },
    { id: 45, label: "TORTA PALMISTE PRESION", value: 15.6 },
    { id: 46, label: "HNA.PALMISTE SOLVENTES", value: 16.3 },
    { id: 47, label: "ALFALFA HENIF. GRANULADA (17.5%PB)", value: 17.5 },
    { id: 48, label: "ALFALFA HENIF. GRANULADA (15%PB)", value: 15 },
    { id: 49, label: "HARINA FORRAJERA MEZCLA (12.5%PB)", value: 12.5 },
    { id: 50, label: "CASCARA DE ALGODON", value: 6.3 },
    { id: 51, label: "CASCARILLA ARROZ", value: 2.6 },
    { id: 52, label: "CASCARILLA AVENA", value: 3.8 },
    { id: 53, label: "CASCARILLA GIRASOL", value: 5.7 },
    { id: 54, label: "CASCARILLA HABA CABALLAR", value: 9.5 },
    { id: 55, label: "CASCARILLA SOJA 10%PB", value: 10 },
    { id: 56, label: "CASCARILLA SOJA 12%PB", value: 12 },
    { id: 57, label: "GARROFA", value: 4.5 },
    { id: 58, label: "HOJA DE OLIVO", value: 8.4 },
    { id: 59, label: "PULPA ACEITUNA INTEGRAL", value: 9.6 },
    { id: 60, label: "PULPA ACEITUNA PARC. DESENGRASADA", value: 9.9 },
    { id: 61, label: "ORUJO ACEITUNA EXTRACTADO", value: 10.9 },
    { id: 62, label: "GRANILLA DE UVA ENTERA", value: 9.3 },
    { id: 63, label: "HNA EXTRACCION GRANILLA UVA", value: 11.1 },
    { id: 64, label: "ORUJO UVA", value: 11.2 },
    { id: 65, label: "PAJA DE CEREALES", value: 4.6 },
    { id: 66, label: "PAJA TRATADA CON SOSA", value: 3.6 },
    { id: 67, label: "PAJA DE LENTEJA", value: 6 },
    { id: 68, label: "PULPA CÍTRICOS (NARANJA+MANDARINA)", value: 6.1 },
    { id: 69, label: "PULPA MANZANA", value: 5.5 },
    { id: 70, label: "PULPA REMOLACHA 4% CENIZAS", value: 8.6 },
    { id: 71, label: "PULPA REMOLACHA 7.5% CENIZAS", value: 7.9 },
    { id: 72, label: "SUERO ACIDO", value: 9.4 },
    { id: 73, label: "SUERO DULCE OVINO", value: 14.1 },
    { id: 74, label: "SUERO DULCE VACUNO", value: 12.5 },
    { id: 75, label: "SUERO REENGRAS. 50", value: 6.2 },
    { id: 76, label: "PERMEATO DE SUERO", value: 3.5 },
    { id: 77, label: "HARINA HUESOS DESGELATINIZADOS", value: 8 }
];

  const soloNumeros = (text, enviovariable) =>{
    const remplazanumero = text.replace(/[^0-9]/g, '');
      enviovariable(remplazanumero);
    }

  useEffect(() => {
  calcularPartes();
  }, [valDeseado, proteico, nutreico]);

  useEffect(() => {
    if (isFocused) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
  }, [isFocused]);

  const verificarLibra = (unidad,valor) => {
    return unidad === 'lb' ? valor * 0.453592 : valor;
  }

  const verificarVolumen = (unidad,valor) => {
    return unidad === 'mg/lb' ? valor * 2.20462 : valor;
  }

  const cambiarUnidad = (cambio,tipo) =>{
    cambio((anterior) => (anterior === tipo[0] ? tipo[1]:tipo[0]))
  }

  const seleccionarIngredienteNutreico = (value) => {
    const idNum = Number(value);
    setIdNutreico(idNum);
    const ingredienteSeleccionado = ingredientesNutreicos.find(
      item => item.id === idNum
    );

    if (ingredienteSeleccionado) {
      setNutreico(ingredienteSeleccionado.value); 
    }
  };

  const seleccionarIngredienteProteico = (value) => {
    const idNum = Number(value);
    setIdProteico(idNum);
    const ingredienteSeleccionado = ingredientesProteicos.find(
      item => item.id === idNum
    );

    if (ingredienteSeleccionado) {
      setProteico(ingredienteSeleccionado.value); 
    }
  };


  const calcularPartes = () => {
    if (valDeseado === '') {
      setParteProteico('');
      setParteNutreico('');
      setProporcionProteico('Sin Calcular ');
      setProporcionNutreico('Sin Calcular ');
      return;
    }

    const proteicoValor = Number(proteico) || 0;
    const nutreicoValor = Number(nutreico) || 0;
    const valDeseadoValor = Number(valDeseado) || 0;

    const parteProteicoValor = Math.abs(nutreicoValor - valDeseadoValor);
    const parteNutreicoValor = Math.abs(proteicoValor - valDeseadoValor);

    setParteProteico(parteProteicoValor.toFixed(2));
    setParteNutreico(parteNutreicoValor.toFixed(2));

    const sumaPartes = parteProteicoValor + parteNutreicoValor;

    if (sumaPartes === 0) {
      setProporcionProteico('0.00');
      setProporcionNutreico('0.00');
      return;
    }

    setProporcionProteico(((parteProteicoValor / sumaPartes) * 100).toFixed(2));
    setProporcionNutreico(((parteNutreicoValor / sumaPartes) * 100).toFixed(2));

    setIngredienteProteico(ingredientesProteicos.find(item => item.id === idProteico)?.label || '');
    setIngredienteNutreico(ingredientesNutreicos.find(item => item.id === idNutreico)?.label || '');
    setLibrasProteico(((proporcionProteico * proteico) / 100).toFixed(2));
    setLibrasNutreico(((proporcionNutreico * nutreico) / 100).toFixed(2));
  }

return (
    <View style={{ flex: 1 }}>
      {/* Fondo de pantalla fijo - Fuera del ScrollView */}
      <View style={styles.backgroundContainer} pointerEvents="none">
        <View style={styles.background}>
          {logoPositions.map((pos, i) => (
            <Animated.Image
              key={i}
              source={require('../../assets/LogoAulaMix.png')}
              style={[
                styles.backgroundLogo,
                {
                  position: 'absolute',
                  top: pos.top,
                  left: pos.left,
                  transform: [
                    { translateX: moveX },
                    { translateY: moveY },
                  ],
                },
              ]}
              resizeMode="contain"
            />
          ))}
        </View>
      </View>

      {/* Formulario scrolleable sobre el fondo */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.inside_container}
      >
        <View style={styles.container1}>
          <View style={styles.fila1}>
            <View style={[styles.container2, { justifyContent: 'center' }]}>
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
                selectedValue={idProteico}
                onValueChange={(itemValue) => seleccionarIngredienteProteico(itemValue)}
              >
                {ingredientesProteicos.map((item) => (
                  <Picker.Item
                    key={item.id}
                    label={item.label}
                    value={item.id}
                  />
                ))}
              </Picker>

              <Picker
                style={styles.selectPicker}
                selectedValue={idNutreico}
                onValueChange={(itemValue) => seleccionarIngredienteNutreico(itemValue)}
              >
                {ingredientesNutreicos.map((item) => (
                  <Picker.Item
                    key={item.id}
                    label={item.label}
                    value={item.id}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.squarePearson}>
              <View style={styles.container3}>
                <Text style={{ textAlign: 'center' }}> {proteico} </Text>
                <Text style={{ textAlign: 'center' }}> {nutreico} </Text>
              </View>

              <View style={[styles.container3, { justifyContent: 'center' }]}>
                <TextInput
                  keyboardType="numeric"
                  value={String(valDeseado)}
                  onChangeText={(text) => soloNumeros(text, setValDeseado)}
                  style={{
                    textAlign: 'center',
                    borderColor: '#ccc',
                    borderWidth: 1,
                    borderRadius: 5,
                    height: 50,
                  }}
                />
              </View>

              <View style={styles.container3}>
                <Text style={{ textAlign: 'center' }}> {parteProteico} </Text>
                <Text style={{ textAlign: 'center' }}>{parteNutreico}</Text>
              </View>
            </View>

            <View style={styles.container2}>
              <Text style={{ textAlign: 'center' }}> {proporcionProteico}</Text>
              <Text style={{ textAlign: 'center' }}> {proporcionNutreico}</Text>
            </View>
          </View>
        </View>

        <View style={styles.container1_1}>
          <View style={styles.filas}>
            <View style={[styles.container2, { justifyContent: 'center' }]}>
              <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>Ingrediente</Text>
            </View>

            <View style={styles.container2}>
              <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>Cantidad por 100 LB</Text>
            </View>

            <View style={styles.container2}>
              <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>Cantidad de proteinas</Text>
            </View>

            <View style={styles.lineaseparadora} />
          </View>

          <View style={styles.filas}>
            <View style={styles.textStatus}>
              <Text style={{ textAlign: 'center', fontSize: 15 }}>{ingredienteProteico}</Text>
            </View>

            <View style={styles.textStatus}>
              <Text style={{ textAlign: 'center', fontSize: 15 }}>{proporcionProteico}</Text>
            </View>

            <View style={styles.textStatus}>
              <Text style={{ textAlign: 'center', fontSize: 15 }}>{librasProteico}</Text>
            </View>
          </View>

          <View style={styles.filas}>
            <View style={styles.textStatus}>
              <Text style={{ textAlign: 'center', fontSize: 15 }}>{ingredienteNutreico}</Text>
            </View>

            <View style={styles.textStatus}>
              <Text style={{ textAlign: 'center', fontSize: 15 }}>{proporcionNutreico}</Text>
            </View>

            <View style={styles.textStatus}>
              <Text style={{ textAlign: 'center', fontSize: 15 }}>{librasNutreico}</Text>
            </View>
          </View>
        </View>

        <StatusBar style="light" />
      </ScrollView>
    </View>
  );
}

const CreateStyles = (width, height) => {
  const responsive = (mobile,pc) => width < 800 ? mobile:pc;
  const responsiveHeight = (mobile,pc) => height < 600 ? mobile:pc;
  
  return StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: 'transparent',
      zIndex: 1,
    },

    inside_container: {
      flexGrow: 1,
      alignContent: "space-between",
      alignItems: 'center',
      justifyContent:'center',
      flexDirection: 'column',
      gap: responsiveHeight(10, 50),
    },

    backgroundLogo: {
      position: 'absolute',
      width: 80,
      height: 80,
      alignSelf: 'center',
      opacity: 0.50,
    },

      // Contenedor principal del fondo fijo en la pantalla
    backgroundContainer: {
      ...StyleSheet.absoluteFillObject, // equivale a: top: 0, left: 0, right: 0, bottom: 0, position: 'absolute'
      zIndex: -1, // Asegura que quede detrás del contenido interactivo
      backgroundColor: '#F4FFF6', // Fondo transparente para que se vea el contenido detrás
    },

    // Recorta cualquier imagen que intente salir del área de la pantalla
    background: {
      flex: 1,
      overflow: 'hidden', 
    },

    container1: {
      gap: 10,
      alignItems: 'center',
      borderWidth:1,
      borderRadius:10,
      borderColor:'#ccc',   
      marginTop:30,
      paddingBottom: 10,
      width: responsiveHeight('85%', '75%'),
      height: responsiveHeight(280, 350),
      backgroundColor: '#fff',
      elevation: 3,
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',
    },

    container1_1: {
      gap: 10,
      alignItems: 'center',
      borderWidth:1,
      borderRadius:10,
      borderColor:'#ccc',   
      margin:10,
      paddingBottom: 10,
      width: '60%',
      height: 200,
      backgroundColor: '#fff',
      elevation: 3,
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',
    },

    fila1: {
      width: '100%',
      flexDirection:'row',
      flexWrap:'wrap',
      justifyContent: "space-around",
      alignItems: 'center',
    },

    filas: {
      width: '100%',
      flexDirection:'row',
      flexWrap:'wrap',
      justifyContent: "space-around",
      alignItems: 'center',
    },
      
    fila2: {
      width: '95%',
      height: responsiveHeight(180, 200),
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
      height: responsiveHeight(50, 40),
      width: '100%',
    },

    squarePearson: {
      width: "55%",
      height: responsiveHeight(180, 200),
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginLeft: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    textStatus: {
      width: '20%',
      height: 50,
      margin: 5,
    },
  });
}

