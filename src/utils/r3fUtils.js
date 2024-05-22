import {Center, Environment, PerspectiveCamera, Resize, useGLTF, useTexture} from "@react-three/drei";
import React, {Suspense, useEffect, useMemo, useState} from "react";
import {Color, TextureLoader} from "three";
import {useFrame, useLoader} from "@react-three/fiber";
import {Spin} from "antd";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export const ImageComponent = ({ url }) => {
  const texture = useLoader(TextureLoader, url);

  // Calculate scale based on image dimensions
  const scale = useMemo(() => {
    if (texture.image && texture.image.width && texture.image.height) {
      const { width, height } = texture.image;
      const scaleFactor = 1;
      const aspectRatio = width / height;
      return [aspectRatio * scaleFactor, scaleFactor, 1];
    }
    return [1, 1, 1];
  }, [texture]);

  return (
    <mesh scale={scale}  rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry attach="geometry" args={[1, 1]} />
      <meshBasicMaterial attach="material" map={texture} toneMapped={false} />
    </mesh>
  );
};

export const GLTFModel = ( props ) => {
  const {url} = props;
  const model = useGLTF(url);

  const scene = useMemo(() => {
    return model.scene.clone();
  }, [model]);

  return (
    <Suspense fallback={<Spin tip="Loading" size="large"></Spin>}>
      <Center>
        <Resize>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <primitive object={scene} {...props} />
        </Resize>
      </Center>
    </Suspense>
  );
};

export function Model3d(props) {
  const {path} = props;
  const model = useGLTF(path);

  const scene = useMemo(() => {
    return model.scene.clone();
  }, [model]);

  // useFrame((state, delta) => (scene.rotation.y += delta));
  return (
    <Suspense fallback={<Spin tip="Loading" size="large"></Spin>}>
      <Center>
        <Resize>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <primitive object={scene} {...props} />
        </Resize>
      </Center>
    </Suspense>
  );
}

export function EnvironmentColor({color}) {
  const standardizedColor = color ? new Color(color) : new Color(0xffffff);
  return (
    <>
      <color attach="background" args={[standardizedColor]}/>
      <ambientLight intensity={0.5}/>
      <pointLight position={[20, 30, 10]} intensity={1}/>
      <pointLight position={[-10, -10, -10]} color="blue"/>
      <Environment preset="dawn"/>
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]}/>
    </>
  );
}
