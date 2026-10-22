import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { cloud } from './cloud';

let exchange = null;
let exchangedCode = null;

export function googleRedirectUri() {
  if (Platform.OS === 'web') return `${window.location.origin}/auth/callback`;
  return makeRedirectUri({ scheme: 'mi-vetec', path: 'auth/callback' });
}

export function completeGoogleSignIn(code) {
  if (!cloud) return Promise.reject(new Error('Primero configura Supabase.'));
  if (typeof code !== 'string' || !code) return Promise.reject(new Error('Google no devolvió un código de acceso válido.'));
  // The browser result and the deep link can arrive together. Exchange only once.
  if (code === exchangedCode) return exchange;
  exchangedCode = code;
  exchange = cloud.auth.exchangeCodeForSession(code).then(({ data, error }) => {
    if (error) throw error;
    if (!data.session?.user?.id) throw new Error('No se pudo verificar la cuenta. Vuelve a iniciar sesión.');
    return data.session.user;
  });
  return exchange;
}

export async function continueWithGoogle() {
  if (!cloud) throw new Error('Primero configura Supabase.');
  if (Platform.OS !== 'web' && Constants.appOwnership === 'expo') {
    throw new Error('Para acceder con Google usa una compilación de desarrollo o la app instalada; Expo Go no admite este retorno.');
  }
  const redirectTo = googleRedirectUri();
  const { data, error } = await cloud.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true, queryParams: { prompt: 'select_account' } },
  });
  if (error) throw error;
  if (!data.url) throw new Error('No se pudo abrir el acceso con Google.');
  if (Platform.OS === 'web') {
    window.location.assign(data.url);
    return;
  }
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') return { cancelled: true };
  const callback = new URL(result.url);
  if (callback.protocol !== 'mi-vetec:' || `${callback.host}${callback.pathname}` !== 'auth/callback') {
    throw new Error('El retorno de Google no corresponde a esta aplicación.');
  }
  if (callback.searchParams.has('error')) throw new Error('No se autorizó el acceso con Google. Inténtalo nuevamente.');
  await completeGoogleSignIn(callback.searchParams.get('code'));
  return { cancelled: false };
}
