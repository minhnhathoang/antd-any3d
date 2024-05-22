import {PageContainer} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import {Card, theme, Select, SelectProps, Spin, Button, Form, Space, Input, Typography} from 'antd';
import React, {Suspense, useEffect, useMemo, useRef, useState} from 'react';

import {EditOutlined, EllipsisOutlined, MinusCircleOutlined, PlusOutlined, SettingOutlined} from '@ant-design/icons';
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
import {EnvironmentColor, GLTFModel, ImageComponent, Model3d} from "@/utils/r3fUtils";

const {Meta} = Card;


const tryParseJSON = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
};


interface ContentValue {
  key: string;
  label: string;
  value: string;
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

const Metadata: React.FC = () => {

  const {selectedProject} = useModel('project');

  const {updateContent} = useModel('content');

  const [contentValue, setContentValue] = useState<ContentValue>();

  const [options, setOptions] = useState<ContentValue[]>([]);
  const [list, setList] = useState<Content[]>([]);

  const [selectedContent, setSelectedContent] = useState<Content>();

  const [metadata, setMetadata] = useState<{ [key: string]: string | number | object }>({});
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const fetchContent = async (projectId: string) => {
    try {
      const res = await sendGetContentListByPageQry(projectId, 1, 10000);
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
  }, [selectedProject]);

  useEffect(() => {
    if (contentValue) {
      const content = list.find((content) => content.id === contentValue.key);
      setSelectedContent(content);
      if (content?.metadata) {
        setMetadata(JSON.parse(content?.metadata));
      } else {
        setMetadata({});
      }
    }
  }, [contentValue, list]);


  const onFinish = async () => {
    if (selectedContent) {
      const res = await updateContent(selectedContent.id, {metadata: JSON.stringify(metadata)});
      if (res?.success) {
        const updatedContent = {...selectedContent, metadata: JSON.stringify(metadata)};
        setSelectedContent(updatedContent);
        setList(prevList =>
          prevList.map(content =>
            content.id === selectedContent.id ? updatedContent : content
          )
        );
      }
    }
  };

  const handleAdd = () => {
    if (key && value) {
      const parsedValue = tryParseJSON(value); // Parse JSON if value is a valid JSON string
      setMetadata({...metadata, [key]: parsedValue !== null ? parsedValue : value});
      setKey('');
      setValue('');
    }
  };

  const handleRemove = (keyToRemove: string) => {
    const updatedMetadata = {...metadata};
    delete updatedMetadata[keyToRemove];
    setMetadata(updatedMetadata);
  };

  const displayValue = (value: any) => {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    } else {
      return value.toString();
    }
  };

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
        onChange={(value) => {
          const content = list.find((content) => content.id === value);
          setContentValue({key: value, label: content?.name, value: value});
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

      <Space direction="vertical" style={{width: '100%'}}>
        <Input.Group compact style={{marginBottom: 16}}>
          <Input
            placeholder="Key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            style={{width: '30%'}}
          />
          <Input
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{width: '30%'}}
          />
          <Button type="primary" onClick={handleAdd}>Add</Button>
        </Input.Group>

        {Object.entries(metadata).map(([metadataKey, metadataValue]) => (
          <Space key={metadataKey} style={{marginBottom: 10}}>
            <Input value={metadataKey} readOnly/>
            <Input value={displayValue(metadataValue)} readOnly/>
            <MinusCircleOutlined style={{marginLeft: 10}} onClick={() => handleRemove(metadataKey)}/>
          </Space>
        ))}

        <div>
          <Typography.Text>JSON View:</Typography.Text>
          <Typography style={{width: '60%'}}>
            <pre>{JSON.stringify(metadata, null, 2)}</pre>
          </Typography>
        </div>

        <Button type="primary" onClick={onFinish}>Save Metadata</Button>
      </Space>
    </PageContainer>
  );
};

export default Metadata;
