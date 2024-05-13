import React, {useEffect, useState} from 'react';
import {Client, IMessage, StompHeaders} from '@stomp/stompjs';
import {notification} from 'antd';
import {BellOutlined} from '@ant-design/icons';
import {handleWebsocketMessage} from "@/components/AppNotification/eventHandler";
import {useModel} from "@umijs/max";
import {useFrame} from "@react-three/fiber";

type NotificationType = 'success' | 'info' | 'warning' | 'error';


type BaseEvent = {
  id: string;
  createdAt: string;
  type: string;
}

const AppNotification: React.FC = () => {

  const [authenticated, setAuthenticated] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const {selectedProject} = useModel('project');
  const {getContentListByPage, pageSize, pageIndex, setChanged } = useModel('content');

  const openNotification = (type: NotificationType, title: string, message: string) => {
    api[type]({
      message: title,
      description: message,
    });
  };

  const handleWebsocketMessage = (message: IMessage) => {
    const body = JSON.parse(message.body);
    console.log('Received message:', body);

    openNotification('info', body.type, body.message)

    console.log("current: ", JSON.stringify(selectedProject))

    if (body.type === 'org.nhathm.dto.domainevent.ContentCreatedEvent') {
      setChanged(true);
    }
  }

  useEffect(() => {
    console.log("selectedProject: ", selectedProject)
  }, [selectedProject]);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      // Nếu không xác thực, không tạo WebSocket
      return;
    }

    const headers: StompHeaders = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Tạo WebSocket client khi xác thực thành công
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: headers,
      onConnect: () => {
        console.log('Connected to WebSocket server');
        client.subscribe('/user/queue/notify', (message) => {
          console.log('Received message:', message.body);
          handleWebsocketMessage(message);
        });
      },
      onWebSocketError: (error) => {
        console.log('onWebsocketError', error);
      },
      onWebSocketClose: () => {
        console.log('onWebSocketClose', 'Connection closed');
      },
      onChangeState: (state) => {
        console.log('onChangeState', 'State changed:', state);
      },
    });

    // Kích hoạt client
    client.activate();

    // Đánh dấu đã xác thực thành công
    setAuthenticated(true);

    // Hủy kết nối WebSocket khi component unmount
    return () => {
      if (client && client.connected) {
        client.deactivate();
      }
    };
  }, []);

  // Nếu chưa xác thực, không hiển thị component
  if (!authenticated) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
    >
      {contextHolder}
      <BellOutlined/>
    </div>
  );
};

export default AppNotification;
