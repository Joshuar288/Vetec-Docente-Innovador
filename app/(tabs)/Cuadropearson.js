import { View, Text, StyleSheet, TextInput, TouchableOpacity, Pressable, ScrollView, Modal, FlatList } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import * as ScreenOrientation from 'expo-screen-orientation';
import { useIsFocused } from '@react-navigation/native';
import AnimatedLogoBackground from '../../components/AnimatedLogoBackground';

function SelectorIngrediente({ items, selectedId, onSelect, placeholder }) {
  const [visible, setVisible] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const seleccionado = items.find((item) => item.id === selectedId);
  const termino = busqueda.trim().toLocaleLowerCase('es');
  const resultados = termino
    ? items.filter((item) => item.label.toLocaleLowerCase('es').includes(termino))
    : items;

  const cerrar = () => {
    setVisible(false);
    setBusqueda('');
  };

  return (
    <>
      <TouchableOpacity
        style={selectorStyles.control}
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={placeholder}
      >
        <Text style={selectorStyles.controlText} numberOfLines={2}>
          {seleccionado?.label || placeholder}
        </Text>
        <Text style={selectorStyles.arrow}>▼</Text>
      </TouchableOpacity>

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

function ContenidoPearson({
  ingredientesProteicos, ingredientesNutreicos, idProteico, idNutreico,
  seleccionarIngredienteProteico, seleccionarIngredienteNutreico,
  proteico, nutreico, valDeseado, setValDeseado, soloNumeros,
  parteProteico, parteNutreico, proporcionProteico, proporcionNutreico,
  ingredienteProteico, ingredienteNutreico, librasProteico, librasNutreico,
}) {
  const { width } = useWindowDimensions();
  const compact = width < 700;
  const s = responsiveStyles;
  const totalCantidad = (parseFloat(proporcionNutreico) + parseFloat(proporcionProteico)).toFixed(2);
  const totalProteina = (parseFloat(librasNutreico) + parseFloat(librasProteico)).toFixed(2);

  const bloqueResultado = (nombre, cantidad, proteina) => (
    <View style={[s.sourceResult, compact && s.sourceResultCompact]}>
      <Text style={s.sourceName} numberOfLines={3}>{nombre}</Text>
      <View style={s.resultMetrics}>
        <View style={s.resultMetric}>
          <Text style={s.resultLabel}>Cantidad</Text>
          <Text style={s.resultValue}>{cantidad} lb</Text>
        </View>
        <View style={s.resultMetric}>
          <Text style={s.resultLabel}>Proteína</Text>
          <Text style={s.resultValue}>{proteina} lb</Text>
        </View>
      </View>
    </View>
  );

  return (
    <>
      <View style={s.card}>
        <Text style={s.title}>Cuadrado de Pearson</Text>
        <Text style={s.hint}>Selecciona las fuentes y escribe la concentración deseada.</Text>
        <View style={[s.selectors, compact && s.stack]}>
          <View style={s.selectorColumn}>
            <Text style={s.label}>Fuente proteica</Text>
            <SelectorIngrediente items={ingredientesProteicos} selectedId={idProteico} onSelect={seleccionarIngredienteProteico} placeholder="Ingrediente proteico" />
          </View>
          <View style={s.selectorColumn}>
            <Text style={s.label}>Fuente energética</Text>
            <SelectorIngrediente items={ingredientesNutreicos} selectedId={idNutreico} onSelect={seleccionarIngredienteNutreico} placeholder="Ingrediente energético" />
          </View>
        </View>

        <View style={s.metricsGrid}>
          <View style={s.metricCard}>
            <Text style={s.metricTitle}>Proteína bruta</Text>
            <Text style={s.metricValue}>{proteico}%</Text><View style={s.divider} /><Text style={s.metricValue}>{nutreico}%</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricTitle}>Concentración deseada</Text>
            <TextInput keyboardType="numeric" value={String(valDeseado)} onChangeText={(text) => soloNumeros(text, setValDeseado)} style={s.input} placeholder="0" placeholderTextColor="#6B7280" selectTextOnFocus />
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricTitle}>Partes</Text>
            <Text style={s.metricValue}>{parteProteico || '0.00'}</Text><View style={s.divider} /><Text style={s.metricValue}>{parteNutreico || '0.00'}</Text>
          </View>
          <View style={s.metricCard}>
            <Text style={s.metricTitle}>Proporción</Text>
            <Text style={s.metricValue}>{proporcionProteico}%</Text><View style={s.divider} /><Text style={s.metricValue}>{proporcionNutreico}%</Text>
          </View>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.resultsTitle}>Resultados por cada 100 lb</Text>
        <View style={[s.results, compact && s.stack]}>
          {bloqueResultado(ingredienteProteico, proporcionProteico, librasProteico)}
          {bloqueResultado(ingredienteNutreico, proporcionNutreico, librasNutreico)}
        </View>
        <View style={[s.total, compact && s.totalCompact]}>
          <Text style={s.totalLabel}>Total</Text>
          <Text style={s.totalValue}>{totalCantidad} lb</Text>
          <Text style={s.totalValue}>{totalProteina}% de proteína</Text>
        </View>
      </View>
    </>
  );
}

const responsiveStyles = StyleSheet.create({
  card: { width: '100%', maxWidth: 1000, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF', elevation: 3, gap: 10 },
  title: { color: '#14532D', fontSize: 19, fontWeight: 'bold', textAlign: 'center' },
  hint: { color: '#4B5563', fontSize: 12, textAlign: 'center' },
  selectors: { flexDirection: 'row', gap: 9 },
  stack: { flexDirection: 'column' },
  selectorColumn: { flex: 1, minWidth: 0, gap: 6 },
  label: { color: '#1F2937', fontSize: 13, fontWeight: '600' },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metricCard: { flexGrow: 1, flexBasis: 115, minWidth: 105, minHeight: 112, padding: 8, justifyContent: 'space-around', alignItems: 'center', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 9, backgroundColor: '#F0FDF4' },
  metricTitle: { minHeight: 30, color: '#374151', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  metricValue: { color: '#111827', fontSize: 17, fontWeight: 'bold', textAlign: 'center' },
  divider: { width: '75%', height: 1, backgroundColor: '#D1D5DB' },
  input: { width: '85%', minHeight: 44, paddingHorizontal: 8, borderWidth: 2, borderColor: '#16A34A', borderRadius: 8, backgroundColor: '#FFFFFF', color: '#111827', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  resultsTitle: { color: '#14532D', fontSize: 17, fontWeight: 'bold', textAlign: 'center' },
  results: { flexDirection: 'row', gap: 12 },
  sourceResult: { flex: 1, minWidth: 0, padding: 9, borderRadius: 10, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', gap: 7 },
  sourceResultCompact: { width: '100%' },
  sourceName: { minHeight: 42, color: '#111827', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  resultMetrics: { flexDirection: 'row' },
  resultMetric: { flex: 1, alignItems: 'center', gap: 4 },
  resultLabel: { color: '#6B7280', fontSize: 13 },
  resultValue: { color: '#166534', fontSize: 16, fontWeight: 'bold' },
  total: { minHeight: 46, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderRadius: 9, backgroundColor: '#166534', gap: 8 },
  totalCompact: { flexWrap: 'wrap', paddingVertical: 10 },
  totalLabel: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
  totalValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

function VistaCuadradoPearson(props) {
  const {
    ingredientesProteicos, ingredientesNutreicos, idProteico, idNutreico,
    seleccionarIngredienteProteico, seleccionarIngredienteNutreico,
    proteico, nutreico, valDeseado, setValDeseado, soloNumeros,
    parteProteico, parteNutreico, proporcionProteico, proporcionNutreico,
    ingredienteProteico, ingredienteNutreico, librasProteico, librasNutreico,
  } = props;
  const { width } = useWindowDimensions();
  const compact = width < 700;
  const s = classicStyles;

  return (
    <>
      <View style={s.card}>
        <Text style={s.title}>Cuadrado de Pearson</Text>
        <Text style={s.subtitle}>Balance de proteína bruta</Text>

        <View style={[s.selectors, compact && s.selectorsCompact]}>
          <View style={s.selectorColumn}>
            <Text style={s.selectorLabel}>1 · Fuente proteica</Text>
            <SelectorIngrediente items={ingredientesProteicos} selectedId={idProteico} onSelect={seleccionarIngredienteProteico} placeholder="Ingrediente proteico" />
          </View>
          <View style={s.selectorColumn}>
            <Text style={s.selectorLabel}>2 · Fuente energética</Text>
            <SelectorIngrediente items={ingredientesNutreicos} selectedId={idNutreico} onSelect={seleccionarIngredienteNutreico} placeholder="Ingrediente energético" />
          </View>
        </View>

        <View style={s.columnHeadings}>
          <Text style={s.heading}>Proteína bruta</Text>
          <Text style={s.heading}>Concentración</Text>
          <Text style={s.heading}>Partes</Text>
        </View>

        <View style={[s.diagram, compact && s.diagramCompact]}>
          <View style={[s.diagonal, s.diagonalDown]} />
          <View style={[s.diagonal, s.diagonalUp]} />

          <View style={[s.valueNode, s.topLeft]}><Text style={s.nodeValue}>{proteico}%</Text><Text style={s.nodeCaption}>Proteica</Text></View>
          <View style={[s.valueNode, s.bottomLeft]}><Text style={s.nodeValue}>{nutreico}%</Text><Text style={s.nodeCaption}>Energética</Text></View>

          <View style={s.centerNode}>
            <Text style={s.centerLabel}>Deseada</Text>
            <TextInput keyboardType="numeric" value={String(valDeseado)} onChangeText={(text) => soloNumeros(text, setValDeseado)} style={s.centerInput} placeholder="0" placeholderTextColor="#86A48F" selectTextOnFocus />
            <Text style={s.percent}>%</Text>
          </View>

          <View style={[s.valueNode, s.topRight]}><Text style={s.nodeValue}>{parteProteico || '0.00'}</Text><Text style={s.nodeCaption}>partes</Text></View>
          <View style={[s.valueNode, s.bottomRight]}><Text style={s.nodeValue}>{parteNutreico || '0.00'}</Text><Text style={s.nodeCaption}>partes</Text></View>
        </View>

        <View style={s.proportions}>
          <View style={s.proportion}><Text style={s.proportionName}>Fuente proteica</Text><Text style={s.proportionValue}>{proporcionProteico}%</Text></View>
          <View style={s.proportion}><Text style={s.proportionName}>Fuente energética</Text><Text style={s.proportionValue}>{proporcionNutreico}%</Text></View>
        </View>
      </View>

      <View style={s.resultsCard}>
        <Text style={s.resultsTitle}>Mezcla por cada 100 lb</Text>
        <View style={[s.resultRow, compact && s.resultRowCompact]}>
          <View style={s.resultSource}><Text style={s.resultName} numberOfLines={2}>{ingredienteProteico}</Text><Text style={s.resultAmount}>{proporcionProteico} lb</Text><Text style={s.resultProtein}>{librasProteico}% de proteína</Text></View>
          <View style={s.resultSeparator} />
          <View style={s.resultSource}><Text style={s.resultName} numberOfLines={2}>{ingredienteNutreico}</Text><Text style={s.resultAmount}>{proporcionNutreico} lb</Text><Text style={s.resultProtein}>{librasNutreico}% de proteína</Text></View>
        </View>
      </View>
    </>
  );
}

const classicStyles = StyleSheet.create({
  card: { width: '100%', maxWidth: 1000, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: '#BBF7D0', backgroundColor: '#FFFFFF', elevation: 4 },
  title: { color: '#14532D', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { marginTop: 1, marginBottom: 10, color: '#6B7280', fontSize: 12, textAlign: 'center' },
  selectors: { flexDirection: 'row', gap: 9 },
  selectorsCompact: { flexDirection: 'column' },
  selectorColumn: { flex: 1, minWidth: 0, gap: 6 },
  selectorLabel: { color: '#166534', fontSize: 12, fontWeight: '700' },
  columnHeadings: { marginTop: 12, paddingHorizontal: 8, flexDirection: 'row', justifyContent: 'space-between' },
  heading: { width: '30%', color: '#4B5563', fontSize: 10, fontWeight: '700', textAlign: 'center', textTransform: 'uppercase' },
  diagram: { width: '100%', height: 184, position: 'relative', overflow: 'hidden' },
  diagramCompact: { height: 176 },
  diagonal: { position: 'absolute', left: '20%', top: '50%', width: '60%', height: 3, borderRadius: 2, backgroundColor: '#22C55E' },
  diagonalDown: { transform: [{ rotate: '19deg' }] },
  diagonalUp: { transform: [{ rotate: '-19deg' }] },
  valueNode: { position: 'absolute', width: '23%', minWidth: 74, minHeight: 56, padding: 5, zIndex: 2, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#86EFAC', borderRadius: 10, backgroundColor: '#F0FDF4' },
  topLeft: { left: 0, top: 10 },
  bottomLeft: { left: 0, bottom: 10 },
  topRight: { right: 0, top: 10 },
  bottomRight: { right: 0, bottom: 10 },
  nodeValue: { color: '#14532D', fontSize: 17, fontWeight: 'bold' },
  nodeCaption: { color: '#6B7280', fontSize: 10, textAlign: 'center' },
  centerNode: { position: 'absolute', left: '39%', top: 46, width: '22%', minHeight: 92, zIndex: 3, padding: 5, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#166534', borderRadius: 46, backgroundColor: '#FFFFFF', elevation: 5 },
  centerLabel: { color: '#166534', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  centerInput: { width: '70%', minHeight: 38, padding: 0, color: '#111827', fontSize: 21, fontWeight: 'bold', textAlign: 'center' },
  percent: { position: 'absolute', right: 8, bottom: 23, color: '#166534', fontSize: 12, fontWeight: 'bold' },
  proportions: { flexDirection: 'row', gap: 8 },
  proportion: { flex: 1, minHeight: 48, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 9, backgroundColor: '#166534', gap: 5 },
  proportionName: { flex: 1, color: '#DCFCE7', fontSize: 11, fontWeight: '600' },
  proportionValue: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  resultsCard: { width: '100%', maxWidth: 1000, padding: 11, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', elevation: 3 },
  resultsTitle: { marginBottom: 7, color: '#14532D', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  resultRow: { flexDirection: 'row', alignItems: 'stretch' },
  resultRowCompact: { flexDirection: 'column', gap: 10 },
  resultSource: { flex: 1, padding: 8, alignItems: 'center', gap: 3 },
  resultSeparator: { width: 1, backgroundColor: '#D1D5DB' },
  resultName: { minHeight: 36, color: '#374151', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  resultAmount: { color: '#166534', fontSize: 17, fontWeight: 'bold' },
  resultProtein: { color: '#6B7280', fontSize: 12 },
});

export default function CalcularDosis() {
  const { width } = useWindowDimensions();
  const styles = CreateStyles(width);
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
  const [vista, setVista] = useState('cuadrado');
  const [ingredienteProteico, setIngredienteProteico] = useState('Sin ingrediente seleccionado');
  const [ingredienteNutreico, setIngredienteNutreico] = useState('Sin ingrediente seleccionado');
  const [librasProteico, setLibrasProteico] = useState('Sin Calcular');
  const [librasNutreico, setLibrasNutreico] = useState('Sin Calcular');
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
    const proteicoValor = Number(proteico) || 0;
    const nutreicoValor = Number(nutreico) || 0;
    const valDeseadoValor = Number(valDeseado) || 0;

    if (!valDeseado || valDeseadoValor === 0) {
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

return (
    <View style={{ flex: 1 }}>
      {/* Fondo de pantalla fijo - Fuera del ScrollView */}
      <AnimatedLogoBackground count={30} />

      {/* Formulario scrolleable sobre el fondo */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.inside_container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.viewSwitcher} accessibilityRole="tablist">
          <Pressable
            style={[styles.viewButton, vista === 'cuadrado' && styles.viewButtonActive]}
            onPress={() => setVista('cuadrado')}
            accessibilityRole="tab"
            accessibilityState={{ selected: vista === 'cuadrado' }}
          >
            <Text style={[styles.viewButtonText, vista === 'cuadrado' && styles.viewButtonTextActive]}>Vista cuadrado</Text>
          </Pressable>
          <Pressable
            style={[styles.viewButton, vista === 'tarjetas' && styles.viewButtonActive]}
            onPress={() => setVista('tarjetas')}
            accessibilityRole="tab"
            accessibilityState={{ selected: vista === 'tarjetas' }}
          >
            <Text style={[styles.viewButtonText, vista === 'tarjetas' && styles.viewButtonTextActive]}>Vista tarjetas</Text>
          </Pressable>
        </View>

        {vista === 'cuadrado' && <VistaCuadradoPearson
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
        />}

        {vista === 'tarjetas' && <ContenidoPearson
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
        />}
        <StatusBar style="light" />
      </ScrollView>
    </View>
  );
}

const CreateStyles = (width) => {
  const responsive = (mobile, pc) => width < 800 ? mobile : pc;
  
  return StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: 'transparent',
      zIndex: 1,
    },

    inside_container: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: responsive(8, 18),
      paddingTop: responsive(8, 18),
      paddingBottom: 20,
      gap: responsive(9, 16),
    },

    viewSwitcher: {
      width: '100%',
      maxWidth: 520,
      minHeight: 42,
      padding: 3,
      flexDirection: 'row',
      borderRadius: 10,
      backgroundColor: '#DCFCE7',
    },

    viewButton: {
      flex: 1,
      minHeight: 36,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
    },

    viewButtonActive: {
      backgroundColor: '#166534',
      elevation: 2,
    },

    viewButtonText: {
      color: '#166534',
      fontSize: responsive(12, 14),
      fontWeight: '600',
      textAlign: 'center',
    },

    viewButtonTextActive: {
      color: '#FFFFFF',
    },

  });
}

