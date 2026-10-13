import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export default function useGuidePulse(active) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.stopAnimation();

    if (!active) {
      progress.setValue(0);
      return undefined;
    }

    progress.setValue(0);
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [active, progress]);

  return {
    borderColor: progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['#4ADE80', '#15803D'],
    }),
    backgroundColor: progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['#F0FDF4', '#E7F8EB'],
    }),
    transform: [{
      translateY: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -2],
      }),
    }],
  };
}
