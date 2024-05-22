import React, {useEffect, useState} from "react";
import {Card, theme, Image, Modal, Typography, Drawer, Space, Input, Dropdown} from "antd";
import {
  DeleteFilled,
  DownloadOutlined, DownOutlined, EditFilled,
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
  View
} from "@react-three/drei";


import {Model3d, Model3dWithoutClone} from "@/components/CardModel"
import {Canvas} from "@react-three/fiber";
import {ModalForm} from "@ant-design/pro-components";
import {Tooltip} from 'antd';
import useStyles from "@/pages/content/components/CardContent/style.style";
import {formatBytes} from "@/utils/fileUtils";
import CardContentModal from "@/pages/content/components/CardContentModal";
import {truncated} from "@/utils/stringUtils";
import {useModel} from "@umijs/max";

const {Paragraph} = Typography;

const CardContent: React.FC<{
  content: Content,
  onUpdateContent: (content: any) => void
}> = ({content, onUpdateContent}) => {

  const {updateContent, deleteContent} = useModel('content')

  const {styles} = useStyles();
  const [open, setOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [filename, setFilename] = useState(content.name);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    setEditMode(false);
    if (filename === content.name) {
      return;
    }
    if (filename === "") {
      setFilename(content.name);
      return;
    }
    const res = await updateContent(content.id, {name: filename});
    if (res?.success) {
      content.name = filename;
      onUpdateContent(content);
    }
  };

  const editAndDelete = (key: string | number, currentItem: Content) => {
    if (key === 'edit') {
      // showEditModal(currentItem);
    } else if (key === 'delete') {
      Modal.confirm({
        title: 'Delete Content',
        content: 'Are you sure you want to delete this content?',
        okText: 'Confirm',
        cancelText: 'Cancel',
        onOk: () => {
          deleteContent(currentItem.id)
        },
      });
    }
  };

  const ActionBtn: React.FC<{
    item: ContentCO;
  }> = ({item}) => (
    <Dropdown
      menu={{
        onClick: ({key}) => editAndDelete(key, item),
        items: [
          // {
          //   key: 'edit',
          //   label: 'Edit',
          // },
          {
            key: 'delete',
            label: 'Delete',
          },
        ],
      }}
    >
      <EllipsisOutlined style={{fontSize: 24}}/>
    </Dropdown>
  );


  return (
    <>
      <Tooltip placement="top" title={'Double click to open detail view'}>
        <Card hoverable
              cover={
                <div style={{
                  width: 280,
                  height: 250,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {["image/jpeg", "image/png"].includes(content.hologram.contentType) && (
                    <img
                      src={content.hologram.url}
                      style={{width: "100%", height: "100%", objectFit: "contain"}}
                    />
                  )}

                  {["model/gltf+json", "model/gltf-binary"].includes(content.hologram.contentType) && (
                    <View className="view" style={{width: 280, height: 250, margin: "5px 5px 5px 5px"}}>
                      <Common color="white"/>
                      <Model3d
                        path={content.hologram.url}/>
                      <OrbitControls/>
                    </View>
                  )}

                  {content.hologram.contentType === "video/mp4" && (
                    <video
                      src={content.hologram.url}
                      controls
                      style={{maxHeight: "100%", maxWidth: "100%"}}
                    />
                  )}
                  {content.hologram.contentType !== "image/jpeg" &&
                    content.hologram.contentType !== "image/png" &&
                    content.hologram.contentType !== "model/gltf+json" &&
                    content.hologram.contentType !== "model/gltf-binary" &&
                    // content.hologram.contentType !== "application/octet-stream" &&
                    content.hologram.contentType !== "video/mp4" && (
                      <p>Unsupported file type</p>
                    )}
                </div>

              }
              onDoubleClick={() => {
                setFilename(content.name)
                setOpen(true);
              }}
              style={{margin: 5}}
              styles={{
                cover: {margin: '0px 0px 10px 0px', paddingBottom: 0, borderRadius: 20},
                body: {padding: '5px 15px'},
              }}
              className={styles.card}
        >
          <Card.Meta
            title={<a>{truncated(content.name, 20)}</a>}
            description={
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Paragraph
                  ellipsis={{
                    rows: 1,
                  }}
                  style={{margin: 0}}
                >
                  {formatBytes(content.hologram.size)}
                </Paragraph>
                <ActionBtn item={content}/>
              </div>
            }
          />

          <ModalForm
            open={open}
            title={
              editMode ? (
                <Input
                  size={"large"}
                  style={{fontSize: 28, minWidth: 300, maxWidth: 500}}
                  value={filename}
                  onChange={(e) => {
                    setFilename(e.target.value)
                  }}
                  autoFocus
                  onPressEnter={handleSave}
                  onBlur={handleSave}
                />
              ) : (
                <div style={{display: "flex", alignItems: "center"}}>
                  <span style={{fontSize: 28}}>{filename}</span>
                  <EditOutlined
                    style={{marginLeft: 10, cursor: "pointer", fontSize: 24}}
                    onClick={handleEdit}
                  />
                </div>
              )
            }
            submitter={false}
            autoFocusFirstInput
            modalProps={{
              footer: null,
              destroyOnClose: true,
              onCancel: () => {
                console.log("onCancel");
                setOpen(false)
              },
              onOk: () => {
                console.log("onOk");
                setOpen(false);
              },
              transitionName: "",
              width: 1200,
              centered: true,
            }}
            style={{height: "550px"}}
          >
            <CardContentModal content={content}/>
          </ModalForm>

        </Card>
      </Tooltip>
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

export default CardContent;
