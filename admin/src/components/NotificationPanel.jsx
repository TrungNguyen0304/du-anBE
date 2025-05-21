import React, { useState, useEffect } from "react";
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemSecondaryAction,
  IconButton as MIconButton,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`/api/notifications/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (Array.isArray(res.data)) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n) => !n.isRead).length);
      } else {
        console.error("Unexpected response format:", res.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  useEffect(() => {
    if (!userId) return;

    initializeSocket(userId);

    onNotification((data) => {
      const newNotif = {
        ...data,
        timestamp: new Date(),
        isRead: false,
        _id: data._id || `${Date.now()}-${Math.random()}`,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.info(`${data.message || data.name} - ${data.type}`, {
        position: "top-right",
      });
    });

    requestNotificationPermission(userId);

    onMessageListener().then((payload) => {
      const { title, body } = payload.notification;
      const newNotif = {
        title,
        message: body,
        timestamp: new Date(),
        isRead: false,
        _id: `${Date.now()}-${Math.random()}`,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      toast.info(`${title}: ${body}`, { position: "top-right" });
    });

    fetchNotifications();

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
        <List sx={{ width: 350, maxHeight: 400, overflow: "auto" }}>
          {Array.isArray(notifications) && notifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          ) : (
            notifications.map((notif, index) => (
              <ListItem key={notif._id || index} divider>
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
                <ListItemSecondaryAction>
                  {!notif.isRead && (
                    <MIconButton edge="end" onClick={() => markAsRead(notif._id)}>
                      <DoneIcon fontSize="small" color="primary" />
                    </MIconButton>
                  )}
                  <MIconButton edge="end" onClick={() => deleteNotification(notif._id)}>
                    <DeleteIcon fontSize="small" color="error" />
                  </MIconButton>
                </ListItemSecondaryAction>
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