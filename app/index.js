import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const SECTORES = {
  agropecuario: {
    nombre: 'Sector Agropecuario',
    descripcion: 'Producción animal, nutrición y manejo técnico',
    color: '#39A852',
    oscuro: '#176B33',
    fondo: '#ECF8EF',
    inicial: 'A',
  },
  comercio: {
    nombre: 'Sector Comercio',
    descripcion: 'Administración, inventario y gestión comercial',
    color: '#D62476',
    oscuro: '#94154E',
    fondo: '#FDECF4',
    inicial: 'C',
  },
};

export default function App() {
  const [sectorActivo, setSectorActivo] = useState('agropecuario');
  const sector = SECTORES[sectorActivo];

  return (
    <View style={styles.screen}>
      <View style={[styles.decoracion, styles.decoracionSuperior]} />
      <View style={[styles.decoracion, styles.decoracionInferior]} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={require('../assets/LogoAulaMix.png')} style={styles.logo} />
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>HERRAMIENTAS EDUCATIVAS</Text>
            <Text style={styles.title}>Bienvenidos a AulaMix</Text>
            <Text style={styles.subtitle}>Selecciona un sector para consultar sus herramientas.</Text>
          </View>
        </View>

        <View style={styles.sectorSection}>
          <Text style={styles.sectionTitle}>Sectores técnicos</Text>
          <View style={styles.sectorGrid}>
            {Object.entries(SECTORES).map(([id, item]) => {
              const activo = sectorActivo === id;
              return (
                <Pressable
                  key={id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: activo }}
                  onPress={() => setSectorActivo(id)}
                  style={({ pressed }) => [
                    styles.sectorCard,
                    { borderColor: item.color },
                    activo && { backgroundColor: item.color },
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={[styles.sectorIcon, { backgroundColor: activo ? '#FFFFFF' : item.fondo }]}>
                    <Text style={[styles.sectorInitial, { color: item.oscuro }]}>{item.inicial}</Text>
                  </View>
                  <View style={styles.sectorTextContainer}>
                    <Text style={[styles.sectorName, activo && styles.textWhite]}>{item.nombre}</Text>
                    <Text style={[styles.sectorDescription, activo && styles.textWhiteSoft]}>
                      {item.descripcion}
                    </Text>
                  </View>
                  <Text style={[styles.check, activo && styles.checkActive]}>{activo ? '✓' : '›'}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.toolsSection}>
          <View style={styles.toolsHeading}>
            <View style={[styles.colorBar, { backgroundColor: sector.color }]} />
            <View>
              <Text style={styles.toolsTitle}>{sector.nombre}</Text>
              <Text style={styles.toolsSubtitle}>Herramientas disponibles</Text>
            </View>
          </View>

          {sectorActivo === 'agropecuario' ? (
            <View style={styles.toolsGrid}>
              <ToolLink href="/(tabs)/Caldosis" badge="D" title="Calculadora de dosis"
                description="Calcula dosis de medicamentos de forma rápida." sector={sector} />
              <ToolLink href="/(tabs)/Cuadropearson" badge="P" title="Cuadrado de Pearson"
                description="Formula mezclas equilibradas de dos ingredientes." sector={sector} />
            </View>
          ) : (
            <View style={styles.toolsGrid}>
              <View style={[styles.toolCard, { borderColor: sector.color }]}>
                <View style={[styles.toolBadge, { backgroundColor: sector.fondo }]}>
                  <Text style={[styles.toolBadgeText, { color: sector.oscuro }]}>K</Text>
                </View>
                <View style={styles.toolContent}>
                  <Text style={styles.toolTitle}>Tarjetas Kardex</Text>
                  <Text style={styles.toolDescription}>
                    Control y seguimiento de entradas, salidas y existencias.
                  </Text>
                  <View style={[styles.moduleBadge, { backgroundColor: sector.fondo }]}>
                    <Text style={[styles.moduleText, { color: sector.oscuro }]}>Módulo de comercio</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </View>
  );
}

function ToolLink({ href, badge, title, description, sector }) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="link" style={({ pressed }) => [
        styles.toolCard, { borderColor: sector.oscuro }, pressed && styles.pressed,
      ]}>
        <View style={[styles.toolBadge, { backgroundColor: sector.fondo }]}>
          <Text style={[styles.toolBadgeText, { color: sector.oscuro }]}>{badge}</Text>
        </View>
        <View style={styles.toolContent}>
          <Text style={styles.toolTitle}>{title}</Text>
          <Text style={styles.toolDescription}>{description}</Text>
          <View style={[styles.moduleBadge, { backgroundColor: sector.fondo }]}>
            <Text style={[styles.moduleText, { color: sector.oscuro }]}>Módulo agropecuario</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7FAFC' },
  container: { flexGrow: 1, width: '100%', maxWidth: 920, alignSelf: 'center', paddingHorizontal: 18, paddingTop: 28, paddingBottom: 36 },
  decoracion: { position: 'absolute', width: 220, height: 220, borderRadius: 110, opacity: 0.08 },
  decoracionSuperior: { top: -90, right: -70, backgroundColor: '#1769AA' },
  decoracionInferior: { bottom: -100, left: -80, backgroundColor: '#D62476' },
  header: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', width: '100%', maxWidth: 680, marginBottom: 26 },
  logo: { width: 92, height: 92, resizeMode: 'contain', marginRight: 16 },
  headerText: { flex: 1 },
  eyebrow: { color: '#1769AA', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 4 },
  title: { color: '#15324A', fontSize: 27, fontWeight: '800', lineHeight: 32 },
  subtitle: { color: '#5D7182', fontSize: 14, lineHeight: 20, marginTop: 4 },
  sectorSection: { width: '100%', maxWidth: 680, alignSelf: 'center' },
  sectionTitle: { color: '#28465E', fontSize: 15, fontWeight: '700', marginBottom: 10 },
  sectorGrid: { gap: 10 },
  sectorCard: { minHeight: 84, padding: 12, borderWidth: 2, borderRadius: 16, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', elevation: 2, boxShadow: '0px 3px 10px rgba(21, 50, 74, 0.08)' },
  sectorIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  sectorInitial: { fontSize: 21, fontWeight: '900' },
  sectorTextContainer: { flex: 1 },
  sectorName: { color: '#203D54', fontSize: 16, fontWeight: '800' },
  sectorDescription: { color: '#607484', fontSize: 12, lineHeight: 17, marginTop: 2 },
  textWhite: { color: '#FFFFFF' },
  textWhiteSoft: { color: 'rgba(255, 255, 255, 0.88)' },
  check: { color: '#8DA0AE', fontSize: 24, fontWeight: '700', marginLeft: 8 },
  checkActive: { color: '#FFFFFF' },
  toolsSection: { width: '100%', maxWidth: 680, alignSelf: 'center', marginTop: 24, padding: 16, borderRadius: 18, backgroundColor: '#FFFFFF', elevation: 3, boxShadow: '0px 5px 16px rgba(21, 50, 74, 0.09)' },
  toolsHeading: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  colorBar: { width: 5, height: 38, borderRadius: 3, marginRight: 10 },
  toolsTitle: { color: '#203D54', fontSize: 18, fontWeight: '800' },
  toolsSubtitle: { color: '#738594', fontSize: 12, marginTop: 1 },
  toolsGrid: { gap: 10 },
  toolCard: { width: '100%', minHeight: 106, padding: 14, borderWidth: 2, borderRadius: 14, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'flex-start' },
  toolBadge: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  toolBadgeText: { fontSize: 19, fontWeight: '900' },
  toolContent: { flex: 1 },
  toolTitle: { color: '#203D54', fontSize: 16, fontWeight: '800' },
  toolDescription: { color: '#667B8B', fontSize: 12, lineHeight: 17, marginTop: 3 },
  moduleBadge: { alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, marginTop: 9 },
  moduleText: { fontSize: 11, fontWeight: '800' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
});
