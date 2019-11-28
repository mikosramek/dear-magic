import firebase from 'firebase/app';
import 'firebase/database';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVaqoPIZyr-D_QY1-HFaa64dUt7F6bnfQ",
  authDomain: "miko-sramek-project-five.firebaseapp.com",
  databaseURL: "https://miko-sramek-project-five.firebaseio.com",
  projectId: "miko-sramek-project-five",
  storageBucket: "miko-sramek-project-five.appspot.com",
  messagingSenderId: "945213463136",
  appId: "1:945213463136:web:9ac00d9dafc605b7a30105"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default firebase;