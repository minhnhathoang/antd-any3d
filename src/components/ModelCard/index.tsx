import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, Preload, OrbitControls, PerspectiveCamera, CameraShake, PivotControls, Environment, Center } from '@react-three/drei';
import { Soda, Apple, Duck, Candy, Flash, Target } from './models';

export function App() {
  return (
    <>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/** Regular HTML with canvas bits mixed into it (<View>) */}
        <div className="text">

          {/*<View className="view translateX">*/}
          {/*  <Common color="lightpink" />*/}
          {/*    <Soda scale={6} position={[0, -1.6, 0]} />*/}
          {/*  <OrbitControls makeDefault />*/}
          {/*</View>*/}


          <View className="view translateY">
            <Common color="lightgreen" />
            <Duck scale={2} position={[0, -1.6, 0]} />
          </View>


          <View className="view scale" style={{ height: 300 }}>
            <Common color="lightgreen" />
            <Apple position={[0, -1, 0]} scale={14} />
            <OrbitControls makeDefault />
          </View>

          <View className="view scale">
            <Common color="peachpuff" />
            <Candy scale={3} />
          </View>
          <View className="view translateX">
            <Common color="orange" />
            <Flash scale={3} />
          </View>
        </div>
        {/** Fixed fullscreen canvas on top of everything, events tied to index root */}
        <Canvas
          style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden' }}
          eventSource={document.getElementById('root')}>
          <View.Port />
          <Preload all />
        </Canvas>
      </div>
    </>
  );
}

function Common({ color }: { color?: string }) {
  return (
    <>
      {color && <color attach="background" args={[color]} />}
      <ambientLight intensity={0.5} />
      <pointLight position={[20, 30, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="blue" />
      <Environment preset="dawn" />
      <PerspectiveCamera makeDefault fov={40} position={[0, 0, 6]} />
    </>
  );
}

function Link({ href, text, children }: { href: string; text: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, hover] = useState(false);
  return (
    <a
      href={href}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      onPointerMove={(e) => {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY - e.currentTarget.offsetTop - 100;
        if (ref.current) {
          ref.current.style.transform = `translate3d(${x}px,${y}px,0)`;
        }
      }}>
      {text}
      <View
        ref={ref}
        visible={hovered}
        index={Infinity} // Render this view on top of all others
        className="view"
        style={{ position: 'absolute', width: 200, display: 'block', pointerEvents: 'none' }}>
        <group>{children}</group>
      </View>
    </a>
  );
}
