const admin = require("firebase-admin");

let serviceAccount;

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (error) {
  console.error("Lỗi khi parse biến FIREBASE_SERVICE_ACCOUNT:", error.message);
  process.exit(1); // Dừng server nếu có lỗi
}

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
