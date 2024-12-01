import { View, StyleSheet, Button } from "react-native";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, exchangeCodeAsync } from 'expo-auth-session';
import { useEffect } from "react";
import { useRouter } from "expo-router";
import useAuthStore from "@/stores/useAuthStore";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
  tokenEndpoint: 'https://www.strava.com/oauth/token',
  revocationEndpoint: 'https://www.strava.com/oauth/deauthorize',
};

export default function Index() {
  const router = useRouter();
  const { accessToken, setTokens } = useAuthStore();
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
    if (accessToken) {
      router.replace('/activities');
    }
  }, [accessToken]);

  return (
    <View style={styles.container}>
      <Button
        disabled={!request}
        title="Login with Strava"
        onPress={() => {
          promptAsync();
        }}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});