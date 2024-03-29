import {useState, useRef, useMemo} from 'react'
import {Center, GizmoHelper, GizmoViewcube, GizmoViewport, Resize, useGLTF} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'

export function Soda(props) {
  const ref = useRef()
  const [hovered, spread] = useHover()
  const {
    nodes,
    materials
  } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/soda-bottle/model.gltf')
  useFrame((state, delta) => (ref.current.rotation.y += delta))
  return (
    <group ref={ref} {...props} {...spread} dispose={null}>
      <mesh geometry={nodes.Mesh_sodaBottle.geometry}>
        <meshStandardMaterial color={hovered ? 'red' : 'green'} roughness={0.33} metalness={0.8} envMapIntensity={2}/>
      </mesh>
      <mesh geometry={nodes.Mesh_sodaBottle_1.geometry} material={materials.red} material-envMapIntensity={0}/>
    </group>
  )
}

function useHover() {
  const [hovered, hover] = useState(false)
  return [hovered, {onPointerOver: (e) => hover(true), onPointerOut: () => hover(false)}]
}

export function Duck(props) {
  const {scene} = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/duck/model.gltf')
  return <primitive object={scene} {...props} />
}

export function Candy(props) {
  const {scene} = useGLTF('http://localhost:9000/common/model.gltf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20240325%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240325T100352Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=0dc31effb9f4409f82bdf2a3402caccd61d4fdcf4862a6f68bdb67a54e50de87')
  useFrame((state, delta) => (scene.rotation.z = scene.rotation.y += delta))
  return <primitive object={scene} {...props} />
}

export function Flash(props) {
  const {scene} = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/candy-bucket/model.gltf')
  useFrame((state, delta) => (scene.rotation.y += delta))
  return <primitive object={scene} {...props} />
}

export function Apple(props) {
  const {scene} = useGLTF('http://localhost:9000/common/model.gltf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20240325%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240325T100352Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=0dc31effb9f4409f82bdf2a3402caccd61d4fdcf4862a6f68bdb67a54e50de87')
  useFrame((state, delta) => (scene.rotation.y += delta))
  return <primitive object={scene} {...props} />
}

export function Target(props) {
  const {scene} = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/target-stand/model.gltf')
  useFrame((state, delta) => (scene.rotation.y += delta))
  return <primitive object={scene} {...props} />
}

export function Model3d(props) {
  const {path} = props;
  const model = useGLTF(path);

  const scene = useMemo(() => {
    return model.scene.clone();
  }, [model]);

  useFrame((state, delta) => (scene.rotation.y += delta));
  return (
    <Center>
      <Resize scale={1}>
        <primitive object={scene} {...props} />
      </Resize>
    </Center>
  );
}

export function ModelAndTarget(props) {
  const {path} = props;
  const model = useGLTF(path);

  const scene = useMemo(() => {
    return model.scene.clone();
  }, [model]);

  useFrame((state, delta) => (scene.rotation.y += delta));
  return (
    <GizmoHelper
      alignment="bottom-right"
      margin={[80, 80]}
    >
      <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black"/>
      <GizmoViewcube/>
    </GizmoHelper>
  );
}
