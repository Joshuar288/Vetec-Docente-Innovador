import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function InteractionCoach({ cue, accent = '#166534', soft = '#F0FDF4' }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (cue?.message) setVisible(true);
  }, [cue]);

  if (!cue?.message) return null;

  if (!visible) {
    return (
      <Pressable
        onPress={() => setVisible(true)}
        style={({ pressed }) => [styles.restore, { borderColor: accent }, pressed && styles.pressed]}
        accessibilityRole="button"
      >
        <Text style={[styles.restoreText, { color: accent }]}>? Mostrar ayuda de este paso</Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { borderColor: accent, backgroundColor: soft }]} accessibilityLiveRegion="polite">
      <View style={[styles.icon, { backgroundColor: accent }]}>
        <Text style={styles.iconText}>i</Text>
      </View>
      <View style={styles.copy}>
        <Text style={[styles.label, { color: accent }]}>{cue.label || 'AYUDA CONTEXTUAL'}</Text>
        <Text style={styles.message}>{cue.message}</Text>
      </View>
      <Pressable onPress={() => setVisible(false)} hitSlop={10} accessibilityLabel="Ocultar ayuda">
        <Text style={[styles.close, { color: accent }]}>×</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', padding: 11, flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderRadius: 13 },
  icon: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  iconText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  copy: { flex: 1 },
  label: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  message: { color: '#455468', fontSize: 12, lineHeight: 17, marginTop: 2 },
  close: { paddingLeft: 8, fontSize: 22, lineHeight: 24, fontWeight: '500' },
  restore: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderRadius: 999, backgroundColor: '#FFFFFF' },
  restoreText: { fontSize: 11, fontWeight: '800' },
  pressed: { opacity: 0.72 },
});
