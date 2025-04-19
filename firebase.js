// firebase.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyBaE7DkxwZem1YU284ffPBYsyQt-dEc02Q",
  authDomain: "potuzhnometr-ebe5f.firebaseapp.com",
  databaseURL: "https://potuzhnometr-ebe5f-default-rtdb.firebaseio.com",
  projectId: "potuzhnometr-ebe5f",
  storageBucket: "potuzhnometr-ebe5f.firebasestorage.app",
  messagingSenderId: "351931692227",
  appId: "1:351931692227:web:f24ca3e46586e251ffde76",
  measurementId: "G-XGJSERPV1Y"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);