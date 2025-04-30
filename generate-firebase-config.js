const fs = require('fs');
const path = require('path');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const configFileContent = `
// This file is auto-generated during build
const firebaseConfig = ${JSON.stringify(firebaseConfig, null, 2)};
`;


fs.writeFileSync(
  path.join(__dirname, './public/firebase-config.js'),
  configFileContent
);

console.log('Firebase config file generated successfully');