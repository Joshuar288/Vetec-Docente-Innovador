import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';

const LOGO = require('../assets/LogoAulaMix.png');

function MovingLogo({ particle }) {
  const progress = useRef(new Animated.Value(particle.initialProgress)).current;

  useEffect(() => {
    const oscillation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: -1,
          duration: particle.duration * 2,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 1,
          duration: particle.duration * 2,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      { resetBeforeIteration: false }
    );
    const animation = Animated.sequence([
      Animated.timing(progress, {
        toValue: 1,
        duration: particle.duration * (1 - particle.initialProgress),
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      oscillation,
    ]);

    animation.start();
    return () => animation.stop();
  }, [particle, progress]);

  const translateX = progress.interpolate({
    inputRange: [-1, 1],
    outputRange: [-particle.distanceX, particle.distanceX],
  });
  const translateY = progress.interpolate({
    inputRange: [-1, 1],
    outputRange: [-particle.distanceY, particle.distanceY],
  });
  const rotate = progress.interpolate({
    inputRange: [-1, 1],
    outputRange: [`-${particle.rotation}deg`, `${particle.rotation}deg`],
  });

  return (
    <Animated.Image
      source={LOGO}
      resizeMode="contain"
      style={[
        styles.logo,
        {
          left: particle.left,
          top: particle.top,
          width: particle.size,
          height: particle.size,
          opacity: particle.opacity,
          transform: [{ translateX }, { translateY }, { rotate }],
        },
      ]}
    />
  );
}

export default function AnimatedLogoBackground({ count = 28, backgroundColor = '#F4FFF6' }) {
  const { width, height } = useWindowDimensions();
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const angle = ((index * 137.5) % 360) * (Math.PI / 180);
      const distance = 16 + (index % 6) * 7;
      return {
        left: (index * 83.7) % Math.max(width - 45, 1),
        top: (index * 57.3) % Math.max(height - 45, 1),
        size: 42 + (index % 5) * 8,
        opacity: 0.18 + (index % 4) * 0.055,
        distanceX: Math.cos(angle) * distance,
        distanceY: Math.sin(angle) * distance,
        duration: 4200 + (index % 9) * 630,
        initialProgress: ((index * 37) % 200) / 100 - 1,
        rotation: 3 + (index % 5) * 2,
      };
    });
  }, [count, height, width]);

  return (
    <View pointerEvents="none" style={[styles.container, { backgroundColor }]}>
      {particles.map((particle, index) => <MovingLogo key={index} particle={particle} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  logo: {
    position: 'absolute',
  },
});
