import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAccount } from '../components/AccountProvider';
import { cloud } from '../utils/cloud';
import { continueWithGoogle } from '../utils/googleAuth';
import { normalizeName, validName } from '../utils/accountAccess';
import { authStyles as s } from '../components/authStyles';

export default function Login() {
  const { startGuest } = useAccount();
  const router = useRouter();
  const [signup, setSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const run = async (action) => {
    if (busy) return;
    setBusy(true); setMessage('');
    try { await action(); } catch (error) { setMessage(error.message || 'No se pudo acceder. Inténtalo nuevamente.'); }
    finally { setBusy(false); }
  };
  const authenticate = async () => {
    if (!cloud) throw new Error('El acceso a cuentas no está configurado todavía.');
    if (!email.trim() || password.length < 6) throw new Error('Escribe un correo y una contraseña de al menos 6 caracteres.');
    if (signup && !validName(name)) throw new Error('Escribe tu nombre, de 2 a 80 caracteres.');
    const credentials = { email: email.trim().toLowerCase(), password };
    const { data, error } = signup
      ? await cloud.auth.signUp({ ...credentials, options: { data: { app_name: normalizeName(name) } } })
      : await cloud.auth.signInWithPassword(credentials);
    if (error) throw error;
    setPassword('');
    if (!data.session) setMessage('Revisa tu correo para confirmar la cuenta. Después vuelve a iniciar sesión.');
  };
  return <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
    <View style={s.card}>
      <Image source={require('../assets/LogoAulaMix.png')} style={s.logo} />
      <Text style={s.title}>Bienvenido a AulaMix</Text>
      <Text style={s.text}>Accede para guardar automáticamente tus cálculos y consultarlos desde cualquier dispositivo.</Text>
      <Pressable accessibilityRole="button" disabled={busy || !cloud} onPress={() => run(async () => { const result = await continueWithGoogle(); if (result?.cancelled) setMessage('Acceso cancelado. Puedes intentarlo de nuevo.'); })} style={[s.google, busy && s.disabled]}><Text style={s.googleText}>Continuar con Google</Text></Pressable>
      <Text style={s.heading}>{signup ? 'Crear cuenta con correo' : 'Iniciar sesión con correo'}</Text>
      {signup && <TextInput accessibilityLabel="Nombre" placeholder="Tu nombre" value={name} onChangeText={setName} maxLength={80} autoComplete="name" style={s.input} editable={!busy} />}
      <TextInput accessibilityLabel="Correo electrónico" placeholder="Correo electrónico" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" style={s.input} editable={!busy} />
      <TextInput accessibilityLabel="Contraseña" placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry autoComplete={signup ? 'new-password' : 'current-password'} style={s.input} editable={!busy} />
      <Pressable accessibilityRole="button" disabled={busy || !cloud} onPress={() => run(authenticate)} style={[s.button, busy && s.disabled]}><Text style={s.buttonText}>{busy ? 'Procesando…' : signup ? 'Crear cuenta' : 'Iniciar sesión'}</Text></Pressable>
      <Pressable accessibilityRole="button" disabled={busy} onPress={() => { setSignup(!signup); setMessage(''); }}><Text style={s.link}>{signup ? 'Ya tengo cuenta. Iniciar sesión' : 'No tengo cuenta. Registrarme'}</Text></Pressable>
      {!!message && <Text accessibilityLiveRegion="polite" style={s.message}>{message}</Text>}
      {!cloud && <Text style={s.message}>El acceso a cuentas aún no está configurado. Puedes entrar como invitado.</Text>}
      <View style={s.divider} />
      <Pressable accessibilityRole="button" disabled={busy} onPress={() => { startGuest(); router.replace('/'); }} style={s.google}><Text style={s.googleText}>Empezar como invitado</Text></Pressable>
      <Text style={s.text}>Como invitado puedes usar las herramientas. Tu actividad no se guarda en el dispositivo ni en línea.</Text>
    </View>
  </ScrollView>;
}

