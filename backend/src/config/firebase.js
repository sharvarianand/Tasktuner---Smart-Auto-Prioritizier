const path = require('path');
require('dotenv').config();

const admin = require('firebase-admin');


const serviceAccountPath = path.resolve(__dirname, '../../', process.env.FIREBASE_CRED_PATH || 'firebase-service-account.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://tasktuner-9dd7b.firebaseio.com'
});

const db = admin.firestore();

db.settings({ ignoreUndefinedProperties: true });

module.exports = db;
