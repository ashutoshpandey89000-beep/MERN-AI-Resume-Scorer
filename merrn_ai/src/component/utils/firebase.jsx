
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA8XLD-yhrZ4mTwbe441blI3DjsVT29y10",
  authDomain: "project-1f22c642-812a-4153-a14.firebaseapp.com",
  projectId: "project-1f22c642-812a-4153-a14",
  storageBucket: "project-1f22c642-812a-4153-a14.firebasestorage.app",
  messagingSenderId: "314767772783",
  appId: "1:314767772783:web:ec59b9afce81f7dfea119a",
  measurementId: "G-9CF9KV8NB0"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };