import firebase from 'firebase/compat/app';
import 'firebase/compat/database';

const firebaseConfig = {
    apiKey: "AIzaSyBIEZGjfYvZNvxaP2Eo7OK1oTuPgyPNPIM",
    authDomain: "code-assistant-gpt.firebaseapp.com",
    databaseURL: "https://code-assistant-gpt-default-rtdb.firebaseio.com",
    projectId: "code-assistant-gpt",
    storageBucket: "code-assistant-gpt.appspot.com",
    messagingSenderId: "280105900334",
    appId: "1:280105900334:web:8f6a5fbf593aac37e342bf",
    measurementId: "G-N5SGEJD8H1"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  
  export default firebase;