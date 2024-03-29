import {PageContainer} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import {Card, theme} from 'antd';
import React from 'react';

import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';
import {Avatar} from 'antd';
import {Environment, OrbitControls, PerspectiveCamera, PivotControls, Preload, View} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import {Test} from "./Test.js";
import {Model3d} from "@/components/CardModel"
import AssetCard from "@/pages/content/asset/components/AssetCard";
import {Image} from '@react-three/drei'


import {memo} from 'react'
import {
  Grid,
  Center,
  GizmoHelper,
  GizmoViewport,
  AccumulativeShadows,
  RandomizedLight,
  useGLTF
} from '@react-three/drei'
import {useControls} from 'leva'


const {Meta} = Card;

const Shadows = memo(() => (
  <AccumulativeShadows temporal frames={100} color="#9d4b4b" colorBlend={0.5} alphaTest={0.9} scale={20}>
    <RandomizedLight amount={8} radius={4} position={[5, 5, -10]}/>
  </AccumulativeShadows>
))

const Welcome: React.FC = () => {
  const {token} = theme.useToken();
  const {initialState} = useModel('@@initialState');

  const {gridSize, ...gridConfig} = useControls({
    name: "editor",
    gridSize: [10.5, 10.5],
    cellSize: {value: 0.6, min: 0, max: 10, step: 0.1},
    cellThickness: {value: 1, min: 0, max: 5, step: 0.1},
    cellColor: '#6f6f6f',
    sectionSize: {value: 3.3, min: 0, max: 10, step: 0.1},
    sectionThickness: {value: 1.5, min: 0, max: 5, step: 0.1},
    sectionColor: '#9d4b4b',
    fadeDistance: {value: 25, min: 0, max: 100, step: 1},
    fadeStrength: {value: 1, min: 0, max: 1, step: 0.1},
    followCamera: false,
    infiniteGrid: true
  })

  const {rotation, position, imgScale} = useControls({
    rotation: [0, 0, 0],
    position: [0, 0, 0],
    imgScale: 1
  })

  return (
    <PageContainer>
      <Canvas
        style={{top: 0, bottom: 0, left: 0, right: 0, width: '100%', height: "500px"}}>

        <group>
          <Image
            opacity={0.5}
            position={[
              0,
              0,
              0
            ]}
            scale={[
              imgScale,
              imgScale,
              imgScale
            ]}
            rotation={[-Math.PI/2, 0, 0]}
            url="data:image/jpeg;base64,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"/>
          <Common color="lightgray"/>

          <group rotation={rotation} position={position}>
            <Model3d
              path="http://localhost:9000/common/model.gltf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20240326%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240326T140234Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=bb6c92f3d23cddcfc4f7d059d38be2b4d954937d93a14a0c357ff08c120c44bd"/>
          </group>

          <gridHelper
          />
        </group>

        <OrbitControls makeDefault/>
      </Canvas>
    </PageContainer>
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

export default Welcome;
