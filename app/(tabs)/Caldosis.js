import GuidedTour, { TourTarget, TourScrollView, TourPreview } from '../../components/GuidedTour';
import { doseTour } from '../../utils/toolTours';
import LearningGuide from '../../components/LearningGuide';
import { doseLesson } from '../../utils/toolLessons';
import { calculateDose } from '../../utils/doseCalculation';
import ToolWorkspace from '../../components/ToolWorkspace';
import { useEffect, useState } from 'react';
import { Alert, Animated, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useIsFocused } from '@react-navigation/native';
import AnimatedLogoBackground from '../../components/AnimatedLogoBackground';
import ToolGuide from '../../components/ToolGuide';
import InteractionCoach from '../../components/InteractionCoach';
import useGuidePulse from '../../components/useGuidePulse';
import RecordActions from '../../components/RecordActions';
import { saveAndPrintRecord } from '../../utils/saveAndPrintRecord';
import MainMenuButton from '../../components/MainMenuButton';

function CampoDosis({ numero, titulo, ayuda, value, onChangeText, unidad, onCambiarUnidad, focused, onFocus, onBlur, highlighted }) {
  const pulseStyle = useGuidePulse(highlighted);

  return (
    <TourTarget id={['peso','dosis','concentracion'][Number(numero)-1]}><Animated.View style={[styles.fieldGroup, highlighted && styles.guidedField, highlighted && pulseStyle]}>
      {highlighted && <Text style={styles.guidedLabel}>↓ PRESIONA AQUÍ</Text>}
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
    </Animated.View></TourTarget>
  );
}

export default function CalcularDosis() {
  const { width } = useWindowDimensions();
  const isFocused = useIsFocused();
  const [campoActivo, setCampoActivo] = useState(null);
  const [unidadPeso, setUnidadPeso] = useState('lb');
  const [unidadDosis, setUnidadDosis] = useState('mg/kg');
  const [unidadConcentracion, setUnidadConcentracion] = useState('mg/mL');
  const [peso, setPeso] = useState('');
  const [dosisPeso, setDosisPeso] = useState('');
  const [concentracion, setConcentracion] = useState('');
  const [calculoFinal, setCalculoFinal] = useState(null);
  const [coach, setCoach] = useState({
    label: 'COMIENZA AQUÍ',
    message: 'Presiona el campo “Peso del animal” para iniciar. La ayuda cambiará conforme avances.',
  });
  const [guideTarget, setGuideTarget] = useState('peso');
  const compact = width < 390;

  useEffect(() => {
    if (isFocused && Platform.OS !== 'web') ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
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

  const unidadResultado = unidadConcentracion === 'mg/mL' ? 'mL' : 'g';
  const formularioCompleto = [peso, dosisPeso, concentracion].every(value => Number.isFinite(Number(value)) && Number(value) > 0);

  const calcularDosis = () => {
    if (!formularioCompleto) return;
    const result = calculateDose({ weight:peso, weightUnit:unidadPeso, rate:dosisPeso, rateUnit:unidadDosis, concentration:concentracion, concentrationUnit:unidadConcentracion });
    setCalculoFinal(result.amount.toFixed(2));
    setCoach({
      label: 'RESULTADO LISTO',
      message: 'Revisa el panel de resultados. Comprueba la unidad y contrástalo con la etiqueta antes de usarlo.',
    });
    setGuideTarget('result');
  };

  const limpiarFormulario = () => {
    setPeso('');
    setDosisPeso('');
    setConcentracion('');
    setCalculoFinal(null);
    setUnidadPeso('lb');
    setUnidadDosis('mg/kg');
    setUnidadConcentracion('mg/mL');
    setCampoActivo(null);
    setGuideTarget('peso');
    setCoach({
      label: 'FORMULARIO LIMPIO',
      message: 'Presiona el campo “Peso del animal” para comenzar un nuevo cálculo.',
    });
  };

  const record = calculoFinal !== null ? {
        title: 'Registro de cálculo de dosis',
        subtitle: 'Dosificación veterinaria',
        rows: [
          { label: 'Peso del animal', value: `${peso} ${unidadPeso}` },
          { label: 'Dosis recomendada', value: `${dosisPeso} ${unidadDosis}` },
          { label: 'Concentración del producto', value: `${concentracion} ${unidadConcentracion}` },
        ],
        results: [{ label: 'Cantidad de producto', value: `${calculoFinal} ${unidadResultado}` }],
      } : null;
  const imprimirRegistro = async (options) => {
    if (record) await saveAndPrintRecord(record, options);
  };

  return (
    <GuidedTour title="Calculadora de dosis" steps={doseTour} currentId={({calculate:'calcular',result:'resultado'})[guideTarget] || guideTarget}><View style={styles.screen}>
      <AnimatedLogoBackground count={26} />
      <TourScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <MainMenuButton />
        <View style={styles.hero}>
          <View style={styles.heroIcon}><Text style={styles.heroIconText}>Rx</Text></View>
          <View style={styles.heroCopy}>
            <Text style={[styles.title, compact && styles.titleCompact]}>Calculadora de dosis</Text>
            <Text style={styles.subtitle}>Obtén una dosificación precisa según el peso y la concentración del producto.</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <ToolGuide
          title="Cómo calcular una dosis"
          whatIs="Esta calculadora determina cuánto producto debe recibir un animal a partir de su peso, la dosis recomendada y la concentración indicada por el fabricante."
          logic="Primero convierte las unidades a una base común. Luego multiplica el peso por la dosis recomendada y divide ese resultado entre la concentración del producto: cantidad = (peso × dosis) ÷ concentración."
          steps={[
            'Presiona el primer campo y escribe el peso actual del animal. Toca la unidad de la derecha para cambiar entre lb y kg.',
            'Escribe la dosis recomendada que aparece en la etiqueta o fue indicada por el profesional. Verifica si está expresada por kg o por lb.',
            'Introduce la concentración exacta del producto y selecciona la unidad correspondiente.',
            'Cuando los tres campos estén completos, presiona “Calcular dosis” en la zona inferior y revisa el panel de resultados.',
          ]}
          tip="No adivines la dosis ni la concentración. Usa siempre la etiqueta del producto y confirma el resultado con un profesional veterinario antes de administrar un medicamento."
        />

          <LearningGuide previewKind={"dose"} lesson={doseLesson} targets={['peso', ['peso','dosis','concentracion'], 'calcular', 'resultado', ['peso','dosis','resultado','concentracion']]} />
          <InteractionCoach cue={coach} />
        </View>

        <TourPreview values={{ peso, dosisPeso, concentracion, unidadPeso, unidadDosis, unidadConcentracion, unidadResultado, calculoFinal, formularioCompleto, guideTarget }}>{({ peso, dosisPeso, concentracion, unidadPeso, unidadDosis, unidadConcentracion, unidadResultado, calculoFinal, formularioCompleto, guideTarget }) => <ToolWorkspace
          input={<View style={styles.formCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Datos del tratamiento</Text>
            <Text style={styles.required}>Todos los campos son obligatorios</Text>
          </View>
          <CampoDosis numero="1" titulo="Peso del animal" ayuda="Peso actual del paciente" value={peso}
            onChangeText={(text) => { soloNumeros(text, setPeso); if (text) setGuideTarget('dosis'); }} unidad={unidadPeso}
            onCambiarUnidad={() => { cambiarUnidad(setUnidadPeso, ['lb', 'kg']); setCoach({ label: 'UNIDAD DE PESO', message: 'Usa el botón de la derecha para que la unidad coincida con el dato que tienes: libras o kilogramos.' }); }} focused={campoActivo === 'peso'}
            onFocus={() => { setCampoActivo('peso'); setGuideTarget('peso'); setCoach({ label: 'PASO 1 DE 3', message: 'Escribe únicamente el peso actual del animal. Después revisa la unidad que aparece a la derecha.' }); }} onBlur={() => setCampoActivo(null)} highlighted={guideTarget === 'peso'} />
          <View style={styles.separator} />
          <CampoDosis numero="2" titulo="Dosis recomendada" ayuda="Cantidad indicada por unidad de peso" value={dosisPeso}
            onChangeText={(text) => { soloNumeros(text, setDosisPeso); if (text) setGuideTarget('concentracion'); }} unidad={unidadDosis}
            onCambiarUnidad={() => { cambiarUnidad(setUnidadDosis, ['mg/kg', 'mg/lb']); setCoach({ label: 'UNIDAD DE DOSIS', message: 'Selecciona mg/kg o mg/lb exactamente como aparece en la recomendación del producto.' }); }} focused={campoActivo === 'dosis'}
            onFocus={() => { setCampoActivo('dosis'); setGuideTarget('dosis'); setCoach({ label: 'PASO 2 DE 3', message: 'Copia aquí la dosis recomendada. Este valor indica cuántos miligramos corresponden por unidad de peso.' }); }} onBlur={() => setCampoActivo(null)} highlighted={guideTarget === 'dosis'} />
          <View style={styles.separator} />
          <CampoDosis numero="3" titulo="Concentración del producto" ayuda="Concentración indicada en la etiqueta" value={concentracion}
            onChangeText={(text) => { soloNumeros(text, setConcentracion); if (text) setGuideTarget('calculate'); }} unidad={unidadConcentracion}
            onCambiarUnidad={() => { cambiarUnidad(setUnidadConcentracion, ['mg/mL', 'mg/g']); setCoach({ label: 'UNIDAD DE CONCENTRACIÓN', message: 'Usa mg/mL para volumen o mg/g para masa, según la etiqueta. La cantidad resultará en mL o g, respectivamente.' }); }} focused={campoActivo === 'concentracion'}
            onFocus={() => { setCampoActivo('concentracion'); setGuideTarget('concentracion'); setCoach({ label: 'PASO 3 DE 3', message: 'Introduce la concentración del producto. Al completar este campo se habilitará el botón de cálculo.' }); }} onBlur={() => setCampoActivo(null)} highlighted={guideTarget === 'concentracion'} />
        </View>}
          output={<TourTarget id="resultado">
{calculoFinal !== null ? (
          <View style={styles.resultCard} accessibilityRole="summary">
            <View style={styles.resultCheck}><Text style={styles.resultCheckText}>✓</Text></View>
            <Text style={styles.resultEyebrow}>DOSIS CALCULADA</Text>
            <View style={styles.resultLine}>
              <Text style={[styles.resultNumber, compact && styles.resultNumberCompact]}>{calculoFinal}</Text>
              <Text style={styles.resultUnit}>{unidadResultado}</Text>
            </View>
            <Text style={styles.resultNote}>Verifica siempre la indicación del producto antes de administrarlo.</Text>
          </View>
        ) : <View style={[styles.resultCard, styles.resultEmpty]}>
          <Text style={styles.resultEyebrow}>PANEL DE RESULTADOS</Text>
          <Text style={styles.emptyValue}>—</Text>
          <Text style={styles.cardTitle}>Tu resultado aparecerá aquí</Text>
          <Text style={styles.resultNote}>Completa los datos del tratamiento y presiona “Calcular dosis” en los botones inferiores.</Text>
          <View style={styles.formula}><Text style={styles.resultNote}>Cantidad = (peso × dosis) ÷ concentración</Text></View>
        </View>}
</TourTarget>}
          actions={<>
{guideTarget === 'calculate' && formularioCompleto && <Text style={styles.calculateGuide}>↓ AHORA PRESIONA ESTE BOTÓN</Text>}
          <TourTarget id="calcular"><Pressable onPress={calcularDosis} disabled={!formularioCompleto}
            style={({ pressed }) => [styles.calculateButton, guideTarget === 'calculate' && styles.calculateButtonGuided, !formularioCompleto && styles.calculateButtonDisabled, pressed && formularioCompleto && styles.calculateButtonPressed]}>
            <Text style={styles.calculateButtonText}>Calcular dosis</Text><Text style={styles.calculateArrow}>→</Text>
          </Pressable></TourTarget>
<View style={styles.recordActions}>
          <RecordActions record={record} onClear={limpiarFormulario} onPrint={imprimirRegistro} canPrint={!!record} />
        </View>
</>}
        />}</TourPreview>
        <Text style={styles.footerNote}>Herramienta de apoyo para el cálculo veterinario</Text>
        <StatusBar style="dark" />
      </TourScrollView>
    </View></GuidedTour>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flex: 1, backgroundColor: 'transparent' },
  content: { flexGrow: 1, width: '100%', maxWidth: 1600, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 22, paddingBottom: 34 },
  hero: { marginTop: 14, marginBottom: 16, paddingHorizontal: 4, flexDirection: 'row', alignItems: 'center', gap: 13 },
  heroIcon: { width: 54, height: 54, justifyContent: 'center', alignItems: 'center', borderRadius: 18, backgroundColor: '#166534', elevation: 3 },
  heroIconText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  heroCopy: { flex: 1 },
  title: { color: '#14532D', fontSize: 27, fontWeight: '800', letterSpacing: -0.5 },
  titleCompact: { fontSize: 23 },
  subtitle: { marginTop: 3, color: '#4B5563', fontSize: 13, lineHeight: 18 },
  coachSpacing: { marginTop: 12, marginBottom: 20 },
  formCard: { padding: 17, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 18, backgroundColor: '#FFFFFF', elevation: 5 },
  cardHeader: { marginBottom: 18 },
  cardTitle: { color: '#111827', fontSize: 19, fontWeight: '700' },
  required: { marginTop: 2, color: '#6B7280', fontSize: 12 },
  fieldGroup: { gap: 10 },
  guidedField: { marginHorizontal: -7, padding: 7, borderWidth: 2, borderColor: '#16A34A', borderRadius: 14, backgroundColor: '#F0FDF4' },
  guidedLabel: { color: '#166534', fontSize: 10, fontWeight: '900', letterSpacing: 0.7 },
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
  calculateButtonGuided: { borderWidth: 3, borderColor: '#86EFAC' },
  calculateGuide: { marginTop: 17, marginBottom: -15, color: '#166534', fontSize: 10, fontWeight: '900', letterSpacing: 0.7, textAlign: 'center' },
  calculateButtonPressed: { opacity: 0.86, transform: [{ scale: 0.98 }] },
  calculateButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  calculateArrow: { color: '#FFFFFF', fontSize: 23, lineHeight: 24 },
  resultCard: { minHeight: 320, justifyContent: 'center', padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#86EFAC', borderRadius: 18, backgroundColor: '#F0FDF4', elevation: 3 },
  resultCheck: { width: 32, height: 32, marginBottom: 8, justifyContent: 'center', alignItems: 'center', borderRadius: 16, backgroundColor: '#16A34A' },
  resultEmpty: { backgroundColor: '#FAFDFB', borderStyle: 'dashed', gap: 14 },
  emptyValue: { color: '#A0C3AB', fontSize: 64, fontWeight: '700' },
  formula: { padding: 14, backgroundColor: '#EAF5EE', borderRadius: 10, marginTop: 6 },
  resultCheckText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  resultEyebrow: { color: '#166534', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  resultLine: { marginVertical: 4, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 7 },
  resultNumber: { color: '#14532D', fontSize: 42, fontWeight: '800', letterSpacing: -1 },
  resultNumberCompact: { fontSize: 35 },
  resultUnit: { color: '#166534', fontSize: 16, fontWeight: '700' },
  resultNote: { maxWidth: 410, color: '#4B5563', fontSize: 12, lineHeight: 17, textAlign: 'center' },
  recordActions: { width: '100%' },
  footerNote: { marginTop: 18, color: '#6B7280', fontSize: 11, textAlign: 'center' },
});
