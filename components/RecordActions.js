import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function RecordActions({ onClear, onPrint, canPrint = true, accent = '#166534' }) {
  const [printing, setPrinting] = useState(false);

  const handlePrint = async () => {
    if (!canPrint || printing) return;
    setPrinting(true);
    try {
      await onPrint();
    } finally {
      setPrinting(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.actions}>
        <Pressable
          onPress={onClear}
          accessibilityRole="button"
          style={({ pressed }) => [styles.button, styles.clearButton, { borderColor: accent }, pressed && styles.pressed]}
        >
          <Text style={[styles.clearText, { color: accent }]}>Limpiar</Text>
        </Pressable>
        <Pressable
          onPress={handlePrint}
          disabled={!canPrint || printing}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canPrint || printing }}
          style={({ pressed }) => [styles.button, styles.printButton, { backgroundColor: accent }, (!canPrint || printing) && styles.disabled, pressed && canPrint && styles.pressed]}
        >
          <Text style={styles.printText}>{printing ? 'Preparando…' : 'Guardar e imprimir'}</Text>
        </Pressable>
      </View>
      <Text style={styles.note}>El historial con SQLite estará disponible próximamente. Por ahora, esta opción prepara e imprime el registro actual.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', gap: 7 },
  actions: { flexDirection: 'row', gap: 10 },
  button: { minHeight: 46, paddingHorizontal: 15, flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  clearButton: { borderWidth: 1.5, backgroundColor: '#FFFFFF' },
  printButton: { elevation: 2 },
  clearText: { fontSize: 14, fontWeight: '800' },
  printText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', textAlign: 'center' },
  disabled: { opacity: 0.45, elevation: 0 },
  pressed: { opacity: 0.78 },
  note: { color: '#64748B', fontSize: 10, lineHeight: 14, textAlign: 'center' },
});
