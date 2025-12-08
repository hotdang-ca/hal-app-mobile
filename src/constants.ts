import { Platform } from "react-native";

// Use process.env.EXPO_PUBLIC_API_URL if available, otherwise fallback to local dev
const PROD_API_URL = process.env.EXPO_PUBLIC_API_URL;
const DEV_API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

export const API_URL = PROD_API_URL || DEV_API_URL;
