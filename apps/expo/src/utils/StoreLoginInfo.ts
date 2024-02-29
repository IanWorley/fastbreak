import * as SecureStore from "expo-secure-store";

export const tokenCache = {
  getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      throw new Error("Failed to get token");
    }
  },
  saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      throw new Error("Failed to save token");
    }
  },
};
