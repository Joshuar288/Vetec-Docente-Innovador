import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAccount } from '../components/AccountProvider';
import MainMenuButton from '../components/MainMenuButton';
import { listRecords, subscribeRecords, syncRecords } from '../utils/records';
import { printRecord } from '../utils/printRecord';

export default function Cuenta() {
  const { user, signOut } = useAccount();
  const [records, setRecords] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    let active = true;
    let revision = 0;
    const refresh = async () => {
      const current = ++revision;
      try {
        const items = await listRecords();
        if (active && current === revision) { setRecords(items); }
      } catch { if (active) setMessage('No se pudo leer el almacenamiento del dispositivo.'); }
    };
    setSelected(null); setRecords([]); setMessage('');
    void refresh();
    const unsubscribe = subscribeRecords(refresh);
    return () => { active = false; unsubscribe(); };
  }, [user?.id]);
  const run = async (action) => {
    if (busy) return;
    setBusy(true); setMessage('');
    try { await action(); } catch (error) { setMessage(error.message || 'No se pudo completar. Inténtalo nuevamente.'); }
    finally { setBusy(false); }
  };
  const button = (label, action, disabled = false) => <Pressable accessibilityRole="button" disabled={busy || disabled} onPress={() => run(action)} style={[s.button, (busy || disabled) && { opacity: 0.5 }]}><Text style={s.buttonText}>{label}</Text></Pressable>;
  return <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">
    <MainMenuButton accent="#1769AA" soft="#EAF3FB" />
    <Text style={s.title}>Mi cuenta e historial</Text>
    <Text style={s.text}>Guarda en el dispositivo sin conexión. Con una cuenta, tus registros se copian en línea y puedes consultarlos desde la web o al reinstalar.</Text>
    {user && <Text style={s.note}>Antes de desinstalar, comprueba que tus registros indiquen “En línea”. Los registros pendientes solo están en este dispositivo.</Text>}
    {user ? <View style={s.card}>
      <Text style={s.heading}>{user.user_metadata.app_name}</Text>
      <Text style={s.text}>{user.email}</Text>
      {button('Sincronizar ahora', async () => { const result = await syncRecords(); setMessage(result.error || 'Sincronización completada.'); })}
      {button('Cerrar sesión', signOut)}
    </View> : <View style={s.card}>
      <Text style={s.heading}>Estás usando AulaMix como invitado</Text>
      <Text style={s.text}>Tu actividad no se guarda. Al iniciar sesión comenzarás con los datos de tu cuenta.</Text>
      <Link href="/login" style={s.link}>Iniciar sesión o crear una cuenta</Link>
      {button('Salir del modo invitado', signOut)}
    </View>}
    {!!message && <Text accessibilityLiveRegion="polite" style={s.note}>{message}</Text>}
    <Text style={s.heading}>Registros guardados ({records.filter((r) => r.userId === (user?.id || null)).length})</Text>
    {records.length === 0 && <Text style={s.text}>Todavía no tienes registros guardados en esta cuenta.</Text>}
    {records.filter((r) => r.userId === (user?.id || null)).map((r) => <Pressable accessibilityRole="button" key={r.id} onPress={() => setSelected(selected?.id === r.id ? null : r)} style={s.card}>
      <Text style={s.heading}>{r.payload.title}</Text><Text style={s.text}>{r.payload.subtitle}</Text>
      <Text style={s.text}>{new Date(r.createdAt).toLocaleString('es-NI')}</Text>
      <Text style={s.link}>{r.synced ? 'En línea' : user ? 'Guardado local · pendiente de sincronizar' : 'Guardado local · sin cuenta'}</Text>
      {selected?.id === r.id && <View style={{ gap: 8 }}>
        {[...(r.payload.rows || []), ...(r.payload.results || [])].map((row, i) => <Text key={i} style={s.text}>{row.label}: {row.value}</Text>)}
        {r.payload.table && <ScrollView horizontal><View><Text style={s.heading}>{r.payload.table.title}</Text><Text style={s.text}>{r.payload.table.headers.join(' | ')}</Text>{r.payload.table.rows.map((row, i) => <Text key={i} style={s.text}>{row.join(' | ')}</Text>)}</View></ScrollView>}
        {button('Imprimir registro', () => printRecord(r.payload))}
      </View>}
    </Pressable>)}
  </ScrollView>;
}
const s = StyleSheet.create({
  container: { flexGrow: 1, padding: 22, gap: 16, width: '100%', maxWidth: 800, alignSelf: 'center', backgroundColor: '#F7FAFC' },
  title: { fontSize: 27, fontWeight: '800', color: '#15324A' },
  heading: { fontSize: 17, fontWeight: '700', color: '#15324A' },
  text: { fontSize: 14, lineHeight: 21, color: '#475569' },
  note: { padding: 12, backgroundColor: '#FFF4D6', color: '#704B00', borderRadius: 10, lineHeight: 21 },
  card: { padding: 16, gap: 12, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1' },
  input: { borderWidth: 1, borderColor: '#94A3B8', borderRadius: 10, padding: 12, color: '#15324A' },
  button: { backgroundColor: '#1769AA', padding: 13, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
  link: { color: '#1769AA', fontWeight: '700', paddingVertical: 5 },
});
