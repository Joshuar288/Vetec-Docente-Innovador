import GuidedTour, { TourTarget, TourScrollView, TourPreview, TourScope } from '../../components/GuidedTour';
import { kardexTour } from '../../utils/toolTours';
import LearningGuide from '../../components/LearningGuide';
import { kardexLessons } from '../../utils/toolLessons';
import ToolWorkspace from '../../components/ToolWorkspace';
import HelpDialog from '../../components/HelpDialog';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { BlurTargetView, BlurView } from 'expo-blur';
import AnimatedLogoBackground from '../../components/AnimatedLogoBackground';
import ToolGuide from '../../components/ToolGuide';
import InteractionCoach from '../../components/InteractionCoach';
import MainMenuButton from '../../components/MainMenuButton';
import RecordActions from '../../components/RecordActions';
import { saveAndPrintRecord } from '../../utils/saveAndPrintRecord';
import KardexPeps from '../../components/KardexPeps';

const ACCENT = '#D62476';
const DARK = '#94154E';
const SOFT = '#FDECF4';
const today = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const money = (value) => `C$ ${Number(value || 0).toFixed(2)}`;

export default function Kardex() {
  const { width } = useWindowDimensions();
  const blurTargetRef = useRef(null);
  const compact = width < 620;
  const [producto, setProducto] = useState('');
  const [codigo, setCodigo] = useState('');
  const [unidad, setUnidad] = useState('unidad');
  const [tipo, setTipo] = useState('entrada');
  const [fecha, setFecha] = useState(today());
  const [detalle, setDetalle] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [costoUnitario, setCostoUnitario] = useState('');
  const [movimientos, setMovimientos] = useState([]);
  const [stockWarning, setStockWarning] = useState(null);
  const [method, setMethod] = useState('promedio');
  const [coach, setCoach] = useState({
    label: 'PASO 1 · IDENTIFICA EL PRODUCTO',
    message: 'Escribe el nombre, código y unidad de medida. Después registra la primera entrada como saldo inicial.',
  });

  const saldo = useMemo(() => movimientos.at(-1)?.saldo || { cantidad: 0, costoPromedio: 0, valor: 0 }, [movimientos]);
  const hasInitialInventory = movimientos.length > 0;

  const soloDecimal = (text, setter) => {
    const normalized = text.replace(',', '.').replace(/[^0-9.]/g, '');
    const parts = normalized.split('.');
    setter(parts.length > 1 ? `${parts.shift()}.${parts.join('')}` : normalized);
  };

  const cambiarTipo = (nextType) => {
    setTipo(nextType);
    setCostoUnitario('');
    setCoach(nextType === 'entrada'
      ? { label: '¿QUÉ ES UNA ENTRADA Y CÓMO SE REGISTRA?', message: 'Una entrada ocurre cuando el negocio recibe o compra mercancía. Escribe la fecha, el motivo —por ejemplo, “compra” o “saldo inicial”—, la cantidad recibida y el costo de cada unidad. Se registra para aumentar la existencia y calcular el nuevo costo promedio.' }
      : { label: '¿QUÉ ES UNA SALIDA O VENTA Y CÓMO SE REGISTRA?', message: 'Una salida ocurre cuando la mercancía se vende, entrega o retira del inventario. Escribe la fecha, el motivo y la cantidad que salió. No escribes un costo: AulaMix usa el promedio vigente. Se registra para disminuir correctamente la existencia y su valor.' });
  };

  const agregarMovimiento = () => {
    const qty = Number(cantidad);
    const unitCost = Number(costoUnitario);
    if (!producto.trim() || !codigo.trim() || !unidad.trim()) {
      Alert.alert('Completa el producto', 'Escribe el nombre, código y unidad de medida antes de registrar movimientos.');
      return;
    }
    if (!fecha.trim() || !detalle.trim() || qty <= 0) {
      Alert.alert('Movimiento incompleto', 'Indica la fecha, el detalle y una cantidad mayor que cero.');
      return;
    }
    if (tipo === 'entrada' && unitCost <= 0) {
      Alert.alert('Falta el costo', 'Las entradas necesitan un costo unitario mayor que cero.');
      return;
    }
    if (tipo === 'salida' && qty > saldo.cantidad) {
      setStockWarning({ requested: qty, available: saldo.cantidad, unit: unidad });
      return;
    }

    const movementCost = tipo === 'entrada' ? unitCost : saldo.costoPromedio;
    const movementValue = qty * movementCost;
    const nextQty = tipo === 'entrada' ? saldo.cantidad + qty : saldo.cantidad - qty;
    const nextValue = tipo === 'entrada' ? saldo.valor + movementValue : (nextQty === 0 ? 0 : saldo.valor - movementValue);
    const nextAverage = nextQty === 0 ? 0 : (tipo === 'entrada' ? nextValue / nextQty : saldo.costoPromedio);
    const movement = {
      id: `${Date.now()}-${movimientos.length}`,
      isInitial: movimientos.length === 0,
      fecha: fecha.trim(), detalle: detalle.trim(), tipo, cantidad: qty,
      costoUnitario: movementCost, valorMovimiento: movementValue,
      saldo: { cantidad: nextQty, costoPromedio: nextAverage, valor: nextValue },
    };

    setMovimientos((current) => [...current, movement]);
    setDetalle('');
    setCantidad('');
    setCostoUnitario('');
    setCoach({
      label: tipo === 'entrada' ? 'ENTRADA REGISTRADA' : 'SALIDA REGISTRADA',
      message: `Nueva existencia: ${nextQty.toFixed(2)} ${unidad}, a un costo promedio de ${money(nextAverage)}.`,
    });
  };

  const limpiar = () => {
    setProducto(''); setCodigo(''); setUnidad('unidad'); setTipo('entrada'); setFecha(today());
    setDetalle(''); setCantidad(''); setCostoUnitario(''); setMovimientos([]);
    setCoach({ label: 'TARJETA LIMPIA', message: 'Escribe los datos del producto para comenzar una nueva tarjeta Kardex.' });
  };

  const record = movimientos.length > 0 ? {
        title: 'Tarjeta Kardex · Costo promedio',
        subtitle: `${producto} (${codigo})`,
        rows: [
          { label: 'Producto', value: producto }, { label: 'Código', value: codigo },
          { label: 'Unidad de medida', value: unidad }, { label: 'Método', value: 'Promedio ponderado' },
        ],
        table: {
          title: 'Movimientos',
          headers: ['Fecha', 'Detalle', 'Tipo', 'Cantidad', 'C. unitario', 'Valor', 'Existencia', 'Promedio', 'Saldo'],
          rows: movimientos.map((item) => [item.fecha, item.detalle, item.isInitial ? 'Inicial' : (item.tipo === 'entrada' ? 'Entrada' : 'Salida'), item.cantidad.toFixed(2), money(item.costoUnitario), money(item.valorMovimiento), item.saldo.cantidad.toFixed(2), money(item.saldo.costoPromedio), money(item.saldo.valor)]),
        },
        results: [
          { label: 'Existencia final', value: `${saldo.cantidad.toFixed(2)} ${unidad}` },
          { label: 'Costo promedio final', value: money(saldo.costoPromedio) },
          { label: 'Valor final del inventario', value: money(saldo.valor) },
        ],
      } : null;
  const imprimir = async (options) => { if (record) await saveAndPrintRecord(record, options); };
  return (
    <GuidedTour title="Tarjetas Kardex" steps={kardexTour(method)} currentId={`${method}.movimiento`} accent={DARK}><View style={styles.screen}>
      <BlurTargetView ref={blurTargetRef} style={styles.blurTarget}>
        <AnimatedLogoBackground count={26} backgroundColor="#FFF7FB" />
        <TourScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <MainMenuButton accent={ACCENT} soft={SOFT} />
        <View style={styles.hero}>
          <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>K</Text></View>
          <View style={styles.heroText}>
            <Text style={styles.eyebrow}>SECTOR COMERCIO</Text>
            <Text style={styles.title}>Tarjetas Kardex</Text>
            <Text style={styles.subtitle}>Elige un método de valuación y practica cómo controlar las entradas, salidas y existencias.</Text>
          </View>
        </View>

        <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
        <ToolGuide title="¿Qué es una tarjeta Kardex?"
          whatIs="Es un registro cronológico que permite controlar cuánto producto entra, cuánto sale, cuánto queda disponible y cuál es el valor monetario del inventario."
          logic="Todos los métodos registran los mismos movimientos, pero asignan el costo de las salidas de manera diferente: promedio mezcla los costos; PEPS usa primero los lotes más antiguos; UEPS usa primero los más recientes."
          steps={['Selecciona arriba el método que deseas practicar.', 'Identifica el producto y registra su inventario inicial.', 'Agrega las compras como entradas y las ventas o entregas como salidas.', 'Revisa cómo el método elegido determina el costo de salida y el saldo.']}
          tip="Trabaja cada método por separado para comparar cómo cambia el valor del inventario aun usando los mismos movimientos."
          accent={ACCENT} soft={SOFT} />
        <LearningGuide previewKind={method} lesson={kardexLessons[method]} targets={[`${method}.movimiento`, [`${method}.movimiento`,`${method}.movimiento`,`${method}.resumen`,`${method}.tabla`], `${method}.tabla`, `${method}.resumen`, [`${method}.movimiento`,`${method}.tabla`,`${method}.tabla`,`${method}.resumen`]]} accent={DARK} soft={SOFT} />
        </View>

        <View style={styles.methodSwitcher} accessibilityRole="tablist">
          <MethodButton label="Costo promedio" active={method === 'promedio'} onPress={() => setMethod('promedio')} />
          <MethodButton label="PEPS" active={method === 'peps'} onPress={() => setMethod('peps')} />
          <MethodButton label="UEPS" active={method === 'ueps'} onPress={() => setMethod('ueps')} />
        </View>

        <TourScope prefix="promedio"><View style={[styles.methodContent, method !== 'promedio' && styles.hidden]}>
        <View style={styles.methodIntro}><Text style={styles.methodIntroTitle}>Costo promedio ponderado</Text><Text style={styles.methodIntroText}>Combina el valor de las unidades anteriores y nuevas para obtener un único costo promedio después de cada entrada.</Text></View>
        <InteractionCoach cue={coach} accent={ACCENT} soft={SOFT} />

        <TourPreview values={{ producto, codigo, unidad, tipo, fecha, detalle, cantidad, costoUnitario, movimientos, saldo, hasInitialInventory }}>{({ producto, codigo, unidad, tipo, fecha, detalle, cantidad, costoUnitario, movimientos, saldo, hasInitialInventory }) => <ToolWorkspace input={<>
<TourTarget id="producto" style={styles.card}>
          <SectionTitle number="1" title="Identificación del producto" />
          <View style={[styles.fieldsRow, compact && styles.fieldsColumn]}>
            <Field label="Producto" value={producto} onChangeText={setProducto} placeholder="Ej. Cuaderno universitario" />
            <Field label="Código" value={codigo} onChangeText={setCodigo} placeholder="Ej. PROD-001" />
            <Field label="Unidad" value={unidad} onChangeText={setUnidad} placeholder="unidad, caja, kg…" />
          </View>
        </TourTarget>

        <TourTarget id="movimiento" style={styles.card}>
          <SectionTitle number="2" title="Nuevo movimiento" />
          {hasInitialInventory ? (
            <View style={styles.typeSwitch}>
              <TypeButton label="Entrada" active={tipo === 'entrada'} onPress={() => cambiarTipo('entrada')} />
              <TypeButton label="Salida / venta" active={tipo === 'salida'} onPress={() => cambiarTipo('salida')} />
            </View>
          ) : null}
          <MovementGuide type={tipo} initial={!hasInitialInventory} />
          <View style={[styles.fieldsRow, compact && styles.fieldsColumn]}>
            <Field label="Fecha" value={fecha} onChangeText={setFecha} placeholder="AAAA-MM-DD" />
            <Field label="Detalle" value={detalle} onChangeText={setDetalle} placeholder={!hasInitialInventory ? 'Inventario inicial' : (tipo === 'entrada' ? 'Compra o devolución' : 'Venta o entrega')} />
          </View>
          <View style={[styles.fieldsRow, compact && styles.fieldsColumn]}>
            <Field label="Cantidad" value={cantidad} onChangeText={(text) => soloDecimal(text, setCantidad)} placeholder="0" numeric />
            {tipo === 'entrada' ? <Field label="Costo unitario (C$)" value={costoUnitario} onChangeText={(text) => soloDecimal(text, setCostoUnitario)} placeholder="0.00" numeric /> : (
              <View style={styles.autoCost}><Text style={styles.fieldLabel}>Costo aplicado automáticamente</Text><Text style={styles.autoCostValue}>{money(saldo.costoPromedio)}</Text><Text style={styles.autoCostHelp}>Promedio vigente</Text></View>
            )}
          </View>

        </TourTarget>

</>} output={<>
<TourTarget id="resumen" style={[styles.summary, compact && styles.summaryColumn]}>
          <Summary label="Existencia" value={`${saldo.cantidad.toFixed(2)} ${unidad}`} />
          <Summary label="Costo promedio" value={money(saldo.costoPromedio)} />
          <Summary label="Valor del inventario" value={money(saldo.valor)} />
        </TourTarget>

        <TourTarget id="tabla" style={styles.card}>
          <SectionTitle number="3" title="Registro de movimientos" />
          {movimientos.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>Aún no hay movimientos</Text><Text style={styles.emptyText}>Registra una entrada para crear el saldo inicial.</Text></View> : (
            <ScrollView horizontal showsHorizontalScrollIndicator>
              <View style={styles.table}>
                <TableRow header values={['Fecha', 'Detalle', 'Tipo', 'Cantidad', 'C. unit.', 'Valor', 'Existencia', 'Promedio', 'Saldo']} />
                {movimientos.map((item) => <TableRow key={item.id} values={[item.fecha, item.detalle, item.isInitial ? 'Inicial' : (item.tipo === 'entrada' ? 'Entrada' : 'Salida'), item.cantidad.toFixed(2), money(item.costoUnitario), money(item.valorMovimiento), item.saldo.cantidad.toFixed(2), money(item.saldo.costoPromedio), money(item.saldo.valor)]} />)}
              </View>
            </ScrollView>
          )}
        </TourTarget>
</>} actions={<>
<TourTarget id="registrar"><Pressable onPress={agregarMovimiento} style={({ pressed }) => [styles.addButton, tipo === 'salida' && styles.exitButton, pressed && styles.pressed]}>
            <Text style={styles.addButtonText}>{!hasInitialInventory ? '+ Registrar inventario inicial' : (tipo === 'entrada' ? '+ Registrar entrada' : '− Registrar salida')}</Text>
          </Pressable></TourTarget>
<RecordActions record={record} onClear={limpiar} onPrint={imprimir} canPrint={!!record} accent={ACCENT} /></>} />}</TourPreview>

        </View></TourScope>

        <View style={[styles.methodContent, method !== 'peps' && styles.hidden]}>
          <View style={styles.methodIntro}><Text style={styles.methodIntroTitle}>PEPS · Primeras entradas, primeras salidas</Text><Text style={styles.methodIntroText}>Las primeras unidades que ingresan son las primeras que se usan para valorar una venta. Cada compra se conserva como una capa independiente.</Text></View>
          <KardexPeps onStockWarning={setStockWarning} />
        </View>

        <View style={[styles.methodContent, method !== 'ueps' && styles.hidden]}>
          <View style={styles.methodIntro}><Text style={styles.methodIntroTitle}>UEPS · Últimas entradas, primeras salidas</Text><Text style={styles.methodIntroText}>Las unidades compradas más recientemente son las primeras que se usan para valorar una venta. Los lotes anteriores permanecen hasta que se consuman los nuevos.</Text></View>
          <KardexPeps method="ueps" onStockWarning={setStockWarning} />
        </View>
        </TourScrollView>
        <StatusBar style="dark" />
      </BlurTargetView>

      <Modal visible={stockWarning !== null} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setStockWarning(null)}>
        <View style={styles.modalRoot}>
          <BlurView blurTarget={blurTargetRef} intensity={55} tint="dark" blurMethod="dimezisBlurViewSdk31Plus" style={StyleSheet.absoluteFillObject} />
          <View style={styles.modalShade} />
          <View style={styles.warningCard} accessibilityRole="alert">
            <View style={styles.warningIcon}><Text style={styles.warningIconText}>!</Text></View>
            <Text style={styles.warningEyebrow}>VENTA NO REGISTRADA</Text>
            <Text style={styles.warningTitle}>No hay existencias suficientes</Text>
            <Text style={styles.warningText}>Intentaste vender <Text style={styles.warningStrong}>{stockWarning?.requested.toFixed(2)} {stockWarning?.unit}</Text>, pero solamente tienes <Text style={styles.warningStrong}>{stockWarning?.available.toFixed(2)} {stockWarning?.unit}</Text> disponibles.</Text>
            <View style={styles.warningTip}><Text style={styles.warningTipText}>Reduce la cantidad de la salida o registra primero una nueva entrada de mercancía.</Text></View>
            <Pressable onPress={() => setStockWarning(null)} style={({ pressed }) => [styles.warningButton, pressed && styles.pressed]}>
              <Text style={styles.warningButtonText}>Entendido, corregir cantidad</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View></GuidedTour>
  );
}

function SectionTitle({ number, title }) {
  return <View style={styles.sectionTitle}><View style={styles.step}><Text style={styles.stepText}>{number}</Text></View><Text style={styles.sectionTitleText}>{title}</Text></View>;
}
function Field({ label, numeric, ...props }) {
  return <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput {...props} keyboardType={numeric ? 'decimal-pad' : 'default'} placeholderTextColor="#9CA3AF" style={styles.input} /></View>;
}
function TypeButton({ label, active, onPress }) {
  return <Pressable onPress={onPress} style={[styles.typeButton, active && styles.typeButtonActive]}><Text style={[styles.typeText, active && styles.typeTextActive]}>{label}</Text></Pressable>;
}
function MethodButton({ label, active, onPress }) {
  return <Pressable onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: active }} style={[styles.methodButton, active && styles.methodButtonActive]}><Text style={[styles.methodButtonText, active && styles.methodButtonTextActive]}>{label}</Text></Pressable>;
}
function MovementGuide({ type, initial = false }) {
  const entry = type === 'entrada';
  const items = initial ? [
    ['¿Qué es?', 'La cantidad de mercancía que ya existe cuando se abre esta tarjeta por primera vez.'],
    ['¿Cómo se hace?', 'Escribe fecha, un detalle como “Inventario inicial”, la cantidad disponible y el costo de cada unidad.'],
    ['¿Para qué sirve?', 'Establece el primer saldo. Solo puede registrarse una vez; después se habilitan entradas y salidas normales.'],
  ] : entry ? [
    ['¿Qué es?', 'Mercancía que llega al negocio por una compra, devolución recibida o saldo inicial.'],
    ['¿Cómo se hace?', 'Completa fecha, detalle, cantidad recibida y costo de cada unidad; después presiona “Registrar entrada”.'],
    ['¿Para qué sirve?', 'Aumenta las existencias y recalcula el costo promedio con el valor de la nueva compra.'],
  ] : [
    ['¿Qué es?', 'Mercancía que deja el inventario porque fue vendida, entregada, consumida o retirada.'],
    ['¿Cómo se hace?', 'Completa fecha, motivo y cantidad que salió; después presiona “Registrar salida”. El costo se coloca automáticamente.'],
    ['¿Para qué sirve?', 'Reduce las existencias y el valor del inventario usando el costo promedio vigente.'],
  ];
  return (
    <HelpDialog tourStep="movimiento" label="Cómo registrar" title={initial ? 'Inventario inicial' : entry ? 'Registrar una entrada' : 'Registrar una salida'} accent={DARK} soft={SOFT}>
      <Text style={styles.movementGuideTitle}>{initial ? 'Primero registra el inventario inicial' : (entry ? 'Antes de registrar la entrada' : 'Antes de registrar la salida o venta')}</Text>
      {items.map(([title, text]) => (
        <View key={title} style={styles.movementGuideRow}>
          <Text style={styles.movementGuideLabel}>{title}</Text>
          <Text style={styles.movementGuideText}>{text}</Text>
        </View>
      ))}
    </HelpDialog>
  );
}
function Summary({ label, value }) {
  return <View style={styles.summaryCard}><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue}>{value}</Text></View>;
}
function TableRow({ values, header = false }) {
  return <View style={[styles.tableRow, header && styles.tableHeader]}>{values.map((value, index) => <Text key={`${index}-${value}`} numberOfLines={2} style={[styles.cell, header && styles.headerCell]}>{value}</Text>)}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF7FB' },
  blurTarget: { flex: 1 },
  content: { flexGrow: 1, width: '100%', maxWidth: 1600, alignSelf: 'center', padding: 16, paddingTop: 22, paddingBottom: 36, gap: 14 },
  methodSwitcher: { width: '100%', padding: 4, flexDirection: 'row', borderRadius: 12, backgroundColor: SOFT },
  methodButton: { minHeight: 44, flex: 1, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  methodButtonActive: { backgroundColor: ACCENT, elevation: 2 },
  methodButtonText: { color: DARK, fontSize: 12, fontWeight: '800', textAlign: 'center' },
  methodButtonTextActive: { color: '#FFFFFF' },
  methodContent: { width: '100%', gap: 14 },
  hidden: { display: 'none' },
  methodIntro: { padding: 14, borderLeftWidth: 4, borderLeftColor: ACCENT, borderRadius: 11, backgroundColor: '#FFFFFF' },
  methodIntroTitle: { color: '#2D3047', fontSize: 16, fontWeight: '900' },
  methodIntroText: { marginTop: 4, color: '#697386', fontSize: 12, lineHeight: 18 },
  comingSoon: { minHeight: 220, padding: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1B8D2', borderRadius: 18, backgroundColor: '#FFFFFF' },
  comingBadge: { color: ACCENT, fontSize: 12, fontWeight: '900', letterSpacing: 1.2 },
  comingTitle: { marginTop: 7, color: '#2D3047', fontSize: 20, fontWeight: '900', textAlign: 'center' },
  comingText: { maxWidth: 520, marginTop: 8, color: '#697386', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  hero: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  heroBadge: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: ACCENT, elevation: 3 },
  heroBadgeText: { color: '#FFFFFF', fontSize: 25, fontWeight: '900' },
  heroText: { flex: 1, marginLeft: 13 },
  eyebrow: { color: ACCENT, fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  title: { color: '#2D3047', fontSize: 24, lineHeight: 30, fontWeight: '900' },
  subtitle: { color: '#697386', fontSize: 12, lineHeight: 17, marginTop: 2 },
  card: { width: '100%', padding: 16, borderWidth: 1, borderColor: '#F1B8D2', borderRadius: 17, backgroundColor: '#FFFFFF', elevation: 3, gap: 13 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  step: { width: 29, height: 29, alignItems: 'center', justifyContent: 'center', borderRadius: 9, backgroundColor: ACCENT },
  stepText: { color: '#FFFFFF', fontWeight: '900' },
  sectionTitleText: { flex: 1, color: '#2D3047', fontSize: 17, fontWeight: '900' },
  fieldsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  fieldsColumn: { flexDirection: 'column' },
  field: { flex: 1, minWidth: 140, gap: 5 },
  fieldLabel: { color: '#4B5563', fontSize: 11, fontWeight: '800' },
  input: { width: '100%', minHeight: 48, paddingHorizontal: 12, borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 10, backgroundColor: '#FAFAFB', color: '#172033', fontSize: 14 },
  typeSwitch: { flexDirection: 'row', padding: 4, borderRadius: 11, backgroundColor: SOFT },
  typeButton: { minHeight: 39, flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  typeButtonActive: { backgroundColor: ACCENT, elevation: 2 },
  typeText: { color: DARK, fontSize: 13, fontWeight: '800' },
  typeTextActive: { color: '#FFFFFF' },
  movementGuide: { padding: 12, borderLeftWidth: 4, borderLeftColor: ACCENT, borderRadius: 10, backgroundColor: '#FFF7FB', gap: 8 },
  movementGuideExit: { borderLeftColor: '#7C3AED', backgroundColor: '#F7F3FF' },
  movementGuideTitle: { color: '#2D3047', fontSize: 13, fontWeight: '900' },
  movementGuideRow: { gap: 2 },
  movementGuideLabel: { color: DARK, fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
  movementGuideText: { color: '#5F6472', fontSize: 12, lineHeight: 17 },
  autoCost: { minHeight: 70, flex: 1, padding: 10, justifyContent: 'center', borderRadius: 10, backgroundColor: SOFT },
  autoCostValue: { color: DARK, fontSize: 18, fontWeight: '900', marginTop: 2 },
  autoCostHelp: { color: '#805268', fontSize: 10 },
  addButton: { minHeight: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: ACCENT, elevation: 2 },
  exitButton: { backgroundColor: '#7C3AED' },
  addButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  summary: { flexDirection: 'row', gap: 10 },
  summaryColumn: { flexDirection: 'column' },
  summaryCard: { minHeight: 82, flex: 1, padding: 13, justifyContent: 'center', borderWidth: 1, borderColor: '#F1B8D2', borderRadius: 14, backgroundColor: SOFT },
  summaryLabel: { color: '#805268', fontSize: 11, fontWeight: '700' },
  summaryValue: { color: DARK, fontSize: 19, fontWeight: '900', marginTop: 3 },
  empty: { padding: 24, alignItems: 'center', borderRadius: 12, backgroundColor: '#FFF9FC' },
  emptyTitle: { color: '#4B3140', fontSize: 14, fontWeight: '800' },
  emptyText: { color: '#7B6873', fontSize: 12, marginTop: 3, textAlign: 'center' },
  table: { minWidth: 1030, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, overflow: 'hidden' },
  tableRow: { minHeight: 49, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  tableHeader: { minHeight: 42, backgroundColor: DARK },
  cell: { width: 114, paddingHorizontal: 7, color: '#374151', fontSize: 10, textAlign: 'center' },
  headerCell: { color: '#FFFFFF', fontWeight: '900' },
  modalRoot: { flex: 1, padding: 22, alignItems: 'center', justifyContent: 'center' },
  modalShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20, 8, 15, 0.48)' },
  warningCard: { width: '100%', maxWidth: 440, padding: 22, alignItems: 'center', borderRadius: 22, backgroundColor: '#FFFFFF', elevation: 12, boxShadow: '0px 12px 34px rgba(45, 10, 27, 0.3)' },
  warningIcon: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 24, backgroundColor: '#FEE2E2' },
  warningIconText: { color: '#B91C1C', fontSize: 27, fontWeight: '900' },
  warningEyebrow: { marginTop: 12, color: '#B91C1C', fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  warningTitle: { marginTop: 4, color: '#2D3047', fontSize: 21, fontWeight: '900', textAlign: 'center' },
  warningText: { marginTop: 9, color: '#5F6472', fontSize: 13, lineHeight: 19, textAlign: 'center' },
  warningStrong: { color: '#991B1B', fontWeight: '900' },
  warningTip: { width: '100%', marginTop: 14, padding: 11, borderRadius: 10, backgroundColor: '#FFF1F2' },
  warningTipText: { color: '#7F1D1D', fontSize: 12, lineHeight: 17, textAlign: 'center' },
  warningButton: { width: '100%', minHeight: 48, marginTop: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#B91C1C' },
  warningButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', textAlign: 'center' },
});
