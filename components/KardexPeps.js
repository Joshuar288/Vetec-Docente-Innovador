import { TourScope, TourTarget, TourPreview } from './GuidedTour';
import ToolWorkspace from './ToolWorkspace';
import HelpDialog from './HelpDialog';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import InteractionCoach from './InteractionCoach';
import RecordActions from './RecordActions';
import { saveAndPrintRecord } from '../utils/saveAndPrintRecord';

const PINK = '#D62476';
const DARK = '#94154E';
const SOFT = '#FDECF4';
const money = (value) => `C$ ${Number(value || 0).toFixed(2)}`;
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export default function KardexPeps({ onStockWarning, method = 'peps' }) {
  const isUeps = method === 'ueps';
  const methodName = isUeps ? 'UEPS' : 'PEPS';
  const compact = useWindowDimensions().width < 620;
  const [producto, setProducto] = useState('');
  const [codigo, setCodigo] = useState('');
  const [unidad, setUnidad] = useState('unidad');
  const [tipo, setTipo] = useState('entrada');
  const [fecha, setFecha] = useState(today());
  const [detalle, setDetalle] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [costo, setCosto] = useState('');
  const [capas, setCapas] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [coach, setCoach] = useState({ label: `${methodName} · PRIMER PASO`, message: `Registra el inventario inicial. ${methodName} conservará este lote para aplicar el orden de salida correspondiente cuando ocurra una venta.` });
  const initialized = movimientos.length > 0;
  const saldo = useMemo(() => ({
    cantidad: capas.reduce((sum, layer) => sum + layer.cantidad, 0),
    valor: capas.reduce((sum, layer) => sum + layer.cantidad * layer.costo, 0),
  }), [capas]);

  const decimal = (text, setter) => {
    const normalized = text.replace(',', '.').replace(/[^0-9.]/g, '');
    const parts = normalized.split('.');
    setter(parts.length > 1 ? `${parts.shift()}.${parts.join('')}` : normalized);
  };

  const selectType = (value) => {
    setTipo(value); setCosto('');
    setCoach(value === 'entrada'
      ? { label: `${methodName} · NUEVA ENTRADA`, message: 'Esta compra formará un lote nuevo y se conservará separada de los anteriores. Escribe cantidad y costo unitario.' }
      : { label: `${methodName} · SALIDA O VENTA`, message: `Escribe la cantidad vendida. ${methodName} tomará primero las unidades del lote ${isUeps ? 'más reciente' : 'más antiguo'} y mostrará qué capas permanecen.` });
  };

  const register = () => {
    const qty = Number(cantidad);
    const unitCost = Number(costo);
    if (!producto.trim() || !codigo.trim() || !unidad.trim()) return Alert.alert('Completa el producto', 'Escribe nombre, código y unidad de medida.');
    if (!fecha.trim() || !detalle.trim() || qty <= 0) return Alert.alert('Movimiento incompleto', 'Escribe fecha, detalle y una cantidad mayor que cero.');
    if (tipo === 'entrada' && unitCost <= 0) return Alert.alert('Falta el costo', 'La entrada necesita un costo unitario mayor que cero.');
    if (tipo === 'salida' && qty > saldo.cantidad) {
      onStockWarning({ requested: qty, available: saldo.cantidad, unit: unidad });
      return;
    }

    let nextLayers;
    let movementValue;
    if (tipo === 'entrada') {
      movementValue = qty * unitCost;
      nextLayers = [...capas, { id: `${Date.now()}-layer`, fecha, cantidad: qty, costo: unitCost }];
    } else {
      let remaining = qty;
      movementValue = 0;
      nextLayers = capas.map((layer) => ({ ...layer }));
      const consumptionOrder = isUeps ? [...nextLayers].reverse() : nextLayers;
      for (const layer of consumptionOrder) {
        if (remaining <= 0) break;
        const taken = Math.min(layer.cantidad, remaining);
        layer.cantidad -= taken;
        movementValue += taken * layer.costo;
        remaining -= taken;
      }
      nextLayers = nextLayers.filter((layer) => layer.cantidad > 0.000001);
    }
    const nextQty = nextLayers.reduce((sum, layer) => sum + layer.cantidad, 0);
    const nextValue = nextLayers.reduce((sum, layer) => sum + layer.cantidad * layer.costo, 0);
    setCapas(nextLayers);
    setMovimientos((current) => [...current, {
      id: `${Date.now()}-${current.length}`, isInitial: current.length === 0, fecha, detalle, tipo,
      cantidad: qty, costoUnitario: tipo === 'entrada' ? unitCost : movementValue / qty,
      valorMovimiento: movementValue, saldoCantidad: nextQty, saldoValor: nextValue,
    }]);
    setDetalle(''); setCantidad(''); setCosto('');
    setCoach({ label: tipo === 'entrada' ? 'LOTE AGREGADO' : `SALIDA APLICADA CON ${methodName}`, message: `Quedan ${nextQty.toFixed(2)} ${unidad}, distribuidas en ${nextLayers.length} lote${nextLayers.length === 1 ? '' : 's'}.` });
  };

  const clear = () => {
    setProducto(''); setCodigo(''); setUnidad('unidad'); setTipo('entrada'); setFecha(today()); setDetalle(''); setCantidad(''); setCosto(''); setCapas([]); setMovimientos([]);
    setCoach({ label: `TARJETA ${methodName} LIMPIA`, message: 'Registra un nuevo inventario inicial para comenzar.' });
  };

  const record = movimientos.length > 0 ? {
        title: `Tarjeta Kardex · ${methodName}`, subtitle: `${producto} (${codigo})`,
        rows: [{ label: 'Producto', value: producto }, { label: 'Código', value: codigo }, { label: 'Unidad', value: unidad }, { label: 'Método', value: methodName }],
        table: { title: 'Movimientos', headers: ['Fecha', 'Detalle', 'Tipo', 'Cantidad', 'Costo aplicado', 'Valor', 'Existencia', 'Saldo'], rows: movimientos.map((item) => [item.fecha, item.detalle, item.isInitial ? 'Inicial' : item.tipo === 'entrada' ? 'Entrada' : 'Salida', item.cantidad.toFixed(2), money(item.costoUnitario), money(item.valorMovimiento), item.saldoCantidad.toFixed(2), money(item.saldoValor)]) },
        results: [{ label: 'Existencia final', value: `${saldo.cantidad.toFixed(2)} ${unidad}` }, { label: 'Valor final', value: money(saldo.valor) }, { label: 'Lotes restantes', value: String(capas.length) }],
      } : null;
  const print = async (options) => {
    if (record) await saveAndPrintRecord(record, options);
  };

  return <TourScope prefix={method}><View style={s.content}>
    <InteractionCoach cue={coach} accent={PINK} soft={SOFT} />
    <TourPreview values={{ producto, codigo, unidad, tipo, fecha, detalle, cantidad, costo, capas, movimientos, saldo, initialized }}>{({ producto, codigo, unidad, tipo, fecha, detalle, cantidad, costo, capas, movimientos, saldo, initialized }) => <ToolWorkspace input={<>
<TourTarget id="producto"><Card title="1 · Identificación del producto">
      <View style={[s.row, compact && s.column]}><Field label="Producto" value={producto} onChangeText={setProducto} placeholder="Ej. Cuaderno" /><Field label="Código" value={codigo} onChangeText={setCodigo} placeholder="PROD-001" /><Field label="Unidad" value={unidad} onChangeText={setUnidad} /></View>
    </Card></TourTarget>
    <TourTarget id="movimiento"><Card title={`2 · Nuevo movimiento ${methodName}`}>
      {initialized && <View style={s.switch}><TypeButton label="Entrada" active={tipo === 'entrada'} onPress={() => selectType('entrada')} /><TypeButton label="Salida / venta" active={tipo === 'salida'} onPress={() => selectType('salida')} /></View>}
      <PepsGuide initial={!initialized} type={tipo} isUeps={isUeps} />
      <View style={[s.row, compact && s.column]}><Field label="Fecha" value={fecha} onChangeText={setFecha} /><Field label="Detalle" value={detalle} onChangeText={setDetalle} placeholder={!initialized ? 'Inventario inicial' : tipo === 'entrada' ? 'Compra' : 'Venta'} /></View>
      <View style={[s.row, compact && s.column]}><Field label="Cantidad" value={cantidad} onChangeText={(text) => decimal(text, setCantidad)} numeric />{tipo === 'entrada' ? <Field label="Costo unitario (C$)" value={costo} onChangeText={(text) => decimal(text, setCosto)} numeric /> : <View style={s.auto}><Text style={s.label}>Costo de salida</Text><Text style={s.autoValue}>Se toma de los lotes más {isUeps ? 'recientes' : 'antiguos'}</Text></View>}</View>

    </Card></TourTarget>
</>} output={<>
<TourTarget id="resumen"><View style={[s.summary, compact && s.column]}><Summary label="Existencia" value={`${saldo.cantidad.toFixed(2)} ${unidad}`} /><Summary label="Valor" value={money(saldo.valor)} /><Summary label="Capas disponibles" value={String(capas.length)} /></View></TourTarget>
    <Card title={`3 · Capas de inventario (primero sale la más ${isUeps ? 'reciente' : 'antigua'})`}>
      {capas.length ? (isUeps ? [...capas].reverse() : capas).map((layer, index) => <View key={layer.id} style={s.layer}><View style={s.layerNumber}><Text style={s.layerNumberText}>{index + 1}</Text></View><View style={s.layerCopy}><Text style={s.layerTitle}>Lote del {layer.fecha}</Text><Text style={s.layerText}>{layer.cantidad.toFixed(2)} {unidad} × {money(layer.costo)}</Text></View><Text style={s.layerValue}>{money(layer.cantidad * layer.costo)}</Text></View>) : <Text style={s.empty}>No hay capas disponibles.</Text>}
    </Card>
    <TourTarget id="tabla"><Card title="4 · Registro de movimientos">
      {movimientos.length ? <ScrollView horizontal><View style={s.table}><Table values={['Fecha', 'Detalle', 'Tipo', 'Cantidad', 'C. aplicado', 'Valor', 'Existencia', 'Saldo']} header />{movimientos.map((item) => <Table key={item.id} values={[item.fecha, item.detalle, item.isInitial ? 'Inicial' : item.tipo === 'entrada' ? 'Entrada' : 'Salida', item.cantidad.toFixed(2), money(item.costoUnitario), money(item.valorMovimiento), item.saldoCantidad.toFixed(2), money(item.saldoValor)]} />)}</View></ScrollView> : <Text style={s.empty}>Registra el inventario inicial para crear la primera capa.</Text>}
    </Card></TourTarget>
</>} actions={<>
<TourTarget id="registrar"><Pressable onPress={register} style={({ pressed }) => [s.add, tipo === 'salida' && s.exit, pressed && s.pressed]}><Text style={s.addText}>{!initialized ? '+ Registrar inventario inicial' : tipo === 'entrada' ? '+ Registrar entrada' : `− Registrar salida ${methodName}`}</Text></Pressable></TourTarget>
<RecordActions record={record} onClear={clear} onPrint={print} canPrint={!!record} accent={PINK} />
</>} />
  }</TourPreview>
  </View></TourScope>;
}

function Card({ title, children }) { return <View style={s.card}><Text style={s.cardTitle}>{title}</Text>{children}</View>; }
function Field({ label, numeric, ...props }) { return <View style={s.field}><Text style={s.label}>{label}</Text><TextInput {...props} keyboardType={numeric ? 'decimal-pad' : 'default'} placeholderTextColor="#9CA3AF" style={s.input} /></View>; }
function TypeButton({ label, active, onPress }) { return <Pressable onPress={onPress} style={[s.typeButton, active && s.typeActive]}><Text style={[s.typeText, active && s.typeTextActive]}>{label}</Text></Pressable>; }
function Summary({ label, value }) { return <View style={s.summaryCard}><Text style={s.summaryLabel}>{label}</Text><Text style={s.summaryValue}>{value}</Text></View>; }
function Table({ values, header }) { return <View style={[s.tableRow, header && s.tableHeader]}>{values.map((value, i) => <Text key={`${i}-${value}`} style={[s.cell, header && s.headerCell]}>{value}</Text>)}</View>; }
function PepsGuide({ initial, type, isUeps }) {
  const methodName = isUeps ? 'UEPS' : 'PEPS';
  const text = initial ? 'Crea la primera capa con las unidades que ya tienes y su costo.' : type === 'entrada' ? 'La compra crea una capa nueva y conserva su propio costo.' : `La venta consume primero la capa más ${isUeps ? 'reciente' : 'antigua'}; si no alcanza, continúa con la siguiente.`;
  return <HelpDialog tourStep="movimiento" label="Cómo registrar" title={initial ? 'Inventario inicial' : type === 'entrada' ? `Entrada ${methodName}` : `Salida ${methodName}`} accent={DARK} soft={SOFT}><Text style={s.guideText}>{text}</Text></HelpDialog>;
}

const s = StyleSheet.create({
  content: { width: '100%', gap: 14 }, card: { padding: 16, borderWidth: 1, borderColor: '#F1B8D2', borderRadius: 17, backgroundColor: '#FFF', gap: 12, elevation: 3 }, cardTitle: { color: '#2D3047', fontSize: 16, fontWeight: '900' }, row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 }, column: { flexDirection: 'column' }, field: { flex: 1, minWidth: 140, gap: 5 }, label: { color: '#4B5563', fontSize: 11, fontWeight: '800' }, input: { minHeight: 48, paddingHorizontal: 12, borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 10, color: '#172033', backgroundColor: '#FAFAFB' }, switch: { flexDirection: 'row', padding: 4, borderRadius: 11, backgroundColor: SOFT }, typeButton: { minHeight: 39, flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 }, typeActive: { backgroundColor: PINK }, typeText: { color: DARK, fontWeight: '800' }, typeTextActive: { color: '#FFF' }, guide: { padding: 12, borderLeftWidth: 4, borderLeftColor: PINK, borderRadius: 10, backgroundColor: '#FFF7FB' }, guideTitle: { color: DARK, fontSize: 12, fontWeight: '900' }, guideText: { color: '#5F6472', fontSize: 12, lineHeight: 17, marginTop: 3 }, auto: { minHeight: 70, flex: 1, padding: 10, justifyContent: 'center', borderRadius: 10, backgroundColor: SOFT }, autoValue: { color: DARK, fontSize: 13, fontWeight: '800', marginTop: 4 }, add: { minHeight: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: PINK }, exit: { backgroundColor: '#7C3AED' }, addText: { color: '#FFF', fontWeight: '900' }, pressed: { opacity: .78 }, summary: { flexDirection: 'row', gap: 10 }, summaryCard: { minHeight: 80, flex: 1, padding: 13, justifyContent: 'center', borderRadius: 14, backgroundColor: SOFT }, summaryLabel: { color: '#805268', fontSize: 11 }, summaryValue: { color: DARK, fontSize: 18, fontWeight: '900', marginTop: 3 }, layer: { minHeight: 62, padding: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F1B8D2', borderRadius: 11 }, layerNumber: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: PINK }, layerNumberText: { color: '#FFF', fontWeight: '900' }, layerCopy: { flex: 1, marginLeft: 10 }, layerTitle: { color: '#2D3047', fontSize: 12, fontWeight: '800' }, layerText: { color: '#697386', fontSize: 11, marginTop: 2 }, layerValue: { color: DARK, fontSize: 12, fontWeight: '900' }, empty: { padding: 18, color: '#7B6873', fontSize: 12, textAlign: 'center' }, table: { minWidth: 920, borderWidth: 1, borderColor: '#E5E7EB' }, tableRow: { minHeight: 46, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }, tableHeader: { backgroundColor: DARK }, cell: { width: 114, paddingHorizontal: 6, color: '#374151', fontSize: 10, textAlign: 'center' }, headerCell: { color: '#FFF', fontWeight: '900' },
});
