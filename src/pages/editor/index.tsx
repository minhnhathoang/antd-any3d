import React, {useEffect} from 'react';
import {Client, StompHeaders} from '@stomp/stompjs';
import {notification} from "antd";

const WebSocketComponent: React.FC = () => {
  type NotificationType = 'success' | 'info' | 'warning' | 'error';


  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type: NotificationType, message: string) => {
    api[type]({
      message: 'Notification Title',
      description: message
    })
  };


  useEffect(() => {

    const headers: StompHeaders = {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    };

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: headers,
      onConnect: () => {
        console.log('Connected to WebSocket server');
        client.subscribe('/user/queue/notify', message =>
          console.log('Received message:', message.body)
          // openNotificationWithIcon('success', message.body)
        );
      },
      onWebSocketError: error => {
        console.log('Error:', error);
      },
      onWebSocketClose: () => {
        console.log('Connection closed');
      },
      onChangeState: state => {
        console.log('State changed:', state);
      }
    });

    client.activate();
  }, []);

  return <div>
    {contextHolder}
    WebSocket Component</div>;
};

export default WebSocketComponent;
