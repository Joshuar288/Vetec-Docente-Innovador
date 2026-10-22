import { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useGuidedTour } from './GuidedTour';

export default function HelpDialog({ label = 'Ver guía', title, accent = '#166534', soft = '#F0FDF4', children, tourStep, onOpen }) {
  const tour = useGuidedTour();
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const closeButton = useRef(null);
  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => trigger.current?.focus?.(), 0);
  }, []);
  useEffect(() => {
    if (!open || Platform.OS !== 'web') return;
    const onKey = (event) => { if (event.key === 'Escape') { event.preventDefault(); close(); } };
    document.addEventListener('keydown', onKey);
    const timer = setTimeout(() => closeButton.current?.focus?.(), 0);
    return () => { document.removeEventListener('keydown', onKey); clearTimeout(timer); };
  }, [open, close]);
  return <>
    <Pressable ref={trigger} onPress={() => { if (tour && tourStep) tour.start(tour.prefix ? `${tour.prefix}.${tourStep}` : tourStep); else { onOpen?.(); setOpen(true); } }} accessibilityRole="button" accessibilityLabel={`${label}: ${title}`} accessibilityState={{ expanded: open }}
      style={({ pressed }) => [styles.trigger, { borderColor: accent, backgroundColor: soft }, pressed && styles.pressed]}>
      <Text style={[styles.icon, { color: accent }]}>?</Text><Text style={[styles.triggerText, { color: accent }]}>{label}</Text>
    </Pressable>
    <Modal visible={open} transparent animationType="fade" onRequestClose={close} statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Cerrar ayuda" accessibilityRole="button" />
        <View style={styles.dialog} accessibilityViewIsModal>
          <View style={[styles.header, { backgroundColor: soft }]}>
            <Text accessibilityRole="header" style={[styles.title, { color: accent }]}>{title}</Text>
            <Pressable ref={closeButton} accessibilityRole="button" accessibilityLabel="Cerrar indicaciones" onPress={close} style={styles.close}>
              <Text style={[styles.closeText, { color: accent }]}>×</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator>{children}</ScrollView>
          <Pressable accessibilityRole="button" onPress={close} style={[styles.done, { backgroundColor: accent }]}><Text style={styles.doneText}>Entendido, volver a la herramienta</Text></Pressable>
        </View>
      </View>
    </Modal>
  </>;
}
const styles = StyleSheet.create({
  trigger: { alignSelf: 'flex-start', minHeight: 40, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 7, borderWidth: 1, borderRadius: 20 },
  icon: { fontSize: 16, fontWeight: '900' }, triggerText: { fontSize: 12, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.55)', justifyContent: 'center', alignItems: 'center', padding: 18 },
  dialog: { width: '100%', maxWidth: 760, maxHeight: '88%', backgroundColor: '#FFFFFF', borderRadius: 18, overflow: 'hidden', elevation: 12 },
  header: { flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 8, paddingVertical: 10, gap: 12 },
  title: { flex: 1, fontSize: 19, fontWeight: '800' },
  close: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  closeText: { fontSize: 28 }, body: { padding: 20, gap: 14 },
  done: { minHeight: 46, marginHorizontal: 20, marginBottom: 18, marginTop: 6, padding: 12, borderRadius: 11, alignItems: 'center' },
  doneText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', textAlign: 'center' }, pressed: { opacity: 0.75 },
});
