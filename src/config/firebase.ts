import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBpvrpPAkMfc1oTMZYToZumeDd5FXMb0JQ",
    authDomain: "halapp-15095.firebaseapp.com",
    projectId: "halapp-15095",
    storageBucket: "halapp-15095.firebasestorage.app",
    messagingSenderId: "403774189786",
    appId: "1:403774189786:web:583891b7de30bba069b5e3",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
