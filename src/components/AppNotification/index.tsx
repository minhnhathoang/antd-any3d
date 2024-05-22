import React, {useEffect, useState} from 'react';
import {Client, IMessage, StompHeaders} from '@stomp/stompjs';
import {Avatar, notification} from 'antd';
import {BellOutlined} from '@ant-design/icons';
import {useModel} from "@umijs/max";
import moment from "moment";

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const AppNotification: React.FC = () => {

  const {initialState} = useModel('@@initialState');

  const [authenticated, setAuthenticated] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const {notifications, addNotification, removeNotification, setTrigger, trigger} = useModel('noti');

  const {selectedProject} = useModel('project');
  const {getContentListByPage, pageSize, pageIndex, setChanged} = useModel('content');

  const openNotification = (type: NotificationType, title: string, message: string) => {
    api[type]({
      message: title,
      description: message,
    });
  };

  useEffect(() => {
    console.log("AppNotification useEffect" + selectedProject);
  }, [selectedProject]);

  const extractEventType = (type: any) => {
    const eventType = type.split('.').pop().replace('Event', '');
    return eventType.replace(/([a-z])([A-Z])/g, '$1 $2');
  };


  const handleWebsocketMessage = (message: IMessage) => {
    const body = JSON.parse(message.body);
    console.log('Received message:', body);

    // openNotification('info', body.type, body.message)

    notification.info({
      message: (
        <div>
          <span>{extractEventType(body.type)}</span>
        </div>
      ),
      description: moment(body.createdAt).format('h:mm A'),
      placement: 'topRight',
      duration: 9
    });

    if (body.type === 'org.nhathm.dto.domainevent.ContentCreatedEvent') {
      addNotification(body);
      setTrigger(!trigger);
    }
  }

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
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
  }, [initialState?.currentUser, initialState?.loading]);

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
