import {useState, useRef} from 'react'
import {Canvas, addEffect} from '@react-three/fiber'
import {
  View,
  Preload,
  OrbitControls,
  PerspectiveCamera,
  CameraShake,
  PivotControls,
  Environment,
  Center
} from '@react-three/drei'
import {Soda, Apple, Duck, Candy, Flash, Target, Model3d} from "@/components/CardModel"

export function Test() {
  return (
    <>
          <View className="view scale" style={{height: 300, width: 300}}>
            <Common color="lightgray"/>
            <Model3d path="http://localhost:9000/common/model.gltf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minioadmin%2F20240325%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240325T100352Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=0dc31effb9f4409f82bdf2a3402caccd61d4fdcf4862a6f68bdb67a54e50de87"/>
            <OrbitControls makeDefault/>
          </View>
    </>
  )
}

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

function Link({href, text, children}) {
  const ref = useRef()
  const [hovered, hover] = useState(false)
  return (
    <a
      href={href}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      onPointerMove={(e) => {
        const x = e.nativeEvent.offsetX
        const y = e.nativeEvent.offsetY - e.target.offsetTop - 100
        ref.current.style.transform = `translate3d(${x}px,${y}px,0)`
      }}>
      {text}
      <View
        ref={ref}
        visible={hovered}
        index={Infinity} // Render this view on top of all others
        className="view"
        style={{position: 'absolute', width: 200, display: 'block', pointerEvents: 'none'}}>
        <group>{children}</group>
      </View>
    </a>
  )
}
