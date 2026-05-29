import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{"margin": 30, "textAlign":"center", "fontSize": 30}}>
        Bienvenidos a VETEC
        </Text>

        <Link href="/(tabs)/Caldosis" style={{ "marginTop": 20, "color": 'blue' }}>
        Comenzar a navegar
      </Link>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
