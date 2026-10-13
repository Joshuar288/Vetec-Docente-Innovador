import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function MainMenuButton({ accent = '#166534', soft = '#F0FDF4' }) {
  return (
    <Link href="/" replace asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Volver al menú principal"
        style={({ pressed }) => [
          styles.button,
          { borderColor: accent, backgroundColor: soft },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.arrow, { color: accent }]}>←</Text>
        <Text style={[styles.text, { color: accent }]}>Menú principal</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 42,
    paddingHorizontal: 13,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    gap: 7,
  },
  arrow: { fontSize: 20, lineHeight: 21, fontWeight: '700' },
  text: { fontSize: 13, fontWeight: '800' },
  pressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
});
