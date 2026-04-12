import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js"
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js"
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyB9QmQmPTll_-a699Ixg7hAOAmwxCZ1NeE",
  authDomain: "momentum-todo-0333.firebaseapp.com",
  projectId: "momentum-todo-0333",
  storageBucket: "momentum-todo-0333.firebasestorage.app",
  messagingSenderId: "1090634684999",
  appId: "1:1090634684999:web:b9e135857357e07d67ef62",
  measurementId: "G-7C7LMZG76N"
};


const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const provider = new GoogleAuthProvider()

export { auth, db, provider, signInWithPopup, signOut, onAuthStateChanged, collection, doc, setDoc, deleteDoc, onSnapshot, getDoc }