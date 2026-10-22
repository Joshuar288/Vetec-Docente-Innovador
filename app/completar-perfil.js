import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useAccount } from '../components/AccountProvider';
import { cloud } from '../utils/cloud';
import { normalizeName, validName } from '../utils/accountAccess';
import { authStyles as s } from '../components/authStyles';

export default function CompletarPerfil() {
  const { user, signOut } = useAccount();
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const run = async (action) => {
    setBusy(true); setMessage('');
    try { await action(); } catch (error) { setMessage(error.message || 'No se pudo guardar el nombre.'); }
    finally { setBusy(false); }
  };
  return <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled"><View style={s.card}>
    <Text style={s.title}>Completa tu nombre</Text>
    <Text style={s.text}>Confirma cómo te llamas para continuar a AulaMix.</Text>
    <Text style={s.text}>{user?.email}</Text>
    <TextInput accessibilityLabel="Nombre" placeholder="Tu nombre" value={name} onChangeText={setName} maxLength={80} autoComplete="name" style={s.input} editable={!busy} />
    <Pressable accessibilityRole="button" disabled={busy} style={s.button} onPress={() => run(async () => {
      if (!validName(name)) throw new Error('Escribe tu nombre, de 2 a 80 caracteres.');
      const { error } = await cloud.auth.updateUser({ data: { app_name: normalizeName(name) } });
      if (error) throw error;
    })}><Text style={s.buttonText}>{busy ? 'Guardando…' : 'Guardar nombre y continuar'}</Text></Pressable>
    {!!message && <Text accessibilityLiveRegion="polite" style={s.message}>{message}</Text>}
    <Pressable accessibilityRole="button" disabled={busy} onPress={() => run(signOut)}><Text style={s.link}>Cerrar sesión</Text></Pressable>
  </View></ScrollView>;
}
