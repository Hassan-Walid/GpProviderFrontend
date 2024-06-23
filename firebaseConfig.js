// import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBp-X1zFbCyzWv3IY9JfbHPOo_o-yXmc8o",
    authDomain: "tiatro-ticketsecommerce.firebaseapp.com",
    projectId: "tiatro-ticketsecommerce",
    storageBucket: "tiatro-ticketsecommerce.appspot.com",
    messagingSenderId: "984907901883",
    appId: "1:984907901883:web:0216759da2c15e55ee329e",
    measurementId: "G-6PHL2J93VY"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export { firebase }
