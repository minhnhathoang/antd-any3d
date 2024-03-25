import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

type SodaProps = JSX.IntrinsicElements['group'];

export function Soda(props: SodaProps) {
  const ref = useRef<THREE.Group>();
  const [hovered, spread] = useHover();
  const { nodes, materials } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/soda-bottle/model.gltf');
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta;
    }
  });
  return (
    <group ref={ref} {...props} {...spread} dispose={null}>
      <mesh geometry={nodes.Mesh_sodaBottle.geometry}>
        <meshStandardMaterial color={hovered ? 'red' : 'green'} roughness={0.33} metalness={0.8} envMapIntensity={2} />
      </mesh>
      <mesh geometry={nodes.Mesh_sodaBottle_1.geometry} material={materials.red} material-envMapIntensity={0} />
    </group>
  );
}

function useHover(): [boolean, { onPointerOver: () => void; onPointerOut: () => void }] {
  const [hovered, hover] = useState(false);
  return [
    hovered,
    { onPointerOver: () => hover(true), onPointerOut: () => hover(false) }
  ];
}

type GLTFPrimitiveProps = JSX.IntrinsicElements['primitive'];

export function Duck(props: GLTFPrimitiveProps) {
  const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target-stand/model.gltf');
  return <primitive object={scene} {...props} />;
}

export function Candy(props: GLTFPrimitiveProps) {
  const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/candy-bucket/model.gltf');
  useFrame((state, delta) => {
    if (scene) {
      scene.rotation.z = scene.rotation.y += delta;
    }
  });
  return <primitive object={scene} {...props} />;
}

export function Flash(props: GLTFPrimitiveProps) {
  const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/lightning/model.gltf');
  useFrame((state, delta) => {
    if (scene) {
      scene.rotation.y += delta;
    }
  });
  return <primitive object={scene} {...props} />;
}

export function Apple(props: GLTFPrimitiveProps) {
  const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/candy-bucket/model.gltf');
  useFrame((state, delta) => {
    if (scene) {
      scene.rotation.y += delta;
    }
  });
  return <primitive object={scene} {...props} />;
}

export function Target(props: GLTFPrimitiveProps) {
  const { scene } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target-stand/model.gltf');
  useFrame((state, delta) => {
    if (scene) {
      scene.rotation.y += delta;
    }
  });
  return <primitive object={scene} {...props} />;
}
