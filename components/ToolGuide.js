import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

export default function ToolGuide({
  title = 'Guía de la actividad',
  whatIs,
  logic,
  steps = [],
  tip,
  accent = '#166534',
  soft = '#F0FDF4',
}) {
  const [open, setOpen] = useState(false);
  const { width } = useWindowDimensions();
  const wide = width >= 720;

  return (
    <View style={[styles.container, { borderColor: accent }]}>
      <Pressable
        onPress={() => setOpen((current) => !current)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={({ pressed }) => [styles.header, { backgroundColor: soft }, pressed && styles.pressed]}
      >
        <View style={[styles.helpIcon, { backgroundColor: accent }]}>
          <Text style={styles.helpIconText}>?</Text>
        </View>
        <View style={styles.headerCopy}>
          <Text style={[styles.eyebrow, { color: accent }]}>APRENDE MIENTRAS PRACTICAS</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={[styles.toggle, { color: accent }]}>{open ? 'Ocultar −' : 'Ver guía +'}</Text>
      </Pressable>

      {open && (
        <View style={styles.body}>
          <GuideSection title="¿Qué es esta herramienta?" text={whatIs} accent={accent} />
          <GuideSection title="¿Cuál es la lógica?" text={logic} accent={accent} highlighted soft={soft} />

          <View style={styles.stepsSection}>
            <Text style={styles.sectionTitle}>Cómo realizar la actividad</Text>
            <View style={[styles.steps, wide && styles.stepsWide]}>
              {steps.map((step, index) => (
                <View key={`${index}-${step}`} style={[styles.step, wide && styles.stepWide]}>
                  <View style={[styles.stepNumber, { backgroundColor: accent }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>

          {tip ? (
            <View style={[styles.tip, { backgroundColor: soft }]}>
              <Text style={[styles.tipLabel, { color: accent }]}>CONSEJO</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

function GuideSection({ title, text, accent, highlighted = false, soft }) {
  return (
    <View style={[styles.section, highlighted && { backgroundColor: soft }]}>
      <View style={[styles.sectionBar, { backgroundColor: accent }]} />
      <View style={styles.sectionCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', overflow: 'hidden', borderWidth: 1.5, borderRadius: 16, backgroundColor: '#FFFFFF', elevation: 3, boxShadow: '0px 4px 14px rgba(15, 23, 42, 0.09)' },
  header: { minHeight: 68, paddingHorizontal: 13, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' },
  helpIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  helpIconText: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  headerCopy: { flex: 1 },
  eyebrow: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  title: { color: '#172033', fontSize: 16, fontWeight: '800', marginTop: 1 },
  toggle: { marginLeft: 8, fontSize: 11, fontWeight: '800' },
  body: { padding: 13, gap: 12 },
  section: { padding: 11, flexDirection: 'row', borderRadius: 11 },
  sectionBar: { width: 4, borderRadius: 2, marginRight: 9 },
  sectionCopy: { flex: 1 },
  sectionTitle: { color: '#253247', fontSize: 13, fontWeight: '800' },
  sectionText: { color: '#5F6E80', fontSize: 12, lineHeight: 18, marginTop: 3 },
  stepsSection: { gap: 8 },
  steps: { gap: 8 },
  stepsWide: { flexDirection: 'row', flexWrap: 'wrap' },
  step: { minHeight: 54, padding: 9, flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 11, backgroundColor: '#FAFCFE' },
  stepWide: { width: '48%', flexGrow: 1 },
  stepNumber: { width: 25, height: 25, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  stepNumberText: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  stepText: { flex: 1, color: '#4B5B6D', fontSize: 12, lineHeight: 17 },
  tip: { padding: 11, borderRadius: 11 },
  tipLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8 },
  tipText: { color: '#4B5B6D', fontSize: 12, lineHeight: 17, marginTop: 2 },
  pressed: { opacity: 0.78 },
});
