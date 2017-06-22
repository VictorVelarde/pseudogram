import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyC0tBzylfXIcqK454NptzUkn13_D7n8W8g",
    authDomain: "pseudogram-b9be1.firebaseapp.com",
    databaseURL: "https://pseudogram-b9be1.firebaseio.com",
    projectId: "pseudogram-b9be1",
    storageBucket: "pseudogram-b9be1.appspot.com",
    messagingSenderId: "697177797490"
    };
firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

