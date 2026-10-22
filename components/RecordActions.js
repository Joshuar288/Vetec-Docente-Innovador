import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { useAccount } from './AccountProvider';
import { saveRecord } from '../utils/records';
import { TourTarget } from './GuidedTour';

export default function RecordActions({ onClear, onPrint, record, canPrint = true, accent = '#166534' }) {
  const [printing, setPrinting] = useState(false);
  const [message, setMessage] = useState('');
  const { ready, user } = useAccount();
  const snapshot = record && canPrint ? JSON.stringify(record) : null;
  useEffect(() => {
    if (!ready || !user || !snapshot) return;
    let active = true;
    setMessage('Guardando automáticamente…');
    saveRecord(JSON.parse(snapshot), { expectedUserId: user.id }).then(() => {
      if (active) setMessage('Guardado automáticamente en tu cuenta en este dispositivo.');
    }).catch((error) => { if (active) setMessage(`No se pudo guardar: ${error.message}`); });
    return () => { active = false; };
  }, [snapshot, ready, user?.id]);

  const handlePrint = async (print) => {
    if (!canPrint || !record || printing || !ready) return;
    setPrinting(true);
    setMessage('');
    try {
      await onPrint({ print, expectedUserId: user?.id || null });
      setMessage(user ? 'Guardado en el dispositivo. Consulta el estado del respaldo en tu historial.' : 'Modo invitado: no se ha guardado ningún dato.');
    } catch (error) {
      setMessage(error.message || 'No se pudo guardar. Inténtalo nuevamente.');
    } finally {
      setPrinting(false);
    }
  };

  return (
    <TourTarget id="acciones" style={styles.wrapper}>
      <View style={styles.actions}>
        <Pressable
          onPress={onClear}
          disabled={printing}
          accessibilityRole="button"
          style={({ pressed }) => [styles.button, styles.clearButton, { borderColor: accent }, pressed && styles.pressed]}
        >
          <Text style={[styles.clearText, { color: accent }]}>Limpiar</Text>
        </Pressable>
        {user && <Pressable
          onPress={() => handlePrint(false)}
          disabled={!canPrint || printing || !ready}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canPrint || printing }}
          style={({ pressed }) => [styles.button, styles.printButton, { backgroundColor: accent }, (!canPrint || printing) && styles.disabled, pressed && canPrint && styles.pressed]}
        >
          <Text style={styles.printText}>{printing ? 'Guardando…' : 'Guardar'}</Text>
        </Pressable>}
        <Pressable onPress={() => handlePrint(true)} disabled={!canPrint || printing || !ready} accessibilityRole="button" style={[styles.button, { backgroundColor: accent }, (!canPrint || printing || !ready) && styles.disabled]}>
          <Text style={styles.printText}>{user ? 'Guardar e imprimir' : 'Imprimir sin guardar'}</Text>
        </Pressable>
      </View>
      <Text accessibilityLiveRegion="polite" style={styles.note}>{message || (user ? 'Los resultados se guardan automáticamente en tu cuenta, incluso sin conexión.' : 'Modo invitado: tu actividad no se guarda. Inicia sesión para conservar tus registros.')}</Text>
      <Link href="/cuenta" style={[styles.note, { color: accent }]}>Ver mi cuenta e historial</Link>
    </TourTarget>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', gap: 7 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  button: { minHeight: 46, paddingHorizontal: 15, flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  clearButton: { borderWidth: 1.5, backgroundColor: '#FFFFFF' },
  printButton: { elevation: 2 },
  clearText: { fontSize: 14, fontWeight: '800' },
  printText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', textAlign: 'center' },
  disabled: { opacity: 0.45, elevation: 0 },
  pressed: { opacity: 0.78 },
  note: { color: '#64748B', fontSize: 10, lineHeight: 14, textAlign: 'center' },
});
