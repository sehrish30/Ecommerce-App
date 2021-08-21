import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyApAizDwbc-W1ODei9PKYoGJ7XgSjq00IM",
  authDomain: "ecommerceapp-f3148.firebaseapp.com",
  projectId: "ecommerceapp-f3148",
  storageBucket: "ecommerceapp-f3148.appspot.com",
  messagingSenderId: "538031361112",
  appId: "1:538031361112:web:45e3608ca85f2410db0e2d",
  measurementId: "G-EH9QRN6C8H",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// export default firebase;
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
