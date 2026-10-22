import { Pressable, Text } from 'react-native';
import { useGuidedTour } from './GuidedTour';

export function buildLearningTour(lesson, targets, previewKind) {
  const [overview, terms, calculation, result, exampleTargets] = targets;
  const steps = [
    { target:overview, title:'Comprende el método', message:lesson.concept, tip:'Estás viendo los valores de una demostración temporal. Al cerrar o terminar la guía volverán tus datos; el ejemplo no se guarda.' },
    ...lesson.terms.map((term, i) => ({ target:terms[i] || overview, title:term.name, message:term.meaning })),
    { target:calculation, title:'Fórmulas para hacerlo a mano', message:lesson.formulas.join('\n\n') },
    { target:calculation, title:'Prepara el ejemplo en tu cuaderno', message:lesson.example },
    ...lesson.steps.map((step, i) => ({ target:exampleTargets[i] || calculation, title:step.title, message:step.text })),
    { target:result, title:'Comprueba el resultado', message:lesson.check },
    { target:result, title:'Evita estos errores', message:lesson.mistakes.map((text,i) => `${i+1}. ${text}`).join('\n\n') },
    { target:calculation, title:'Ahora inténtalo tú', message:lesson.practice.question, practice:'question', tip:'Resuélvelo en tu cuaderno. Pulsa Siguiente cuando quieras comparar tu respuesta.' },
    { target:result, title:'Compara tu solución', message:lesson.practice.answer, practice:'answer' },
    { target:result, title:'Qué debes recordar', message:lesson.note, tip:lesson.sources.map(source => source.name).join('\n') },
  ];
  return { title:lesson.title, previewKind, steps:steps.map((step,i) => ({ ...step,id:`entender-${i}` })) };
}

export default function LearningGuide({ lesson, targets, previewKind, accent = '#166534', soft = '#F0FDF4' }) {
  const tour = useGuidedTour();
  return <Pressable onPress={() => tour?.start(undefined, buildLearningTour(lesson, targets, previewKind))} accessibilityRole="button" accessibilityLabel="Iniciar guía de entendimiento" style={{ minHeight:40, paddingHorizontal:12, paddingVertical:10, borderWidth:1, borderColor:accent, borderRadius:20, backgroundColor:soft, alignSelf:'flex-start' }}><Text style={{color:accent,fontWeight:'700',fontSize:12}}> ? Entender la herramienta</Text></Pressable>;
}
