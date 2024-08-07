// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpBMlMtN4J88_qzvTImB2P4FyNC8RVXvk",
  authDomain: "inventory-management-29e19.firebaseapp.com",
  projectId: "inventory-management-29e19",
  storageBucket: "inventory-management-29e19.appspot.com",
  messagingSenderId: "708656141262",
  appId: "1:708656141262:web:f93281532bef12ab6c519f",
  measurementId: "G-0X78RDM576"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

const storage =   getStorage(app)

export {firestore,storage};

/*  allow read, write: if
          request.time < timestamp.date(2024, 9, 5)*/