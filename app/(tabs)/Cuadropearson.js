import GuidedTour, { TourTarget, TourScrollView, TourPreview } from '../../components/GuidedTour';
import { pearsonTour } from '../../utils/toolTours';
import LearningGuide from '../../components/LearningGuide';
import { pearsonLesson } from '../../utils/toolLessons';
import ToolWorkspace from '../../components/ToolWorkspace';
import PearsonResults from '../../components/PearsonResults';
import { Alert, Animated, Platform, View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable, ScrollView, Modal, FlatList } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import { useIsFocused } from '@react-navigation/native';
import AnimatedLogoBackground from '../../components/AnimatedLogoBackground';
import ToolGuide from '../../components/ToolGuide';
import InteractionCoach from '../../components/InteractionCoach';
import useGuidePulse from '../../components/useGuidePulse';
import RecordActions from '../../components/RecordActions';
import { saveAndPrintRecord } from '../../utils/saveAndPrintRecord';
import MainMenuButton from '../../components/MainMenuButton';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

function SelectorIngrediente({ items, selectedId, onSelect, placeholder, highlighted }) {
  const [visible, setVisible] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const seleccionado = items.find((item) => item.id === selectedId);
  const termino = busqueda.trim().toLocaleLowerCase('es');
  const resultados = termino
    ? items.filter((item) => item.label.toLocaleLowerCase('es').includes(termino))
    : items;
  const pulseStyle = useGuidePulse(highlighted);

  const cerrar = () => {
    setVisible(false);
    setBusqueda('');
  };

  return (
    <>
      {highlighted && <Text style={selectorStyles.guidedLabel}>↓ PRESIONA ESTE SELECTOR</Text>}
      <AnimatedTouchableOpacity
        style={[selectorStyles.control, highlighted && selectorStyles.controlGuided, highlighted && pulseStyle]}
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={placeholder}
      >
        <Text style={selectorStyles.controlText} numberOfLines={2}>
          {seleccionado?.label || placeholder}
        </Text>
        <Text style={selectorStyles.arrow}>▼</Text>
      </AnimatedTouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={cerrar}>
        <View style={selectorStyles.backdrop}>
          <View style={selectorStyles.modal}>
            <View style={selectorStyles.header}>
              <Text style={selectorStyles.title}>{placeholder}</Text>
              <Pressable onPress={cerrar} hitSlop={12} accessibilityRole="button">
                <Text style={selectorStyles.close}>✕</Text>
              </Pressable>
            </View>

            <TextInput
              style={selectorStyles.search}
              value={busqueda}
              onChangeText={setBusqueda}
              placeholder="Buscar ingrediente..."
              placeholderTextColor="#6B7280"
              autoCorrect={false}
            />

            <FlatList
              data={resultados}
              keyExtractor={(item) => String(item.id)}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={<Text style={selectorStyles.empty}>No se encontraron ingredientes.</Text>}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[selectorStyles.option, item.id === selectedId && selectorStyles.selectedOption]}
                  onPress={() => {
                    onSelect(item.id);
                    cerrar();
                  }}
                >
                  <Text style={selectorStyles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const selectorStyles = StyleSheet.create({
  control: {
    minHeight: 48,
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlText: { flex: 1, color: '#111827', fontSize: 12 },
  guidedLabel: { color: '#166534', fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  controlGuided: { borderWidth: 3, borderColor: '#16A34A', backgroundColor: '#F0FDF4' },
  arrow: { color: '#166534', fontSize: 12, marginLeft: 6 },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modal: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '88%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  title: { flex: 1, color: '#111827', fontSize: 18, fontWeight: 'bold' },
  close: { color: '#374151', fontSize: 22, paddingHorizontal: 4 },
  search: {
    height: 60,
    marginBottom: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    borderRadius: 8,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  option: { paddingHorizontal: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  selectedOption: { backgroundColor: '#DCFCE7' },
  optionText: { color: '#111827', fontSize: 15 },
  empty: { padding: 20, color: '#4B5563', textAlign: 'center' },
});

function PearsonInputs({ ingredientesProteicos, ingredientesNutreicos, idProteico, idNutreico,
  seleccionarIngredienteProteico, seleccionarIngredienteNutreico, proteico, nutreico,
  valDeseado, setValDeseado, soloNumeros, guideTarget }) {
  const objetivoInvalido = idProteico !== null && idNutreico !== null && Number(valDeseado) > 0
    && (Number(proteico) === Number(nutreico) || Number(valDeseado) < Math.min(Number(proteico), Number(nutreico)) || Number(valDeseado) > Math.max(Number(proteico), Number(nutreico)));
  return <View style={inputStyles.card}>
    <Text style={inputStyles.eyebrow}>DATOS DE LA MEZCLA</Text>
    <Text style={inputStyles.title}>Define tus ingredientes</Text>
    <Text style={inputStyles.help}>Selecciona las dos fuentes e indica el porcentaje de proteína que necesitas.</Text>
    <TourTarget id="proteico" style={inputStyles.field}>
      <Text style={inputStyles.label}>1 · Fuente proteica</Text>
      <SelectorIngrediente items={ingredientesProteicos} selectedId={idProteico} onSelect={seleccionarIngredienteProteico} placeholder="Selecciona el ingrediente proteico" highlighted={guideTarget === 'proteico'} />
      <Text style={inputStyles.value}>Proteína bruta: {proteico}%</Text>
    </TourTarget>
    <TourTarget id="nutreico" style={inputStyles.field}>
      <Text style={inputStyles.label}>2 · Fuente energética</Text>
      <SelectorIngrediente items={ingredientesNutreicos} selectedId={idNutreico} onSelect={seleccionarIngredienteNutreico} placeholder="Selecciona el ingrediente energético" highlighted={guideTarget === 'nutreico'} />
      <Text style={inputStyles.value}>Proteína bruta: {nutreico}%</Text>
    </TourTarget>
    <TourTarget id="deseado" style={inputStyles.field}>
      <Text style={inputStyles.label}>3 · Concentración deseada</Text>
      <View style={[inputStyles.inputRow, guideTarget === 'deseado' && inputStyles.focused]}>
        <TextInput accessibilityLabel="Porcentaje de proteína deseado" keyboardType="numeric" value={String(valDeseado || '')} onChangeText={(text) => soloNumeros(text, setValDeseado)} style={inputStyles.input} placeholder="0" placeholderTextColor="#8AA494" selectTextOnFocus />
        <Text style={inputStyles.suffix}>% PB</Text>
      </View>
      <Text style={inputStyles.help}>El porcentaje deseado debe estar entre los valores de las dos fuentes.</Text>
      {objetivoInvalido && <Text accessibilityLiveRegion="polite" style={{ color:'#A22E2E',fontSize:13,lineHeight:19 }}>No se puede obtener ese objetivo con estas fuentes. Elige concentraciones diferentes que incluyan el porcentaje deseado.</Text>}
    </TourTarget>
    <View style={inputStyles.note}><Text style={inputStyles.value}>Cálculo automático</Text><Text style={inputStyles.help}>El cuadrado y los resultados se actualizan al cambiar los datos.</Text></View>
  </View>;
}
const inputStyles = StyleSheet.create({
  card: { padding: 22, borderWidth: 1, borderColor: '#CFE1D5', backgroundColor: '#FFFFFF', borderRadius: 18, gap: 18 },
  eyebrow: { color: '#238347', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#14532D', fontSize: 22, fontWeight: '800' },
  help: { color: '#64756B', fontSize: 13, lineHeight: 20 },
  field: { gap: 9 }, label: { color: '#254C33', fontSize: 14, fontWeight: '700' },
  value: { color: '#166534', fontSize: 13, fontWeight: '700' },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#B7D4C0', borderRadius: 11, backgroundColor: '#F7FBF8' },
  focused: { borderColor: '#16A34A' },
  input: { flex: 1, minWidth: 0, padding: 14, fontSize: 24, fontWeight: '700', color: '#14532D' },
  suffix: { color: '#166534', fontWeight: '700', paddingRight: 16 },
  note: { padding: 14, borderRadius: 11, backgroundColor: '#EFF9F2', gap: 4 },
});

export default function CalcularDosis() {
  const { width } = useWindowDimensions();
  const styles = CreateStyles(width);
  const [proteico, setProteico] = useState(0);
  const [nutreico, setNutreico] = useState(0);
  const [valDeseado, setValDeseado] = useState(0);
  const [parteProteico, setParteProteico] = useState(0);
  const [parteNutreico, setParteNutreico] = useState(0);
  const [proporcionProteico, setProporcionProteico] = useState('0.00');
  const [proporcionNutreico, setProporcionNutreico] = useState('0.00');
  const isFocused = useIsFocused();
  const [idProteico, setIdProteico] = useState(null);
  const [idNutreico, setIdNutreico] = useState(null);
  const [vista, setVista] = useState('cuadrado');
  const [coach, setCoach] = useState({
    label: 'COMIENZA AQUÍ',
    message: 'Presiona primero el selector de ingrediente proteico. La ayuda te acompañará durante cada elección.',
  });
  const [guideTarget, setGuideTarget] = useState('proteico');
  const [ingredienteProteico, setIngredienteProteico] = useState('Sin ingrediente seleccionado');
  const [ingredienteNutreico, setIngredienteNutreico] = useState('Sin ingrediente seleccionado');
  const [librasProteico, setLibrasProteico] = useState('0.00');
  const [librasNutreico, setLibrasNutreico] = useState('0.00');
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
      setCoach({
        label: 'CONCENTRACIÓN DESEADA',
        message: 'Este porcentaje debe quedar entre el valor del ingrediente proteico y el energético. Los resultados se actualizan automáticamente.',
      });
      if (remplazanumero) setGuideTarget('results');
    }

  useEffect(() => {
  calcularPartes();
  }, [valDeseado, proteico, nutreico, idProteico, idNutreico]);

  useEffect(() => {
    if (isFocused && Platform.OS !== 'web') {
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
      setCoach({
        label: 'FUENTE ENERGÉTICA SELECCIONADA',
        message: 'Ahora introduce en el panel de datos el porcentaje de proteína que quieres lograr en la mezcla.',
      });
      setGuideTarget('deseado');
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
      setCoach({
        label: 'FUENTE PROTEICA SELECCIONADA',
        message: 'Continúa con el selector de ingrediente energético. Conviene elegir uno con un porcentaje menor al objetivo.',
      });
      setGuideTarget('nutreico');
    }
  };


  const calcularPartes = () => {
    const proteicoValor = Number(proteico) || 0;
    const nutreicoValor = Number(nutreico) || 0;
    const valDeseadoValor = Number(valDeseado) || 0;

    if (!valDeseado || valDeseadoValor <= 0 || !Number.isFinite(valDeseadoValor)
      || proteicoValor === nutreicoValor || valDeseadoValor < Math.min(proteicoValor,nutreicoValor) || valDeseadoValor > Math.max(proteicoValor,nutreicoValor)) {
      setParteProteico('');
      setParteNutreico('');
      setProporcionProteico('0.00');
      setProporcionNutreico('0.00');
      setLibrasProteico('0.00');
      setLibrasNutreico('0.00');
      return;
    }

    const parteProteicoValor = Math.abs(nutreicoValor - valDeseadoValor);
    const parteNutreicoValor = Math.abs(proteicoValor - valDeseadoValor);
    const sumaPartes = parteProteicoValor + parteNutreicoValor;

    if (sumaPartes === 0) {
      setParteProteico('0.00');
      setParteNutreico('0.00');
      setProporcionProteico('0.00');
      setProporcionNutreico('0.00');
      setLibrasProteico('0.00');
      setLibrasNutreico('0.00');
      return;
    }

    const propProtNum = (parteProteicoValor / sumaPartes) * 100;
    const propNutrNum = (parteNutreicoValor / sumaPartes) * 100;

    const protAporteNum = (propProtNum * proteicoValor) / 100;
    const nutrAporteNum = (propNutrNum * nutreicoValor) / 100;

    setParteProteico(parteProteicoValor.toFixed(2));
    setParteNutreico(parteNutreicoValor.toFixed(2));
    
    setProporcionProteico(propProtNum.toFixed(2));
    setProporcionNutreico(propNutrNum.toFixed(2));

    setLibrasProteico(protAporteNum.toFixed(2));
    setLibrasNutreico(nutrAporteNum.toFixed(2));

    setIngredienteProteico(ingredientesProteicos.find(item => item.id === idProteico)?.label || '');
    setIngredienteNutreico(ingredientesNutreicos.find(item => item.id === idNutreico)?.label || '');
  };

  const limpiarFormulario = () => {
    setProteico(0);
    setNutreico(0);
    setValDeseado(0);
    setParteProteico('');
    setParteNutreico('');
    setProporcionProteico('0.00');
    setProporcionNutreico('0.00');
    setIdProteico(null);
    setIdNutreico(null);
    setIngredienteProteico('Sin ingrediente seleccionado');
    setIngredienteNutreico('Sin ingrediente seleccionado');
    setLibrasProteico('0.00');
    setLibrasNutreico('0.00');
    setGuideTarget('proteico');
    setCoach({
      label: 'ACTIVIDAD LIMPIA',
      message: 'Presiona el selector de ingrediente proteico para construir una nueva mezcla.',
    });
  };

  const registroCompleto = idProteico !== null && idNutreico !== null && Number.isFinite(Number(valDeseado)) && Number(valDeseado) > 0
    && Number(proteico) !== Number(nutreico) && Number(valDeseado) >= Math.min(Number(proteico),Number(nutreico)) && Number(valDeseado) <= Math.max(Number(proteico),Number(nutreico));
  // Wait for derived state to correspond to the current ingredients and target.
  const totalPartes = Math.abs(Number(nutreico) - Number(valDeseado)) + Math.abs(Number(proteico) - Number(valDeseado));
  const porcentajeProteico = totalPartes ? Math.abs(Number(nutreico) - Number(valDeseado)) / totalPartes * 100 : 0;
  const porcentajeNutreico = totalPartes ? Math.abs(Number(proteico) - Number(valDeseado)) / totalPartes * 100 : 0;
  const resultadosActualizados = ingredienteProteico === ingredientesProteicos.find((i) => i.id === idProteico)?.label
    && ingredienteNutreico === ingredientesNutreicos.find((i) => i.id === idNutreico)?.label
    && proporcionProteico === porcentajeProteico.toFixed(2) && proporcionNutreico === porcentajeNutreico.toFixed(2)
    && librasProteico === (porcentajeProteico * Number(proteico) / 100).toFixed(2)
    && librasNutreico === (porcentajeNutreico * Number(nutreico) / 100).toFixed(2);

  const record = registroCompleto && resultadosActualizados ? {
        title: 'Registro del cuadrado de Pearson',
        subtitle: 'Mezcla calculada por cada 100 lb',
        rows: [
          { label: 'Fuente proteica', value: `${ingredienteProteico} · ${proteico}% PB` },
          { label: 'Fuente energética', value: `${ingredienteNutreico} · ${nutreico}% PB` },
          { label: 'Concentración deseada', value: `${valDeseado}%` },
        ],
        results: [
          { label: `Cantidad de ${ingredienteProteico}`, value: `${proporcionProteico} lb` },
          { label: `Cantidad de ${ingredienteNutreico}`, value: `${proporcionNutreico} lb` },
          { label: 'Aporte proteico total', value: `${(Number(librasProteico) + Number(librasNutreico)).toFixed(2)}%` },
        ],
      } : null;
  const imprimirRegistro = async (options) => {
    if (record) await saveAndPrintRecord(record, options);
  };

return (
    <GuidedTour title="Cuadrado de Pearson" steps={pearsonTour} currentId={guideTarget === 'results' ? 'resultados' : guideTarget}><View style={{ flex: 1 }}>
      {/* Fondo de pantalla fijo - Fuera del ScrollView */}
      <AnimatedLogoBackground count={30} />

      {/* Formulario scrolleable sobre el fondo */}
      <TourScrollView
        style={styles.container}
        contentContainerStyle={styles.inside_container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <MainMenuButton />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <ToolGuide
          title="Cómo construir el cuadrado de Pearson"
          whatIs="El cuadrado de Pearson es un método gráfico para calcular la proporción de dos ingredientes con concentraciones diferentes y obtener una mezcla con un porcentaje de proteína deseado."
          logic="El valor deseado debe quedar entre los porcentajes de ambos ingredientes. Se resta diagonalmente: ingrediente alto menos valor deseado y valor deseado menos ingrediente bajo. Las diferencias obtenidas son las partes de cada fuente; al convertirlas a porcentaje, ambas proporciones suman 100 %."
          steps={[
            'Presiona el selector de fuente proteica y elige un ingrediente con porcentaje mayor al valor que deseas obtener.',
            'Presiona el selector de fuente energética y elige un ingrediente con porcentaje menor al valor deseado.',
            'Introduce a la izquierda la concentración de proteína que debe tener la mezcla final.',
            'Lee las partes calculadas a la derecha y revisa abajo cuántas libras de cada ingrediente usar por cada 100 lb.',
          ]}
          tip="Ingresa los datos en el panel de la izquierda y sigue las diagonales del cuadrado en el panel de resultados. En pantallas pequeñas, los resultados aparecen debajo de los datos."
        />

        <LearningGuide previewKind={"pearson"} lesson={pearsonLesson} targets={['cuadrado', ['proteico','nutreico','deseado'], 'cuadrado', 'resultados', ['cuadrado','cuadrado','resultados','resultados']]} />
        <InteractionCoach cue={coach} />
        </View>

        <TourPreview values={{ ingredientesProteicos, ingredientesNutreicos, idProteico, idNutreico, proteico, nutreico, valDeseado, parteProteico, parteNutreico, proporcionProteico, proporcionNutreico, ingredienteProteico, ingredienteNutreico, librasProteico, librasNutreico, guideTarget }}>{({ ingredientesProteicos, ingredientesNutreicos, idProteico, idNutreico, proteico, nutreico, valDeseado, parteProteico, parteNutreico, proporcionProteico, proporcionNutreico, ingredienteProteico, ingredienteNutreico, librasProteico, librasNutreico, guideTarget, hideAnswer = false }) => <ToolWorkspace
          input={<PearsonInputs ingredientesProteicos={ingredientesProteicos} ingredientesNutreicos={ingredientesNutreicos} idProteico={idProteico} idNutreico={idNutreico} seleccionarIngredienteProteico={seleccionarIngredienteProteico} seleccionarIngredienteNutreico={seleccionarIngredienteNutreico} proteico={proteico} nutreico={nutreico} valDeseado={valDeseado} setValDeseado={setValDeseado} soloNumeros={soloNumeros} guideTarget={guideTarget} />}
          output={<PearsonResults hideAnswer={hideAnswer}
          ingredientesProteicos={ingredientesProteicos}
          ingredientesNutreicos={ingredientesNutreicos}
          idProteico={idProteico}
          idNutreico={idNutreico}
          seleccionarIngredienteProteico={seleccionarIngredienteProteico}
          seleccionarIngredienteNutreico={seleccionarIngredienteNutreico}
          proteico={proteico}
          nutreico={nutreico}
          valDeseado={valDeseado}
          setValDeseado={setValDeseado}
          soloNumeros={soloNumeros}
          parteProteico={parteProteico}
          parteNutreico={parteNutreico}
          proporcionProteico={proporcionProteico}
          proporcionNutreico={proporcionNutreico}
          ingredienteProteico={ingredienteProteico}
          ingredienteNutreico={ingredienteNutreico}
          librasProteico={librasProteico}
          librasNutreico={librasNutreico}
          guideTarget={guideTarget}
        />}
          actions={<View style={styles.recordActions}>
          <RecordActions record={record} onClear={limpiarFormulario} onPrint={imprimirRegistro} canPrint={registroCompleto} />
        </View>}
        />}</TourPreview>
        <StatusBar style="light" />
      </TourScrollView>
    </View></GuidedTour>
  );
}

const CreateStyles = (width) => StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  inside_container: { flexGrow: 1, width: '100%', maxWidth: 1600, alignSelf: 'center', paddingHorizontal: width < 600 ? 12 : 24, paddingTop: 20, paddingBottom: 32, gap: 18 },
  recordActions: { width: '100%' },
});
