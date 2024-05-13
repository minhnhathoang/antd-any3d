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
import useStyles from "@/pages/project/style.style";
import {Duck} from "@/components/ModelCard/models";
import dayjs from "dayjs";
import AvatarList from "@/pages/projects/components/AvatarList";
import moment from "moment/moment";
import {Canvas} from "@react-three/fiber";
import { ModalForm } from "@ant-design/pro-components";

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
                    path="http://127.0.0.1:9000/common/model.gltf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=R4O9G1T7UA63H8DPH00X%2F20240414%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240414T082657Z&X-Amz-Expires=43200&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJSNE85RzFUN1VBNjNIOERQSDAwWCIsImV4cCI6MTcxMzEyNjQwMywicGFyZW50IjoibWluaW9hZG1pbiJ9.PStNab9tkbWep3oAK3p4Cph1AMerzU-Ij8bZwHYfF2lLzpfFIb0E4seRSLexq57n27i8livQWNW48R0hlKMAqA&X-Amz-SignedHeaders=host&versionId=418338c3-d7f3-4322-87b0-164d0cce1f49&X-Amz-Signature=07f796598f3858632fd658d23c95af4695caddb780ad32508020c2996e2eedd0"
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

        {/*<Modal*/}
        {/*  title={fileName}*/}
        {/*  centered*/}
        {/*  open={open}*/}
        {/*  onOk={() => setOpen(false)}*/}
        {/*  onCancel={() => setOpen(false)}*/}
        {/*  width={900}*/}
        {/*  forceRender*/}
        {/*>*/}
        {/*  <p>some contentsdddddddddddddddddddđ...</p>*/}
        {/*  <p>some contents.dddddddddddddddsâdsads..</p>*/}
        {/*  <View className="view" style={{height: 250, width: 300, margin: 10}}>*/}
        {/*    <Common color="lightgray"/>*/}
        {/*    <Model3d*/}
        {/*      path="http://127.0.0.1:9000/common/model.gltf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=R4O9G1T7UA63H8DPH00X%2F20240414%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240414T082657Z&X-Amz-Expires=43200&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJSNE85RzFUN1VBNjNIOERQSDAwWCIsImV4cCI6MTcxMzEyNjQwMywicGFyZW50IjoibWluaW9hZG1pbiJ9.PStNab9tkbWep3oAK3p4Cph1AMerzU-Ij8bZwHYfF2lLzpfFIb0E4seRSLexq57n27i8livQWNW48R0hlKMAqA&X-Amz-SignedHeaders=host&versionId=418338c3-d7f3-4322-87b0-164d0cce1f49&X-Amz-Signature=07f796598f3858632fd658d23c95af4695caddb780ad32508020c2996e2eedd0"*/}
        {/*      position={[0, 1, 0]} scale={1}/>*/}
        {/*    <OrbitControls/>*/}
        {/*  </View>*/}

        {/*  <Canvas*/}
        {/*    frameloop="always"*/}
        {/*    style={{position: 'fixed', top: 0, bottom: 0, left: 0, right: 0}}*/}
        {/*    eventSource={document.getElementsByTagName("body")[0]}*/}
        {/*  >*/}
        {/*    <Common color="lightgray"/>*/}
        {/*    <Model3d*/}
        {/*      path="http://127.0.0.1:9000/common/model.gltf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=R4O9G1T7UA63H8DPH00X%2F20240414%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240414T082657Z&X-Amz-Expires=43200&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJSNE85RzFUN1VBNjNIOERQSDAwWCIsImV4cCI6MTcxMzEyNjQwMywicGFyZW50IjoibWluaW9hZG1pbiJ9.PStNab9tkbWep3oAK3p4Cph1AMerzU-Ij8bZwHYfF2lLzpfFIb0E4seRSLexq57n27i8livQWNW48R0hlKMAqA&X-Amz-SignedHeaders=host&versionId=418338c3-d7f3-4322-87b0-164d0cce1f49&X-Amz-Signature=07f796598f3858632fd658d23c95af4695caddb780ad32508020c2996e2eedd0"*/}
        {/*      position={[0, 1, 0]} scale={1}/>*/}
        {/*    <OrbitControls/>*/}
        {/*  </Canvas>*/}
        {/*</Modal>*/}


        <ModalForm<{
          name: string;
          company: string;
        }>
          title="新建表单"
          trigger={
            <Button type="primary">
              新建表单
            </Button>
          }
          autoFocusFirstInput
          modalProps={{
            destroyOnClose: true,
            onCancel: () => console.log('run'),
          }}
          submitTimeout={2000}
        >
          <div style={{height: 500, width: 300}}>
            <Canvas
              frameloop="always"
              style={{ top: 0, bottom: 0, left: 0, right: 0}}
              eventSource={document.getElementsByTagName("body")[0]}
            >
              <Common color="lightgray"/>
              <Model3d
                path="http://127.0.0.1:9000/common/model.gltf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=R4O9G1T7UA63H8DPH00X%2F20240414%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240414T082657Z&X-Amz-Expires=43200&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJSNE85RzFUN1VBNjNIOERQSDAwWCIsImV4cCI6MTcxMzEyNjQwMywicGFyZW50IjoibWluaW9hZG1pbiJ9.PStNab9tkbWep3oAK3p4Cph1AMerzU-Ij8bZwHYfF2lLzpfFIb0E4seRSLexq57n27i8livQWNW48R0hlKMAqA&X-Amz-SignedHeaders=host&versionId=418338c3-d7f3-4322-87b0-164d0cce1f49&X-Amz-Signature=07f796598f3858632fd658d23c95af4695caddb780ad32508020c2996e2eedd0"
                position={[0, 1, 0]} scale={1}/>
              <OrbitControls/>
            </Canvas>
          </div>
        </ModalForm>

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
