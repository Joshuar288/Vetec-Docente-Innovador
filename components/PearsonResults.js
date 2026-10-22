import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TourTarget } from './GuidedTour';

export default function PearsonResults({ proteico, nutreico, valDeseado, parteProteico, parteNutreico,
  proporcionProteico, proporcionNutreico, ingredienteProteico, ingredienteNutreico, librasProteico, librasNutreico, hideAnswer = false }) {
  const [width, setWidth] = useState(320);
  const span = Math.max(1, width - 88);
  const length = Math.sqrt(span * span + 130 * 130);
  const angle = Math.atan2(130, span) * 180 / Math.PI;
  const line = { width: length, left: (width - length) / 2 };
  const sources = [
    { name: ingredienteProteico, amount: proporcionProteico, protein: librasProteico },
    { name: ingredienteNutreico, amount: proporcionNutreico, protein: librasNutreico },
  ];
  return <>
    <TourTarget id="cuadrado" style={s.card}>
      <Text style={s.eyebrow}>VISUALIZACIÓN EN TIEMPO REAL</Text>
      <Text style={s.title}>Cuadrado de Pearson</Text>
      <Text style={s.hint}>Las diferencias diagonales indican las partes de cada ingrediente.</Text>
      <View style={s.headings}><Text style={s.label}>Proteína bruta</Text><Text style={s.label}>Partes</Text></View>
      <View style={s.diagram} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        <View style={[s.line, line, { transform: [{ rotate: `${angle}deg` }] }]} />
        <View style={[s.line, line, { transform: [{ rotate: `${-angle}deg` }] }]} />
        <View style={[s.node, s.topLeft]}><Text style={s.number}>{proteico}%</Text><Text style={s.caption}>Proteica</Text></View>
        <View style={[s.node, s.bottomLeft]}><Text style={s.number}>{nutreico}%</Text><Text style={s.caption}>Energética</Text></View>
        <View style={[s.center, { left: (width - 84) / 2 }]}><Text style={s.caption}>Deseada</Text><Text style={s.number}>{valDeseado || 0}%</Text></View>
        <View style={[s.node, s.topRight]}><Text style={s.number}>{parteProteico || '0.00'}</Text><Text style={s.caption}>partes proteicas</Text></View>
        <View style={[s.node, s.bottomRight]}><Text style={s.number}>{parteNutreico || '0.00'}</Text><Text style={s.caption}>partes energéticas</Text></View>
      </View>
      <View style={s.proportions}><Text style={s.proportion}>Proteica: {proporcionProteico}%</Text><Text style={s.proportion}>Energética: {proporcionNutreico}%</Text></View>
    </TourTarget>
    <TourTarget id="resultados" style={s.card}>
      <Text style={s.title}>Resultados por cada 100 lb</Text>
      <View style={s.sources}>{sources.map((source, index) => <View key={index} style={s.source}>
        <Text style={s.sourceType}>{index === 0 ? 'FUENTE PROTEICA' : 'FUENTE ENERGÉTICA'}</Text>
        <Text style={s.sourceName}>{source.name}</Text>
        <Text style={s.amount}>{source.amount} <Text style={s.unit}>lb</Text></Text>
        <Text style={s.hint}>Aporte: {source.protein}% de proteína</Text>
      </View>)}</View>
      <View style={s.total}><Text style={s.totalText}>Proteína total de la mezcla</Text><Text style={s.totalValue}>{hideAnswer ? '—' : `${(Number(librasProteico) + Number(librasNutreico)).toFixed(2)}%`}</Text></View>
    </TourTarget>
  </>;
}
const s = StyleSheet.create({
  card: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#BBE2C7', gap: 12 },
  eyebrow: { color: '#238347', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#14532D', fontSize: 21, fontWeight: '800' },
  hint: { color: '#64756B', fontSize: 12, lineHeight: 18 },
  headings: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  label: { color: '#4B6555', fontWeight: '700', fontSize: 12 },
  diagram: { height: 220, position: 'relative', overflow: 'hidden' },
  line: { position: 'absolute', height: 2, top: 109, backgroundColor: '#6BC48A' },
  node: { position: 'absolute', width: 88, height: 58, borderRadius: 12, backgroundColor: '#EFFAF2', borderWidth: 1, borderColor: '#A9DDBC', alignItems: 'center', justifyContent: 'center', padding: 3 },
  topLeft: { left: 0, top: 16 }, bottomLeft: { left: 0, bottom: 16 },
  topRight: { right: 0, top: 16 }, bottomRight: { right: 0, bottom: 16 },
  center: { position: 'absolute', top: 68, width: 84, height: 84, borderRadius: 42, backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: '#166534', alignItems: 'center', justifyContent: 'center' },
  number: { color: '#14532D', fontSize: 20, fontWeight: '800' },
  caption: { color: '#52735D', fontSize: 10, textAlign: 'center' },
  proportions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  proportion: { flexGrow: 1, color: '#166534', backgroundColor: '#EAF7EE', borderRadius: 9, padding: 12, fontWeight: '700', fontSize: 13 },
  sources: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  source: { flexGrow: 1, flexBasis: 180, minWidth: 0, padding: 14, backgroundColor: '#F5FAF7', borderRadius: 12, gap: 8 },
  sourceType: { fontSize: 10, color: '#52735D', fontWeight: '800', letterSpacing: 0.5 },
  sourceName: { color: '#304C3B', fontSize: 13, fontWeight: '600' },
  amount: { color: '#166534', fontSize: 29, fontWeight: '800' }, unit: { fontSize: 16 },
  total: { backgroundColor: '#166534', borderRadius: 10, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  totalText: { flex: 1, color: '#E1F4E7', fontSize: 13 }, totalValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
});
