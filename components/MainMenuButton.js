import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TourTarget } from './GuidedTour';

export default function MainMenuButton({ accent = '#166534', soft = '#F0FDF4' }) {
  const router = useRouter();
  return (
    <TourTarget id="inicio" style={{ alignSelf: 'flex-start' }}>
      <Pressable
        onPress={() => router.replace('/')}
        accessibilityRole="button"
        accessibilityLabel="Volver al menú principal"
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: accent },
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.icon, { backgroundColor: soft }]}><Text style={[styles.arrow, { color: accent }]}>←</Text></View>
        <Text style={styles.text}>Volver al inicio</Text>
      </Pressable>
    </TourTarget>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    minWidth: 180,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 10,
    elevation: 3,
    boxShadow: '0px 3px 8px rgba(15, 23, 42, 0.16)',
  },
  icon: { width: 32, height: 32, borderRadius: 9, justifyContent: 'center', alignItems: 'center' },
  arrow: { fontSize: 24, lineHeight: 28, fontWeight: '800' },
  text: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
});
