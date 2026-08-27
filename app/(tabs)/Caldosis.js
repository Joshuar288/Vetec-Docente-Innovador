import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useIsFocused } from '@react-navigation/native';
import AnimatedLogoBackground from '../../components/AnimatedLogoBackground';

function CampoDosis({ numero, titulo, ayuda, value, onChangeText, unidad, onCambiarUnidad, focused, onFocus, onBlur }) {
  return (
    <View style={styles.fieldGroup}>
      <View style={styles.fieldHeading}>
        <View style={styles.stepBadge}><Text style={styles.stepText}>{numero}</Text></View>
        <View style={styles.fieldCopy}>
          <Text style={styles.fieldLabel}>{titulo}</Text>
          <Text style={styles.fieldHelp}>{ayuda}</Text>
        </View>
      </View>
      <View style={[styles.inputShell, focused && styles.inputShellFocused]}>
        <TextInput value={value} onChangeText={onChangeText} style={styles.input} keyboardType="numeric"
          placeholder="0" placeholderTextColor="#9CA3AF" onFocus={onFocus} onBlur={onBlur} selectTextOnFocus />
        <Pressable onPress={onCambiarUnidad} style={({ pressed }) => [styles.unitButton, pressed && styles.unitButtonPressed]}
          accessibilityRole="button" accessibilityLabel={`Cambiar unidad. Unidad actual: ${unidad}`}>
          <Text style={styles.unitText} numberOfLines={1}>{unidad}</Text>
          <Text style={styles.unitArrows}>⇄</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function CalcularDosis() {
  const { width } = useWindowDimensions();
  const isFocused = useIsFocused();
  const [campoActivo, setCampoActivo] = useState(null);
  const [unidadPeso, setUnidadPeso] = useState('lb');
  const [unidadDosis, setUnidadDosis] = useState('mg/kg');
  const [unidadConcentracion, setUnidadConcentracion] = useState('mg/kg');
  const [peso, setPeso] = useState('');
  const [dosisPeso, setDosisPeso] = useState('');
  const [concentracion, setConcentracion] = useState('');
  const [calculoFinal, setCalculoFinal] = useState(null);
  const compact = width < 390;

  useEffect(() => {
    if (isFocused) ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }, [isFocused]);

  const soloNumeros = (texto, setter) => {
    const normalizado = texto.replace(',', '.').replace(/[^0-9.]/g, '');
    const partes = normalizado.split('.');
    setter(partes.length > 1 ? `${partes.shift()}.${partes.join('')}` : normalizado);
    setCalculoFinal(null);
  };

  const cambiarUnidad = (setter, unidades) => {
    setter((actual) => actual === unidades[0] ? unidades[1] : unidades[0]);
    setCalculoFinal(null);
  };

  const verificarLibra = (unidad, valor) => unidad === 'lb' ? Number(valor) * 0.453592 : Number(valor);
  const verificarVolumen = (unidad, valor) => unidad === 'mg/lb' ? Number(valor) * 2.20462 : Number(valor);
  const formularioCompleto = Number(peso) > 0 && Number(dosisPeso) > 0 && Number(concentracion) > 0;

  const calcularDosis = () => {
    if (!formularioCompleto) return;
    const pesoFinal = verificarLibra(unidadPeso, peso);
    const dosisFinal = verificarVolumen(unidadDosis, dosisPeso);
    const concentracionFinal = verificarVolumen(unidadConcentracion, concentracion);
    setCalculoFinal(((pesoFinal * dosisFinal) / concentracionFinal).toFixed(2));
  };

  return (
    <View style={styles.screen}>
      <AnimatedLogoBackground count={26} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.heroIcon}><Text style={styles.heroIconText}>Rx</Text></View>
          <View style={styles.heroCopy}>
            <Text style={[styles.title, compact && styles.titleCompact]}>Calculadora de dosis</Text>
            <Text style={styles.subtitle}>Obtén una dosificación precisa según el peso y la concentración del producto.</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Datos del tratamiento</Text>
            <Text style={styles.required}>Todos los campos son obligatorios</Text>
          </View>
          <CampoDosis numero="1" titulo="Peso del animal" ayuda="Peso actual del paciente" value={peso}
            onChangeText={(text) => soloNumeros(text, setPeso)} unidad={unidadPeso}
            onCambiarUnidad={() => cambiarUnidad(setUnidadPeso, ['lb', 'kg'])} focused={campoActivo === 'peso'}
            onFocus={() => setCampoActivo('peso')} onBlur={() => setCampoActivo(null)} />
          <View style={styles.separator} />
          <CampoDosis numero="2" titulo="Dosis recomendada" ayuda="Cantidad indicada por unidad de peso" value={dosisPeso}
            onChangeText={(text) => soloNumeros(text, setDosisPeso)} unidad={unidadDosis}
            onCambiarUnidad={() => cambiarUnidad(setUnidadDosis, ['mg/kg', 'mg/lb'])} focused={campoActivo === 'dosis'}
            onFocus={() => setCampoActivo('dosis')} onBlur={() => setCampoActivo(null)} />
          <View style={styles.separator} />
          <CampoDosis numero="3" titulo="Concentración del producto" ayuda="Concentración indicada en la etiqueta" value={concentracion}
            onChangeText={(text) => soloNumeros(text, setConcentracion)} unidad={unidadConcentracion}
            onCambiarUnidad={() => cambiarUnidad(setUnidadConcentracion, ['mg/kg', 'mg/lb'])} focused={campoActivo === 'concentracion'}
            onFocus={() => setCampoActivo('concentracion')} onBlur={() => setCampoActivo(null)} />
          <Pressable onPress={calcularDosis} disabled={!formularioCompleto}
            style={({ pressed }) => [styles.calculateButton, !formularioCompleto && styles.calculateButtonDisabled, pressed && formularioCompleto && styles.calculateButtonPressed]}>
            <Text style={styles.calculateButtonText}>Calcular dosis</Text><Text style={styles.calculateArrow}>→</Text>
          </Pressable>
        </View>

        {calculoFinal !== null && (
          <View style={styles.resultCard} accessibilityRole="summary">
            <View style={styles.resultCheck}><Text style={styles.resultCheckText}>✓</Text></View>
            <Text style={styles.resultEyebrow}>DOSIS CALCULADA</Text>
            <View style={styles.resultLine}>
              <Text style={[styles.resultNumber, compact && styles.resultNumberCompact]}>{calculoFinal}</Text>
              <Text style={styles.resultUnit}>{unidadConcentracion}</Text>
            </View>
            <Text style={styles.resultNote}>Verifica siempre la indicación del producto antes de administrarlo.</Text>
          </View>
        )}
        <Text style={styles.footerNote}>Herramienta de apoyo para el cálculo veterinario</Text>
        <StatusBar style="dark" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1, backgroundColor: 'transparent' },
  content: { flexGrow: 1, width: '100%', maxWidth: 680, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 22, paddingBottom: 34 },
  hero: { marginBottom: 16, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center', gap: 13 },
  heroIcon: { width: 54, height: 54, justifyContent: 'center', alignItems: 'center', borderRadius: 18, backgroundColor: '#166534', elevation: 3 },
  heroIconText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  heroCopy: { flex: 1 },
  title: { color: '#14532D', fontSize: 27, fontWeight: '800', letterSpacing: -0.5 },
  titleCompact: { fontSize: 23 },
  subtitle: { marginTop: 3, color: '#4B5563', fontSize: 13, lineHeight: 18 },
  formCard: { padding: 17, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 18, backgroundColor: '#FFFFFF', elevation: 5 },
  cardHeader: { marginBottom: 18 },
  cardTitle: { color: '#111827', fontSize: 19, fontWeight: '700' },
  required: { marginTop: 2, color: '#6B7280', fontSize: 12 },
  fieldGroup: { gap: 10 },
  fieldHeading: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepBadge: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center', borderRadius: 9, backgroundColor: '#DCFCE7' },
  stepText: { color: '#166534', fontSize: 14, fontWeight: '800' },
  fieldCopy: { flex: 1 },
  fieldLabel: { color: '#1F2937', fontSize: 15, fontWeight: '700' },
  fieldHelp: { marginTop: 1, color: '#6B7280', fontSize: 12 },
  inputShell: { minHeight: 56, flexDirection: 'row', alignItems: 'stretch', overflow: 'hidden', borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 12, backgroundColor: '#F9FAFB' },
  inputShellFocused: { borderColor: '#16A34A', backgroundColor: '#FFFFFF' },
  input: { flex: 1, minWidth: 0, paddingHorizontal: 15, color: '#111827', fontSize: 19, fontWeight: '600' },
  unitButton: { width: 88, paddingHorizontal: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#DCFCE7', gap: 5 },
  unitButtonPressed: { backgroundColor: '#BBF7D0' },
  unitText: { color: '#14532D', fontSize: 13, fontWeight: '800' },
  unitArrows: { color: '#16A34A', fontSize: 14 },
  separator: { height: 1, marginVertical: 16, backgroundColor: '#F0F1F3' },
  calculateButton: { minHeight: 56, marginTop: 22, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 13, backgroundColor: '#166534', gap: 10, elevation: 3 },
  calculateButtonDisabled: { backgroundColor: '#A7B8AC', elevation: 0 },
  calculateButtonPressed: { opacity: 0.86, transform: [{ scale: 0.98 }] },
  calculateButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  calculateArrow: { color: '#FFFFFF', fontSize: 23, lineHeight: 24 },
  resultCard: { marginTop: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#86EFAC', borderRadius: 18, backgroundColor: '#F0FDF4', elevation: 3 },
  resultCheck: { width: 32, height: 32, marginBottom: 8, justifyContent: 'center', alignItems: 'center', borderRadius: 16, backgroundColor: '#16A34A' },
  resultCheckText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  resultEyebrow: { color: '#166534', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  resultLine: { marginVertical: 4, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 7 },
  resultNumber: { color: '#14532D', fontSize: 42, fontWeight: '800', letterSpacing: -1 },
  resultNumberCompact: { fontSize: 35 },
  resultUnit: { color: '#166534', fontSize: 16, fontWeight: '700' },
  resultNote: { maxWidth: 410, color: '#4B5563', fontSize: 12, lineHeight: 17, textAlign: 'center' },
  footerNote: { marginTop: 18, color: '#6B7280', fontSize: 11, textAlign: 'center' },
});
