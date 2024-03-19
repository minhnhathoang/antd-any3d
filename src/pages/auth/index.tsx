// import {history, Link, useRequest} from '@umijs/max';
// import {Button, Form, Input, message, Popover, Progress} from 'antd';
// import type {Store} from 'antd/es/form/interface';
// import React from 'react';
// import {useEffect, useState} from 'react';
// import type {StateType} from './service';
// import {fakeRegister} from './service';
// import useStyles from './style.style';
//
// import { useRef } from 'react';
// import { Canvas } from '@react-three/fiber';
//
// const FormItem = Form.Item;
//
// const passwordProgressMap: {
//   ok: 'success';
//   pass: 'normal';
//   poor: 'exception';
// } = {
//   ok: 'success',
//   pass: 'normal',
//   poor: 'exception',
// };
//
// const Page = () => {
//   const {styles} = useStyles();
//   const [open, setVisible]: [boolean, any] = useState(false);
//   const [popover, setPopover]: [boolean, any] = useState(false);
//   const confirmDirty = false;
//   let interval: number | undefined;
//
//
//   const passwordStatusMap = {
//     ok: (
//       <div className={styles.success}>
//         <span>强度：强</span>
//       </div>
//     ),
//     pass: (
//       <div className={styles.warning}>
//         <span>强度：中</span>
//       </div>
//     ),
//     poor: (
//       <div className={styles.error}>
//         <span>强度：太短</span>
//       </div>
//     ),
//   };
//
//   const [form] = Form.useForm();
//   useEffect(
//     () => () => {
//       clearInterval(interval);
//     },
//     [interval],
//   );
//
//   const getPasswordStatus = () => {
//     const value = form.getFieldValue('password');
//     if (value && value.length > 9) {
//       return 'ok';
//     }
//     if (value && value.length > 5) {
//       return 'pass';
//     }
//     return 'poor';
//   };
//   const {loading: submitting, run: register} = useRequest<{
//     data: StateType;
//   }>(fakeRegister, {
//     manual: true,
//     onSuccess: (data, params) => {
//       if (data.status === 'ok') {
//         message.success('注册成功！');
//         history.push({
//           pathname: `/user/register-result?account=${params[0].email}`,
//         });
//       }
//     },
//   });
//   const onFinish = (values: Store) => {
//     register(values);
//   };
//   const checkConfirm = (_: any, value: string) => {
//     const promise = Promise;
//     if (value && value !== form.getFieldValue('password')) {
//       return promise.reject('两次输入的密码不匹配!');
//     }
//     return promise.resolve();
//   };
//   const checkPassword = (_: any, value: string) => {
//     const promise = Promise;
//     // 没有值的情况
//     if (!value) {
//       setVisible(!!value);
//       return promise.reject('Please enter password!');
//     }
//     // 有值的情况
//     if (!open) {
//       setVisible(!!value);
//     }
//     setPopover(!popover);
//     if (value.length < 6) {
//       return promise.reject('');
//     }
//     if (value && confirmDirty) {
//       form.validateFields(['confirm']);
//     }
//     return promise.resolve();
//   };
//
//   const renderPasswordProgress = () => {
//     const value = form.getFieldValue('password');
//     const passwordStatus = getPasswordStatus();
//
//     return value && value.length ? (
//       <div className={styles[`progress-${passwordStatus}` as keyof typeof styles]}>
//         <Progress
//           status={passwordProgressMap[passwordStatus]}
//           strokeWidth={6}
//           percent={value.length * 10 > 100 ? 100 : value.length * 10}
//           showInfo={false}
//         />
//       </div>
//     ) : null;
//   };
//
//   const boxRef = useRef();
//
//   return (
//       <div className={styles.main}>
//
//         <Canvas>
//           <ambientLight intensity={0.5} />
//           <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
//
//           <mesh ref={boxRef}>
//             <boxGeometry args={[1, 1, 1]} />
//             <meshStandardMaterial color="orange" />
//           </mesh>
//         </Canvas>
//
//         <h3>Sign up</h3>
//         <Form form={form} name="UserRegister" onFinish={onFinish}>
//           <FormItem
//             name="email"
//             rules={[
//               {
//                 required: true,
//                 message: 'Please input the email address!',
//               },
//               {
//                 type: 'email',
//                 message: 'Invalid email!',
//               },
//             ]}
//           >
//             <Input size="large" placeholder="邮箱"/>
//           </FormItem>
//           <Popover
//             getPopupContainer={(node) => {
//               if (node && node.parentNode) {
//                 return node.parentNode as HTMLElement;
//               }
//               return node;
//             }}
//             content={
//               open && (
//                 <div
//                   style={{
//                     padding: '4px 0',
//                   }}
//                 >
//                   {passwordStatusMap[getPasswordStatus()]}
//                   {renderPasswordProgress()}
//                   <div
//                     style={{
//                       marginTop: 10,
//                     }}
//                   >
//                     <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
//                   </div>
//                 </div>
//               )
//             }
//             overlayStyle={{
//               width: 240,
//             }}
//             placement="right"
//             open={open}
//           >
//             <FormItem
//               name="password"
//               className={
//                 form.getFieldValue('password') &&
//                 form.getFieldValue('password').length > 0 &&
//                 styles.password
//               }
//               rules={[
//                 {
//                   validator: checkPassword,
//                 },
//               ]}
//             >
//               <Input size="large" type="password" placeholder="至少6位密码，区分大小写"/>
//             </FormItem>
//           </Popover>
//           <FormItem
//             name="confirm"
//             rules={[
//               {
//                 required: true,
//                 message: 'Confirm Password',
//               },
//               {
//                 validator: checkConfirm,
//               },
//             ]}
//           >
//             <Input size="large" type="password" placeholder="Confirm Password"/>
//           </FormItem>
//           <FormItem>
//             <div className={styles.footer}>
//               <Button
//                 size="large"
//                 loading={submitting}
//                 className={styles.submit}
//                 type="primary"
//                 htmlType="submit"
//               >
//                 <span>注册</span>
//               </Button>
//               <Link to="/auth/login">
//                 <span>使用已有账户登录</span>
//               </Link>
//             </div>
//           </FormItem>
//         </Form>
//       </div>
//   );
// };
//
// export default () => {
//   return (
//       <Page/>
//   );
// };

//////////////////////////
// import {Mesh} from 'three';
// import {useRef} from "react";
// import {Canvas, useFrame} from "@react-three/fiber";
//
// function Cube() {
//   const meshRef = useRef<Mesh>(null);
//
//   useFrame(() => {
//       if (!meshRef.current) {
//         return;
//       }
//       meshRef.current.rotation.x += 0.01;
//       meshRef.current.rotation.y += 0.01;
//     }
//   );
//
//   return (
//     <mesh ref={meshRef}>
//       <boxGeometry />
//       <meshStandardMaterial color="blue" />
//     </mesh>
//   )
// }
//
// export default function MyScene() {
//   return (
//     <Canvas>
//       <ambientLight/>
//       <pointLight position={[0, 0, 0]}/>
//
//       <Cube/>
//     </Canvas>
//   );
// }

//
// MyScene.tsx
// import React, { useRef } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { BoxGeometry, MeshStandardMaterial } from 'three';
//
// const Box: React.FC = () => {
//   const boxRef = useRef<THREE.Mesh>();
//
//   useFrame(({ clock }) => {
//     // Rotate the box on each frame
//     if (boxRef.current) {
//       boxRef.current.rotation.x = Math.sin(clock.getElapsedTime()) * Math.PI * 0.5;
//       boxRef.current.rotation.y = Math.cos(clock.getElapsedTime()) * Math.PI * 0.5;
//     }
//   });
//
//   return (
//     <mesh ref={boxRef}>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshStandardMaterial color="orange" />
//     </mesh>
//   );
// };
//
// const MyScene: React.FC = () => {
//   return (
//     <Canvas>
//       <ambientLight intensity={0.5} />
//       <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
//
//       <Box />
//     </Canvas>
//   );
// };
//
// export default MyScene;


import React from 'react';
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, PresentationControls } from "@react-three/drei";

type ModelProps = {
  path: string; // Path to the GLB file for this model
  scale?: number; // Optional scale factor for the model
};

function Model({ path, scale = 1 }: ModelProps) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={[scale, scale, scale]} />;
}

function App() {
  return (
    <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={{ position: "absolute" }}>
      <color attach="background" args={["#ffffff"]} />
      <PresentationControls speed={1.5} global zoom={0.1} polar={[-0.1, Math.PI / 4]}>
        <Stage environment={"sunset"}>
          {/* Add multiple models here */}
          <Model path="/threlte.glb" scale={0.002} />
          {/* Add as many models as needed */}
        </Stage>
      </PresentationControls>
    </Canvas>
  );
}

export default App;
