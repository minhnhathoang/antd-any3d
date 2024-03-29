import React, {useState} from "react";
import {Card, theme, Image, Modal, Typography, Drawer, Space} from "antd";
import {
  DeleteFilled,
  DownloadOutlined, EditFilled,
  EditOutlined, EditTwoTone,
  EllipsisOutlined,
  FolderAddFilled,
  SettingOutlined
} from "@ant-design/icons";
import {Button} from "antd/lib";
import {
  Environment,
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  PerspectiveCamera,
  Preload,
  View
} from "@react-three/drei";

import {Model3d, ModelAndTarget} from "@/components/CardModel"
import useStyles from "@/pages/projects/style.style";
import {Duck} from "@/components/ModelCard/models";
import dayjs from "dayjs";
import AvatarList from "@/pages/projects/components/AvatarList";
import moment from "moment/moment";
import {Canvas} from "@react-three/fiber";

const {Paragraph} = Typography;


const {Meta} = Card;

const AssetCard: React.FC<{
  fileName: string;
  fileSize: number;
  url: string;
}> = ({fileName, fileSize, url}) => {


  const {styles} = useStyles();

  const [open, setOpen] = useState(false);

  const {useToken} = theme;
  const {token} = useToken();

  return (
    <>
      <Card className={styles.card} hoverable
            cover={
              <div style={{height: 250}}>
                <View className="view" style={{height: 250, width: 300, margin: 10}}>
                  <Common color="lightgray"/>
                  <Model3d
                    path="http://localhost:9000/common/model.gltf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20240326%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240326T140234Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=bb6c92f3d23cddcfc4f7d059d38be2b4d954937d93a14a0c357ff08c120c44bd"
                    position={[0, 1, 0]} scale={1}/>
                  <OrbitControls/>
                </View>
              </div>
            }
            actions={[
              <DownloadOutlined/>,
              <DeleteFilled/>,
              <FolderAddFilled/>,
              <EditFilled onClick={() => setOpen(true)}/>
            ]}
      >
        <Card.Meta
          title={<a>{fileName}</a>}
          description={
            <Paragraph
              ellipsis={{
                rows: 2,
              }}
            >
              {fileSize}
            </Paragraph>
          }
        />
        <div className={styles.cardItemContent}>
          <span>{dayjs().subtract(3, 'day').fromNow()}</span>
        </div>

        <Modal
          title={fileName}
          centered
          open={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          width={900}
          forceRender
        >
          <p>some contents...</p>
          <p>some contents...</p>
          <p>some contents...</p>
          <div style={{height: 250, width: 300}}>
            <View className="view" style={{height: 250, width: 300, margin: 10}}>
              <Common color="lightgray"/>
              <Model3d
                path="http://localhost:9000/common/model.gltf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20240326%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240326T140234Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=bb6c92f3d23cddcfc4f7d059d38be2b4d954937d93a14a0c357ff08c120c44bd"
                position={[0, 1, 0]} scale={1}/>
              <OrbitControls/>
            </View>
          </div>
        </Modal>
      </Card>
    </>
  );
};

function Common({color}) {
  return (
    <>
      {color && <color attach="background" args={[color]}/>}
      <ambientLight intensity={0.5}/>
      <pointLight position={[20, 30, 10]} intensity={1}/>
      <pointLight position={[-10, -10, -10]} color="blue"/>
      <Environment preset="dawn"/>
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]}/>
    </>
  )
}

export default AssetCard;
