import { Pressable, StyleSheet, Text } from 'react-native';
import HelpDialog from './HelpDialog';
import { useGuidedTour } from './GuidedTour';

export default function InteractionCoach({ cue, accent = '#166534', soft = '#F0FDF4' }) {
  const tour = useGuidedTour();
  if (!cue?.message) return null;
  if (tour) return <Pressable onPress={() => tour.start(tour.currentId)} accessibilityRole="button" accessibilityLabel="Ver ayuda del paso actual" style={{alignSelf:'flex-start',minHeight:40,paddingHorizontal:12,paddingVertical:10,borderWidth:1,borderColor:accent,borderRadius:20,backgroundColor:soft}}><Text style={{color:accent,fontSize:12,fontWeight:'700'}}>¿Cómo usar este paso?</Text></Pressable>;
  return <HelpDialog label="Ayuda del paso" title={cue.label || 'Ayuda contextual'} accent={accent} soft={soft}>
    <Text style={styles.message}>{cue.message}</Text>
  </HelpDialog>;
}

const styles = StyleSheet.create({ message: { color: '#455468', fontSize: 16, lineHeight: 25 } });
