import React from "react";
import {Row, Col} from "antd";

import {
  OrbitControls,
} from "@react-three/drei";

import {Model3d} from "@/components/CardModel";
import {Canvas} from "@react-three/fiber";
import {formatBytes} from "@/utils/fileUtils";
import {EnvironmentColor} from "@/utils/r3fUtils.js";

const DetailsView: React.FC<{
  content: Content;
}> = ({content}) => {
  return (
    <div style={{display: "flex"}}>
      <div style={{
        width: "60%",
        height: "500px",
        marginRight: '40px',
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
          <Canvas>
            <EnvironmentColor color="white"/>
            <Model3d
              path={content.hologram.url}
            />
            <OrbitControls/>
          </Canvas>
        )}
        {/*{["application/octet-stream"].includes(content.hologram.contentType) && (*/}
        {/*  <Canvas>*/}
        {/*    <EnvironmentColor color="white"/>*/}
        {/*    <Model3dWithoutClone*/}
        {/*      path={content.hologram.url}*/}
        {/*    />*/}
        {/*    <OrbitControls/>*/}
        {/*  </Canvas>*/}
        {/*)}*/}
        {content.hologram.contentType === "video/mp4" && (
          <video
            src={content.hologram.url}
            controls
            style={{width: "100%"}}
          />
        )}
      </div>

      <div style={{width: "35%", overflow: "hidden"}}>
        <Row gutter={[12, 48]} style={{marginBottom: "12px"}}>
          <Col span={8}><b>Filename</b></Col>
          <Col span={16}>{content.name}</Col>
        </Row>

        <Row gutter={[12, 48]} style={{marginBottom: "12px"}}>
          <Col span={8}><b>File Type</b></Col>
          <Col span={16}>{content.hologram.contentType}</Col>
        </Row>

        <Row gutter={[12, 48]} style={{marginBottom: "12px"}}>
          <Col span={8}><b>File Size</b></Col>
          <Col span={16}> {formatBytes(content.hologram.size)}</Col>
        </Row>

        <Row gutter={[12, 48]} style={{marginBottom: "12px"}}>
          <Col span={8}><b>Owner</b></Col>
          <Col span={16}>{content.owner.email}</Col>
        </Row>

        <Row gutter={[12, 48]} style={{marginBottom: "12px"}}>
          <Col span={8}><b>Modified At</b></Col>
          <Col span={16}>{content.lastModifiedAt}</Col>
        </Row>

        <Row gutter={[12, 48]} style={{marginBottom: "12px"}}>
          <Col span={8}><b>Created At</b></Col>
          <Col span={16}>{content.createdAt}</Col>
        </Row>

        <Row gutter={[12, 48]} style={{marginBottom: "12px"}}>
          <Col span={8}><b>Asset ID</b></Col>
          <Col span={16}>{content.hologram.id}</Col>
        </Row>
      </div>
    </div>
  );
};

export default DetailsView;
