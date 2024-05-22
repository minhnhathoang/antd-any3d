import {PageContainer} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import {Card, theme, Select, SelectProps, Spin, Button, Typography} from 'antd';
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

const { Text, Link } = Typography;


interface ContentValue {
  key: string;
  label: string;
  value: string;
  contentType: string;
}

const CustomOption = ({index, contentType, url, name}) => (
  <div style={{display: 'flex', alignItems: 'center'}}>
    {["image/jpeg", "image/png"].includes(contentType) && (
      <img
        src="/img_logo.svg"
        style={{width: 20}}/>
    )}
    {["model/gltf-binary"].includes(contentType) && (
      <img
        src="/glb_logo.svg"
        style={{width: 20}}
      />
    )}
    {["model/gltf+json"].includes(contentType) && (
      <img
        src="/gltf_logo.svg"
        style={{width: 20}}
      />
    )}
    <span style={{marginLeft: 8, fontSize: 16}}>{index}. {name}</span>
  </div>
);

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
          value: content.id,
          contentType: content.hologram.contentType
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

  const parseMetadata = (metadataString: string) => {
    try {
      return JSON.parse(metadataString);
    } catch (error) {
      return {};
    }
  };

  const metadata = parseMetadata(selectedContent?.metadata);

  const [newMetadata, setNewMetadata] = useState(metadata);

  const updateMetadata = async () => {
    if (selectedContent === undefined) {
      console.error("No content selected" + JSON.stringify(selectedContent));
      return;
    }
    const res = await updateContent(selectedContent.id, {
      metadata: JSON.stringify(newMetadata)
    });
    if (res?.success) {
      setSelectedContent({...selectedContent, metadata: JSON.stringify(newMetadata)});
      setList(prevList =>
        prevList.map(content =>
          {
            if (content.id === selectedContent.id) {
              console.log("updateMetadata", content);
              return {...content, metadata: JSON.stringify(newMetadata)};
            }
            return content;
          }
        )
      );
    }
  }

  const [{scale, rotation, position, mode}, set] = useControls(() => ({
    "any3d-metadata": folder({
      scale: {
        value: metadata?.scale || initialParams.scale,
        step: 0.1
      },
      rotation: {
        value: {
          x: metadata?.rotation?.x || initialParams.rotation.x,
          y: metadata?.rotation?.y || initialParams.rotation.y,
          z: metadata?.rotation?.z || initialParams.rotation.z,
        },
        step: 0.1
      },
      position: {
        value: {
          x: metadata?.position?.x || initialParams.position.x,
          y: metadata?.position?.y || initialParams.position.y,
          z: metadata?.position?.z || initialParams.position.z,
        },
        step: 0.1
      },
    }),
    "control-mode": folder({
      mode: {
        value: "translate",
        options: ["translate", "rotate"]
      }
    }),
    reset: button(() => {
      set({
        scale: initialParams.scale,
        rotation: {...initialParams.rotation},
        position: {...initialParams.position}
      });
    }),
    update: button(() => {
      updateMetadata();
    })
  }), [selectedContent, newMetadata]);

  useEffect(() => {
    if (selectedContent) {
      setNewMetadata({
        scale: scale,
        rotation: {x: rotation.x, y: rotation.y, z: rotation.z},
        position: {x: position.x, y: position.y, z: position.z}
      });
    }
  }, [scale, position, rotation]);

  useEffect(() => {
    console.log("Trigger: content", selectedContent);
  }, [selectedContent]);

  const fetchOptions = (search) => {
    if (!selectedProject) {
      return Promise.resolve([]);
    }
    return fetchContent(selectedProject?.id);
  };

  useEffect(() => {
    if (selectedProject) {
      fetchOptions('').then((data) => {
        setOptions(data.filter((content) => ["model/gltf+json", "model/gltf-binary"].includes(content.contentType)));
      });
    }
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchOptions('').then((data) => {
        // just choose file model/gltf-json, model/gltf-binary
        setOptions(data.filter((content) => ["model/gltf+json", "model/gltf-binary"].includes(content.contentType)));
      });
    }
  }, [selectedProject]);

  return (
    <PageContainer>
      <Select
        showSearch
        style={{width: "30%", marginBottom: 10}}
        placeholder="Select content"
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').includes(input)}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }
        onChange={(value, options) => {
          const content = list.find((content) => content.id === value);
          if (!content) {
            return;
          }
          setContentValue({key: value, label: content?.name, value: value, contentType: content.hologram.contentType});
          console.log("onChange", value, content);

          setSelectedContent(content);
          set({
            scale: parseMetadata(content.metadata)?.scale || initialParams.scale,
            rotation: {
              x: parseMetadata(content.metadata)?.rotation?.x || initialParams.rotation.x,
              y: parseMetadata(content.metadata)?.rotation?.y || initialParams.rotation.y,
              z: parseMetadata(content.metadata)?.rotation?.z || initialParams.rotation.z,
            },
            position: {
              x: parseMetadata(content.metadata)?.position?.x || initialParams.position.x,
              y: parseMetadata(content.metadata)?.position?.y || initialParams.position.y,
              z: parseMetadata(content.metadata)?.position?.z || initialParams.position.z,
            }
          });
        }}
        options={options}
        optionRender={(oriOption, info) => {
          const option = oriOption as ContentValue;
          return (
            <CustomOption
              contentType={list.find((content) => content.id === option.key)?.hologram.contentType}
              url={list.find((content) => content.id === option.key)?.hologram.url}
              name={option.label}
              index={info.index + 1}
            />
          );
        }}
      />

      <div><Text>Only support previewing Holograms with .GLB, .GLTF formats</Text></div>

      <div style={{marginBottom: "20px"}}>
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
          mode={mode}
          showX={true}
          showY={true}
          showZ={true}
          enabled={true}
          axis="XYZ"
          position={[position.x, position.y, position.z]}
          rotation={[rotation.x, rotation.y, rotation.z]}
          scale={[scale, scale, scale]}

          onMouseUp={(e) => {
            if (e?.target?.object) {
              const { position, rotation } = e.target.object;

              const newPosition = {
                x: parseFloat(position.x.toFixed(2)),
                y: parseFloat(position.y.toFixed(2)),
                z: parseFloat(position.z.toFixed(2))
              };

              const newRotation = {
                x: parseFloat(rotation.x.toFixed(2)),
                y: parseFloat(rotation.y.toFixed(2)),
                z: parseFloat(rotation.z.toFixed(2))
              };

              set({
                position: newPosition,
                rotation: newRotation
              });
            }
          }}
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
