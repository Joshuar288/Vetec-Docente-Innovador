import { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as Network from 'expo-network';
import { cloud } from '../utils/cloud';
import { setRecordOwner, syncRecords } from '../utils/records';
import { hasCompletedProfile } from '../utils/accountAccess';

const AccountContext = createContext({ user: null, ready: false });
export const useAccount = () => useContext(AccountContext);
export default function AccountProvider({ children }) {
  const [account, setAccount] = useState({ user: null, ready: !cloud });
  const [guest, setGuest] = useState(false);
  useEffect(() => {
    const update = (session) => {
      if (session?.user) setGuest(false);
      setRecordOwner(session?.user.id);
      setAccount({ user: session?.user || null, ready: true });
      // Defer database work until the auth callback releases its lock.
      setTimeout(() => { void syncRecords(); }, 0);
    };
    const auth = cloud?.auth.onAuthStateChange((_event, session) => update(session));
    const network = Network.addNetworkStateListener((state) => {
      if (state.isConnected && state.isInternetReachable !== false) void syncRecords();
    });
    const app = AppState.addEventListener('change', (state) => {
      if (state === 'active') { cloud?.auth.startAutoRefresh(); void syncRecords(); }
      else cloud?.auth.stopAutoRefresh();
    });
    const timer = setInterval(() => { if (AppState.currentState === 'active') void syncRecords(); }, 30000);
    return () => { auth?.data.subscription.unsubscribe(); network.remove(); app.remove(); clearInterval(timer); };
  }, []);
  const startGuest = () => { if (!account.user) { setRecordOwner(null); setGuest(true); } };
  const signOut = async () => {
    if (cloud && account.user) {
      const { error } = await cloud.auth.signOut({ scope: 'local' });
      if (error) throw error;
    }
    setGuest(false);
  };
  return <AccountContext.Provider value={{ ...account, guest, startGuest, signOut, profileComplete: hasCompletedProfile(account.user) }}>{children}</AccountContext.Provider>;
}
