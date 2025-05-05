const admin = require("firebase-admin");
const serviceAccount = require("../backend-api-5a7e6-firebase-adminsdk-fbsvc-30391d59ba.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (token, title, body) => {
  const message = {
    token, 
    notification: {
      title,
      body
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log(" Notification sent:", response);
  } catch (error) {
    console.error(" Error sending FCM notification:", error.message);
  }
};

module.exports = { sendNotification };