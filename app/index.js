import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenidos a AulaMix</Text>

      <Image 
        source={require('../assets/LogoAulaMix.png')} 
        style={styles.logo} 
      />

      {/* Botón 1: Calculadora de dosis */}
      <Link href="/(tabs)/Caldosis" asChild>
        <Pressable style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>Ir a la calculadora de dosis</Text>
        </Pressable>
      </Link>

      {/* Botón 2: Cuadro de Pearson */}
      <Link href="/(tabs)/Cuadropearson" asChild>
        <Pressable style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>Ir al cuadro de Pearson</Text>
        </Pressable>
      </Link>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF5F2', // Fondo suave acorde a la paleta
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E6B47',
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 40,
    resizeMode: 'contain',
  },
  /* Botón Principal (Verde Solido) */
  btnPrimary: {
    backgroundColor: '#2D8C61',
    width: '100%',
    maxWidth: 320,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    // Sombras para Android, iOS y Web
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.08)',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  /* Botón Secundario (Borde y fondo claro) */
  btnSecondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2D8C61',
    width: '100%',
    maxWidth: 320,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
  },
  btnSecondaryText: {
    color: '#2D8C61',
    fontSize: 16,
    fontWeight: 'bold',
  },
});