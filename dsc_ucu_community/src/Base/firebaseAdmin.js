const admin = require('firebase-admin');
const serviceAccount = require('../../../../final-sem-project-382107-firebase-adminsdk-8jp54-da790bbed4.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://final-sem-project-382107-default-rtdb.firebaseio.com/'
});

// Function to set custom claims for a user
async function setCustomClaims(uid, customClaims) {
  try {
    await admin.auth().setCustomUserClaims(uid, customClaims);
    console.log(`Custom claims set for user ${uid}`);
  } catch (error) {
    console.error(`Error setting custom claims for user ${uid}:`, error);
  }
}

module.exports = {
  setCustomClaims
};
