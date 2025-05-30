const admin = require("firebase-admin");

let serviceAccount;

try {
  const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8");
  serviceAccount = JSON.parse(decoded);
} catch (error) {
  console.error("Lỗi khi decode hoặc parse biến FIREBASE_SERVICE_ACCOUNT_BASE64:", error.message);
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
    console.log("Notification sent:", response);
  } catch (error) {
    console.error("Error sending FCM notification:", error.message);
  }
};

module.exports = { sendNotification };
