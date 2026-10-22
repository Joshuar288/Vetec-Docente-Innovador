import { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { completeGoogleSignIn } from '../../utils/googleAuth';

export default function AuthCallback() {
  const { code, error } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('Verificando tu cuenta de Google…');
  useEffect(() => {
    let active = true;
    if (error || typeof code !== 'string') {
      setMessage('El acceso con Google no se completó. Vuelve a intentarlo desde tu cuenta.');
      return;
    }
    completeGoogleSignIn(code).then(() => {
      if (active) router.replace('/');
    }).catch(() => {
      if (active) setMessage('No se pudo verificar el acceso. Regresa e inicia sesión nuevamente.');
    });
    return () => { active = false; };
  }, [code, error, router]);
  return <View style={styles.container}>
    <Text accessibilityLiveRegion="polite" style={styles.text}>{message}</Text>
    <Link href="/" replace style={styles.link}>Continuar a AulaMix</Link>
  </View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 28, gap: 20, justifyContent: 'center', backgroundColor: '#F7FAFC' },
  text: { fontSize: 17, color: '#15324A', textAlign: 'center' },
  link: { fontSize: 16, color: '#1769AA', textAlign: 'center', padding: 12 },
});
