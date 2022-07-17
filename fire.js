// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-database.js";

const config = {
    apiKey: "AIzaSyA6kQCBWrMfhOU0UrTQl4FGfgDjf3S3QiI",
    authDomain: "bibel7.firebaseapp.com",
    databaseURL: "https://bibel7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "bibel7",
    storageBucket: "bibel7.appspot.com",
    messagingSenderId: "361153938395",
    appId: "1:361153938395:web:635cfdb14ba53be850ddfe"
  };

const app = initializeApp(config);
const db = getDatabase(app);
const r = ref(db)

console.log(get(child(r, "bible/0/0/0"))).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("no data");
    }
  }).catch((error) => {
    console.error(error);
  });