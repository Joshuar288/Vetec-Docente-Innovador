import { View,Text,Button,StyleSheet} from "react-native";
import { StatusBar } from 'expo-status-bar';

export default function CuadradoPearson() {
    return (
        <View style={styles.container}>
            <Text style={{"fontSize": 30}}>
                Indique su ingrediente
            </Text>

            <StatusBar style="light" />
        </View>
        
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});