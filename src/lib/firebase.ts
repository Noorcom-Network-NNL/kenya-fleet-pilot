
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCysXSy6Agwqk7QBBEqDbhypVb9AnXpOAg",
  authDomain: "fleet-management-app-7a80c.firebaseapp.com",
  projectId: "fleet-management-app-7a80c",
  storageBucket: "fleet-management-app-7a80c.firebasestorage.app",
  messagingSenderId: "804545213333",
  appId: "1:804545213333:web:763ea83a6c7337d8e37c9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
