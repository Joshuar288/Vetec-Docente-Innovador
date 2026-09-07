import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AnimatedLogoBackground from '../../components/AnimatedLogoBackground';

export default function Kardex() {
  return (
    <View style={styles.screen}>
      <AnimatedLogoBackground count={26} backgroundColor="#FFF7FB" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>K</Text>
          </View>
          <View style={styles.heroText}>
            <Text style={styles.eyebrow}>SECTOR COMERCIO</Text>
            <Text style={styles.title}>Tarjetas Kardex</Text>
            <Text style={styles.subtitle}>
              Controla entradas, salidas y existencias de tus productos.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardAccent} />
          <Text style={styles.cardTitle}>Gestión de inventario</Text>
          <Text style={styles.cardDescription}>
            Esta será el área de trabajo para crear y administrar las tarjetas Kardex.
          </Text>

          <View style={styles.featureGrid}>
            <Feature badge="E" title="Entradas" description="Registra compras e ingresos." />
            <Feature badge="S" title="Salidas" description="Registra ventas y egresos." />
            <Feature badge="X" title="Existencias" description="Consulta el saldo disponible." />
          </View>

          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>Módulo preparado</Text>
            <Text style={styles.noticeText}>
              En el siguiente paso podremos agregar el formulario y los cálculos del Kardex.
            </Text>
          </View>
        </View>

        <Link href="/" asChild>
          <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
            <Text style={styles.backButtonText}>← Volver a los sectores</Text>
          </Pressable>
        </Link>
      </ScrollView>

      <StatusBar style="dark" />
    </View>
  );
}

function Feature({ badge, title, description }) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureBadge}>
        <Text style={styles.featureBadgeText}>{badge}</Text>
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFF7FB' },
  content: { flexGrow: 1, width: '100%', maxWidth: 720, alignSelf: 'center', padding: 18, paddingTop: 26, paddingBottom: 34 },
  hero: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  heroBadge: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: '#D62476', elevation: 3 },
  heroBadgeText: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  heroText: { flex: 1, marginLeft: 13 },
  eyebrow: { color: '#D62476', fontSize: 11, fontWeight: '900', letterSpacing: 1.1 },
  title: { color: '#2D3047', fontSize: 25, lineHeight: 31, fontWeight: '900' },
  subtitle: { color: '#697386', fontSize: 13, lineHeight: 18, marginTop: 2 },
  card: { width: '100%', padding: 17, overflow: 'hidden', borderWidth: 1, borderColor: '#F1B8D2', borderRadius: 18, backgroundColor: '#FFFFFF', elevation: 4, boxShadow: '0px 5px 16px rgba(109, 21, 64, 0.12)' },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 5, backgroundColor: '#D62476' },
  cardTitle: { color: '#2D3047', fontSize: 19, fontWeight: '900', marginTop: 4 },
  cardDescription: { color: '#697386', fontSize: 13, lineHeight: 19, marginTop: 5 },
  featureGrid: { gap: 9, marginTop: 18 },
  feature: { minHeight: 68, padding: 11, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F5C8DD', borderRadius: 13, backgroundColor: '#FFFAFC' },
  featureBadge: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FDECF4', marginRight: 11 },
  featureBadgeText: { color: '#94154E', fontSize: 16, fontWeight: '900' },
  featureText: { flex: 1 },
  featureTitle: { color: '#34384F', fontSize: 14, fontWeight: '800' },
  featureDescription: { color: '#727C8E', fontSize: 12, lineHeight: 17, marginTop: 1 },
  notice: { marginTop: 17, padding: 13, borderRadius: 12, backgroundColor: '#FDECF4' },
  noticeTitle: { color: '#94154E', fontSize: 13, fontWeight: '900' },
  noticeText: { color: '#75445D', fontSize: 12, lineHeight: 17, marginTop: 3 },
  backButton: { minHeight: 48, marginTop: 16, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#D62476', borderRadius: 13, backgroundColor: '#FFFFFF' },
  backButtonText: { color: '#94154E', fontSize: 14, fontWeight: '800' },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
});
