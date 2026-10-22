import { StyleSheet } from 'react-native';
export const authStyles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F0F6FA', justifyContent: 'center', padding: 22 },
  card: { width: '100%', maxWidth: 460, alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 22, padding: 24, gap: 15 },
  logo: { height: 85, width: 85, alignSelf: 'center', resizeMode: 'contain' },
  title: { fontSize: 27, fontWeight: '800', color: '#15324A', textAlign: 'center' },
  heading: { fontSize: 17, fontWeight: '700', color: '#15324A' },
  text: { fontSize: 14, color: '#52697B', lineHeight: 21, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#A6BAC9', padding: 14, borderRadius: 10, color: '#15324A', fontSize: 16 },
  button: { padding: 15, backgroundColor: '#1769AA', borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  google: { padding: 15, borderWidth: 1, borderColor: '#A6BAC9', borderRadius: 10, alignItems: 'center' },
  googleText: { fontWeight: '700', color: '#15324A', fontSize: 16 },
  link: { textAlign: 'center', color: '#1769AA', fontWeight: '700', padding: 8 },
  message: { color: '#754D00', backgroundColor: '#FFF4D6', padding: 12, borderRadius: 10, lineHeight: 20 },
  divider: { height: 1, backgroundColor: '#DBE5ED', marginVertical: 3 },
  disabled: { opacity: 0.5 },
});
