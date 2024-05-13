import {PageContainer} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import {Card, theme, Select, SelectProps, Spin, Button} from 'antd';
import React, {Suspense, useEffect, useMemo, useRef, useState} from 'react';

import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';
import {Avatar} from 'antd';
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  PivotControls,
  Preload,
  TransformControls,
  useTexture, useVideoTexture,
  View
} from "@react-three/drei";
import {Canvas, useFrame} from "@react-three/fiber";
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
import {useControls, button, folder} from 'leva'

import debounce from 'lodash/debounce';
import {sendGetContentListByPageQry} from "@/api/content";
import {EnvironmentColor, ImageComponent, Model3d} from "@/utils/r3fUtils";

const {Meta} = Card;


function VideoMaterial({url}) {
  const texture = useVideoTexture(url)
  return <meshBasicMaterial map={texture} toneMapped={false}/>
}

function FallbackMaterial({url}) {
  const texture = useTexture(url)
  return <meshBasicMaterial map={texture} toneMapped={false}/>
}

interface ContentValue {
  key: string;
  label: string;
  value: string;
}


const Preview: React.FC = () => {

  const {selectedProject} = useModel('project');

  const {updateContent} = useModel('content');

  const [contentValue, setContentValue] = useState<ContentValue>();

  const [options, setOptions] = useState<ContentValue[]>([]);
  const [list, setList] = useState<Content[]>([]);

  const [selectedContent, setSelectedContent] = useState<Content>();
  const fetchContent = async (projectId: string) => {
    try {
      const res = await sendGetContentListByPageQry(projectId, 1, 1000);
      if (res.success) {
        const ans = res.data?.map((content) => ({
          key: content.id,
          label: content.name,
          value: content.id
        }));
        setList(res.data ?? [])
        console.log("fetchContent", ans)
        return ans;
      }
    } catch (e) {
      console.error(e);
      return [];
    }
    return [];
  };

  const initialParams = {
    scale: 1,
    rotation: {x: 0, y: 0, z: 0},
    position: {x: 0, y: 0, z: 0}
  };

  const [{scale, rotation, position}, set] = useControls(() => ({
    Metadata: folder({
      scale: selectedContent?.metadata?.scale || initialParams.scale,
      rotation: {
        x: selectedContent?.metadata?.rotation?.x || initialParams.rotation.x,
        y: selectedContent?.metadata?.rotation?.y || initialParams.rotation.y,
        z: selectedContent?.metadata?.rotation?.z || initialParams.rotation.z,
      },
      position: {
        x: selectedContent?.metadata?.position?.x || initialParams.position.x,
        y: selectedContent?.metadata?.position?.y || initialParams.position.y,
        z: selectedContent?.metadata?.position?.z || initialParams.position.z,
      },
    }),
    Reset: button(() => {
      set({
        scale: initialParams.scale,
        rotation: {...initialParams.rotation},
        position: {...initialParams.position}
      });
    }),
    Control: folder({
      controlMode: 'translate',

    })
  }));

  const fetchOptions = (search) => {
    if (!selectedProject) {
      return Promise.resolve([]);
    }
    return fetchContent(selectedProject?.id);
  };

  useEffect(() => {
    if (selectedProject) {
      fetchOptions('').then((data) => {
        setOptions(data);
      });
    }
  }, []);

  const [controlMode, setControlMode] = useState("translate");

  useEffect(() => {
    if (contentValue) {
      setSelectedContent(list.find((content) => content.id === contentValue.key));
    }
  }, [contentValue]);

  function adjustScale(width, height) {
    const scaleFactor = 10;
    const aspectRatio = width / height;
    return [aspectRatio * scaleFactor, scaleFactor, 1];
  }

  return (
    <PageContainer>
      <Select
        showSearch
        style={{width: 200}}
        placeholder="Select content"
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
        onChange={(value) => {
          const content = list.find((content) => content.id === value);
          console.log("Selecte content: ", JSON.stringify(content));
          setContentValue({key: value, label: content?.name, value: value});
        }}
        options={options}
      />
      <div style={{marginBottom: "20px"}}>
        {/*<Button onClick={() => {*/}
        {/*  console.log("translate" + JSON.stringify(selectedContent));*/}
        {/*  if (selectedContent === undefined) {*/}
        {/*    console.error("No content selected" + JSON.stringify(selectedContent));*/}
        {/*    return;*/}
        {/*  }*/}
        {/*  updateContent(selectedContent.id, {*/}
        {/*    metadata: JSON.stringify({*/}
        {/*      scale,*/}
        {/*      rotation,*/}
        {/*      position*/}
        {/*    })*/}
        {/*  });*/}
        {/*  setControlMode("translate")*/}
        {/*}}>Move</Button>*/}
        {/*<Button onClick={() => setControlMode("rotate")}>Rotate</Button>*/}
      </div>

      <Canvas
        style={{top: 0, bottom: 0, left: 0, right: 0, width: '100%', height: "500px"}}>
        <EnvironmentColor/>
        {selectedContent && selectedContent.imageTarget && (
          // eslint-disable-next-line react/jsx-no-undef
          <ImageComponent
            url={selectedContent.imageTarget.url}
          />
        )}
        <TransformControls
          mode={controlMode}
          showX={true}
          showY={true}
          showZ={true}
          enabled={true}
          axis="XYZ"
        >
          {selectedContent && (
            <Model3d path={selectedContent.hologram.url}/>
          )}
        </TransformControls>

        <gridHelper/>
        <OrbitControls makeDefault/>
      </Canvas>
    </PageContainer>
  );
};

export default Preview;
