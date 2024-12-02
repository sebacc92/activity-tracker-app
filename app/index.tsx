import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  ScrollView,
  NativeSyntheticEvent, NativeScrollEvent
} from "react-native";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, exchangeCodeAsync } from 'expo-auth-session';
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import useAuthStore from "@/stores/useAuthStore";

interface HandleScroll {
  (event: NativeSyntheticEvent<NativeScrollEvent>): void;
}

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('@/assets/images/slide-1.jpg'),
    title: 'Recent activities',
    description: 'Get to show recent activities from the Strava app.',
  },
  {
    id: '2',
    image: require('@/assets/images/slide-2.jpg'),
    title: 'Monthly statistics',
    description: 'Displays distance, time and total elevation gain for each month.',
  },
];

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
  tokenEndpoint: 'https://www.strava.com/oauth/token',
  revocationEndpoint: 'https://www.strava.com/oauth/deauthorize',
};

export default function Index() {
  const router = useRouter();
  const { accessToken, isLoadingTokens, setTokens, loadTokens } = useAuthStore();
  console.log('accessToken useAuthStore', accessToken)

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_CLIENT_ID!,
      scopes: ['activity:read_all'],
      redirectUri: makeRedirectUri({
        native: 'http://localhost',
      }),
    },
    discovery
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleScroll: HandleScroll = (event) => {
    const contentOffsetX: number = event.nativeEvent.contentOffset.x;
    const newIndex: number = Math.round(contentOffsetX / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    loadTokens();
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeAsync({
        clientId: process.env.EXPO_PUBLIC_CLIENT_ID!,
        redirectUri: makeRedirectUri({
          native: 'http://localhost',
        }),
        code,
        extraParams: {
          //TODO: add private env var
          client_secret: process.env.EXPO_PUBLIC_CLIENT_SECRET!,
        }
      },
      {
        tokenEndpoint: discovery.tokenEndpoint,
      }).then(async (result) => {
        console.log('result', result)
        console.log('Access token: ', result.accessToken);
        if (result.accessToken) {
          setTokens(result.accessToken, result.refreshToken);
          await setTokens({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken!,
            expiresAt: result.expiresIn ? Math.floor(Date.now() / 1000) + result.expiresIn : null,
          });
        }
        router.replace('/activities');
      }).catch((error) => {
        console.error('Error exchanging code: ', error);
      });
    }
  }, [response]);
  
  useEffect(() => {
    if (!isLoadingTokens && accessToken) {
      router.replace('/activities');
    }
  }, [accessToken]);

  if (isLoadingTokens) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading tokens...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appTitle}>Activity Tracker App</Text>
      <View style={styles.imageContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {slides.map((slide) => (
            <Image key={slide.id} source={slide.image} style={styles.image} resizeMode="cover" />
          ))}
        </ScrollView>
      </View>
      <View style={styles.contentContainer}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>{slides[currentIndex].title}</Text>
          <Text style={styles.description}>{slides[currentIndex].description}</Text>
        </Animated.View>
        <View style={styles.indicatorContainer}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicator,
                i === currentIndex ? styles.activeIndicator : styles.inactiveIndicator,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            promptAsync();
          }}
        >
          <Text style={styles.buttonText}>Login with Strava</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appTitle: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    zIndex: 10,
  },
  imageContainer: {
    height: height * 0.6,
    width: '100%',
  },
  image: {
    width,
    height: '100%',
  },
  contentContainer: {
    height: height * 0.4,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'space-between',
  },
  animatedContent: {
    flex: 1,
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    height: 50,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: '#007AFF',
  },
  inactiveIndicator: {
    backgroundColor: '#CCCCCC',
  },
  button: {
    backgroundColor: '#FC4C02',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});