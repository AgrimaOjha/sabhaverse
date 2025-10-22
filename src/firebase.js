import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAJfPtLyfL2sf8iNLl8zuwB2KHpn8Zna0",
  authDomain: "sabhaverse.firebaseapp.com",
  projectId: "sabhaverse",
  storageBucket: "sabhaverse.appspot.com",
  messagingSenderId: "532480962565",
  appId: "1:532480962565:web:3d636364dcd9a38e672c6c"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;
