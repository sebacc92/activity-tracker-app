import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { accessToken, loadTokens } = useAuthStore();
  console.log('accessToken useAuthStore (activities page)', accessToken)

  useEffect(() => {
    loadTokens();
  }, []);
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 70, color: 'red' }}>Activities!</Text>
    </View>
  );
}
