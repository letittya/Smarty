//necessary functions from the Firebase SDK to initialize the app and get the database service
import { initializeApp } from "firebase/app";
import {getDatabase} from 'firebase/database'
//import { getAnalytics } from "firebase/analytics";

// firebase configuration taken directly from firebase 
const firebaseConfig = {
    apiKey: "AIzaSyDS-no7jgHMXU9JzBH16TMt65XWItCGlY4", //authenticates requests 
    authDomain: "smarty-lock.firebaseapp.com",  
    databaseURL: "https://smarty-lock-default-rtdb.firebaseio.com",
    projectId: "smarty-lock",
    storageBucket: "smarty-lock.appspot.com", // google cloud storage 
    messagingSenderId: "565598666114", //messaging 
    appId: "1:565598666114:web:a0dee97340569fb949239b",
    measurementId: "G-ERPCEVT24X" // for analytics 
};

//initialize firebase app
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
//const analytics = getAnalytics(app);

//export in order to use it in other files 
export {db};