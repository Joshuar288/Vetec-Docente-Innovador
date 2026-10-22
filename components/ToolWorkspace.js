import { StyleSheet, View, useWindowDimensions } from 'react-native';

export default function ToolWorkspace({ input, output, actions }) {
  const { width } = useWindowDimensions();
  const wide = width >= 860;
  return <View style={styles.workspace}>
    <View style={[styles.panels, wide && styles.panelsWide]}>
      <View style={[styles.input, wide && styles.inputWide]}>{input}</View>
      <View style={[styles.output, wide && styles.outputWide]}>{output}</View>
    </View>
    {!!actions && <View style={styles.actions}>{actions}</View>}
  </View>;
}
const styles = StyleSheet.create({
  workspace: { width: '100%', gap: 22 },
  panels: { width: '100%', gap: 22, alignItems: 'stretch' },
  panelsWide: { flexDirection: 'row', alignItems: 'flex-start' },
  input: { width: '100%', minWidth: 0, gap: 16 },
  inputWide: { width: undefined, flex: 1 },
  output: { width: '100%', minWidth: 0, gap: 16 },
  outputWide: { width: undefined, flex: 1.4 },
  actions: { width: '100%', maxWidth: 720, alignSelf: 'center', gap: 12 },
});
