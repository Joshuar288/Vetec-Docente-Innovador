import { createContext, forwardRef, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { getTourPreview } from '../utils/tourPreview';

const TourContext = createContext(null);
export const useGuidedTour = () => useContext(TourContext);
// Only displayed props change: the form state and persisted records stay untouched.
export function TourPreview({ values, children }) {
  const tour = useGuidedTour();
  return children(tour?.preview ? { ...values, ...tour.preview } : values);
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const measure = ref => new Promise(resolve => {
  if (!ref?.measureInWindow) return resolve(null);
  ref.measureInWindow((x,y,width,height) => resolve(width && height ? { x,y,width,height } : null));
});

export function TourTarget({ id, children, style }) {
  const tour = useGuidedTour();
  const target = useRef(null);
  const key = tour?.prefix ? `${tour.prefix}.${id}` : id;
  const register = tour?.register;
  useEffect(() => register?.(key, target), [register, key]);
  return <View ref={target} collapsable={false} testID={`tour-target-${key}`} style={style}>{children}</View>;
}

export function TourScope({ prefix, children }) {
  const tour = useGuidedTour();
  return <TourContext.Provider value={tour ? { ...tour, prefix } : null}>{children}</TourContext.Provider>;
}

export const TourScrollView = forwardRef(function TourScrollView({ onScroll, ...props }, forwardedRef) {
  const tour = useGuidedTour();
  const ref = useCallback(node => {
    if (tour) tour.scroll.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  }, [tour?.scroll, forwardedRef]);
  return <ScrollView {...props} ref={ref} scrollEventThrottle={16} onScroll={event => {
    if (tour) tour.offset.current = event.nativeEvent.contentOffset.y;
    onScroll?.(event);
  }} />;
});

export default function GuidedTour({ title, steps, currentId, accent = '#166534', children }) {
  const { width, height } = useWindowDimensions();
  const targets = useRef(new Map());
  const scroll = useRef(null);
  const offset = useRef(0);
  const [index, setIndex] = useState(-1);
  const [lessonRun, setLessonRun] = useState(null);
  const activeSteps = lessonRun?.steps || steps;
  const [rect, setRect] = useState(null);
  const [cardHeight, setCardHeight] = useState(270);
  const closeRef = useRef(null);
  const returnFocus = useRef(null);
  const register = useCallback((id, ref) => {
    targets.current.set(id, ref);
    return () => { if (targets.current.get(id) === ref) targets.current.delete(id); };
  }, []);
  const close = useCallback(() => {
    setIndex(-1); setRect(null);
    if (Platform.OS === 'web') setTimeout(() => returnFocus.current?.focus?.({ preventScroll: true }), 0);
  }, []);
  const start = useCallback((id, lesson) => {
    if (Platform.OS === 'web') returnFocus.current = document.activeElement;
    setLessonRun(lesson || null);
    const selected = (lesson?.steps || steps).findIndex(step => step.id === id);
    setRect(null); setIndex(selected >= 0 ? selected : 0);
  }, [steps]);
  const step = index >= 0 ? activeSteps[index] : null;
  const preview = step && lessonRun?.previewKind ? getTourPreview(lessonRun.previewKind, step.practice) : null;
  useEffect(() => {
    if (!step) return;
    let cancelled = false;
    setRect(null);
    const update = async () => {
      const ref = targets.current.get(step.target || step.id)?.current;
      if (Platform.OS === 'web' && ref?.scrollIntoView) {
        ref.scrollIntoView({ block: 'center', behavior: 'instant' });
      } else {
        const initial = await measure(ref);
        if (initial && scroll.current) scroll.current.scrollTo({ y: Math.max(0, offset.current + initial.y - 100), animated: false });
      }
      await pause(180);
      const bounds = await measure(ref);
      if (!cancelled) { setRect(bounds); closeRef.current?.focus?.(); }
    };
    void update();
    return () => { cancelled = true; };
  }, [step, width, height]);
  useEffect(() => {
    if (index < 0 || Platform.OS !== 'web') return;
    const onKey = event => {
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); setIndex(i => Math.min(activeSteps.length - 1, i + 1)); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setIndex(i => Math.max(0, i - 1)); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index >= 0, activeSteps.length, close]);
  const padding = 7;
  const box = rect && {
    x: Math.max(6, rect.x - padding), y: Math.max(6, rect.y - padding),
    right: Math.min(width - 6, rect.x + rect.width + padding), bottom: Math.min(height - 6, rect.y + rect.height + padding),
  };
  const cardWidth = Math.min(340, width - 24);
  let left = Math.max(12, (width - cardWidth) / 2);
  let top = Math.max(12, height - cardHeight - 20);
  if (box) {
    if (width - box.right > cardWidth + 24) { left = box.right + 16; top = box.y; }
    else if (box.x > cardWidth + 24) { left = box.x - cardWidth - 16; top = box.y; }
    else if (height - box.bottom > cardHeight + 20) { top = box.bottom + 14; left = Math.max(12, Math.min(width - cardWidth - 12, box.x)); }
    else if (box.y > cardHeight + 20) { top = box.y - cardHeight - 14; left = Math.max(12, Math.min(width - cardWidth - 12, box.x)); }
  }
  top = Math.max(12, Math.min(height - cardHeight - 12, top));
  return <TourContext.Provider value={{ register, scroll, offset, start, currentId, preview, prefix: '' }}>
    {children}
    <Modal visible={!!step} transparent animationType="none" statusBarTranslucent onRequestClose={close}>
      <View style={s.overlay} accessibilityViewIsModal>
        {box ? <>
          <View style={[s.shade, { top:0, left:0, right:0, height:box.y }]} />
          <View style={[s.shade, { top:box.bottom, left:0, right:0, bottom:0 }]} />
          <View style={[s.shade, { top:box.y, left:0, width:box.x, height:Math.max(0,box.bottom-box.y) }]} />
          <View style={[s.shade, { top:box.y, left:box.right, right:0, height:Math.max(0,box.bottom-box.y) }]} />
          <View testID="tour-highlight" pointerEvents="none" style={[s.highlight, { left:box.x, top:box.y, width:Math.max(0,box.right-box.x), height:Math.max(0,box.bottom-box.y), borderColor:accent }]} />
        </> : <View style={[s.shade, StyleSheet.absoluteFill]} />}
        {!!step && <View testID="tour-card" onLayout={event => setCardHeight(event.nativeEvent.layout.height)} style={[s.card, { left, top, width:cardWidth, maxHeight:height - 24 }]}>
          <View style={s.track}><View style={[s.progress, { width:`${(index+1)/activeSteps.length*100}%`, backgroundColor:accent }]} /></View>
          <View style={s.header}><Text style={s.tool}>{lessonRun?.title || title}</Text><Text style={s.counter}>{index+1} de {activeSteps.length}</Text><Pressable ref={closeRef} onPress={close} accessibilityRole="button" accessibilityLabel="Cerrar tutorial" hitSlop={8}><Text style={s.x}>×</Text></Pressable></View>
          {!!preview && <Text style={s.counter}>Demostración temporal · no se guarda</Text>}
          <ScrollView contentContainerStyle={s.body} style={{ maxHeight:Math.max(100,height * .38) }}>
            {!rect && <ActivityIndicator size="small" color={accent} />}
            <Text accessibilityRole="header" style={s.title}>{step.title}</Text>
            <Text style={s.message}>{step.message}</Text>
            {!!step.tip && <View style={[s.tip, { borderLeftColor:accent }]}><Text style={s.tipText}>{step.tip}</Text></View>}
          </ScrollView>
          <View style={s.buttons}>
            <Pressable onPress={close} accessibilityRole="button" style={s.skip}><Text style={s.skipText}>Saltar tutorial</Text></Pressable>
            <Pressable onPress={() => setIndex(i => i-1)} disabled={index===0} accessibilityRole="button" style={[s.back,index===0 && {opacity:.35}]}><Text style={s.backText}>← Atrás</Text></Pressable>
            <Pressable onPress={() => index===activeSteps.length-1 ? close() : setIndex(i => i+1)} accessibilityRole="button" style={[s.next,{backgroundColor:accent}]}><Text style={s.nextText}>{index===activeSteps.length-1?'Terminar ✓':'Siguiente →'}</Text></Pressable>
          </View>
        </View>}
      </View>
    </Modal>
  </TourContext.Provider>;
}
const s = StyleSheet.create({
  overlay:{flex:1}, shade:{position:'absolute',backgroundColor:'rgba(8,18,13,0.76)'},
  highlight:{position:'absolute',borderWidth:3,borderRadius:12},
  card:{position:'absolute',backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#CFDED3',borderRadius:16,padding:14,gap:12,elevation:16,boxShadow:'0px 8px 30px rgba(0,0,0,0.24)'},
  track:{height:4,backgroundColor:'#E8EFEA',borderRadius:2,overflow:'hidden'},progress:{height:4},
  header:{flexDirection:'row',alignItems:'center',gap:10},tool:{flex:1,color:'#5B7363',fontSize:11,fontWeight:'700'},counter:{color:'#6B8273',fontSize:11},x:{color:'#496453',fontSize:23},
  body:{gap:9},title:{color:'#163F26',fontSize:18,fontWeight:'800'},message:{color:'#425A4B',fontSize:14,lineHeight:21},
  tip:{padding:10,borderLeftWidth:3,backgroundColor:'#F1F7F3',borderRadius:8},tipText:{color:'#496453',fontSize:12,lineHeight:18},
  buttons:{flexDirection:'row',alignItems:'center',gap:6},skip:{flex:1,paddingVertical:10},skipText:{fontSize:10,color:'#60786A',textDecorationLine:'underline'},
  back:{paddingVertical:10,paddingHorizontal:9,borderWidth:1,borderColor:'#CFDED3',borderRadius:9},backText:{fontSize:12,fontWeight:'600',color:'#45624F'},
  next:{paddingVertical:11,paddingHorizontal:10,borderRadius:9},nextText:{fontSize:12,color:'#FFFFFF',fontWeight:'800'},
});
