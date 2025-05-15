import React, { useState, useEffect } from "react";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  initializeSocket,
  onNotification,
  disconnectSocket,
} from "../services/socketService";
import {
  onMessageListener,
  requestNotificationPermission,
} from "../services/notificationService";

const NotificationPanel = ({ userId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    // Khởi tạo Socket.IO
    initializeSocket(userId);

    // Lắng nghe thông báo từ Socket.IO
    onNotification((data) => {
      setNotifications((prev) => [{ ...data, timestamp: new Date() }, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.info(`${data.message || data.name} - ${data.type}`, {
        position: "top-right",
      });
    });

    // Yêu cầu quyền thông báo và lưu FCM token
    requestNotificationPermission(userId);
    onMessageListener().then((payload) => {
      const { title, body } = payload.notification;
      setNotifications((prev) => [
        { title, message: body, timestamp: new Date() },
        ...prev,
      ]);
      setUnreadCount((prev) => prev + 1);
      toast.info(`${title}: ${body}`, { position: "top-right" });
    });

    return () => disconnectSocket();
  }, [userId]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <List sx={{ width: 300, maxHeight: 400, overflow: "auto" }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          ) : (
            notifications.map((notif, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={notif.title || notif.name}
                  secondary={
                    <>
                      <Typography variant="body2">{notif.message}</Typography>
                      <Typography variant="caption">
                        {new Date(notif.timestamp).toLocaleString()}
                      </Typography>
                    </>
                  }
                  secondaryTypographyProps={{ component: "div" }}
                />
              </ListItem>
            ))
          )}
        </List>
      </Popover>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default NotificationPanel;