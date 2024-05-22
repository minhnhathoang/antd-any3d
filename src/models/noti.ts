import { useState } from 'react';

export interface Notification {
  id: number;
  message: string;
}

export default () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [trigger, setTrigger] = useState<boolean>(false);

  const addNotification = (notification: Notification) => {
    setNotifications((prevNotifications) => [...prevNotifications, notification]);
    console.log("Notification added", notification);
    setTrigger(true);
  };

  const removeNotification = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
    console.log("Notification removed", id);
  };

  return {
    trigger,
    setTrigger,
    notifications,
    addNotification,
    removeNotification,
  };
}
