import {DownOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {SelectLang as UmiSelectLang} from '@umijs/max';
import {Dropdown, Input, Menu} from 'antd';
import React, {useEffect, useState} from 'react';
import {useModel} from "umi";

export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
    />
  );
};

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined/>
    </div>
  );
};

export const ProjectSelector = () => {
  const {
    projectList,
    selectedProject,
    selectProject
  } = useModel('project');

  const [searchValue, setSearchValue] = useState('');
  const [filteredMenuItems, setFilteredMenuItems] = useState(projectList);


  useEffect(() => {
    setFilteredMenuItems(projectList);
    console.log('Project list updated: ' + JSON.stringify(selectedProject));
  }, [selectedProject, projectList]);

  const handleSearch = (e: { target: { value: any; }; }) => {
    const {value} = e.target;
    setSearchValue(value);

    const filteredItems = projectList?.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredMenuItems(filteredItems || []);
  };

  const menuItems = filteredMenuItems?.map(project => ({
    key: project.id,
    value: project.id,
    label: project.name
  }));

  const menu = (
    <Menu
      style={{maxHeight: 200, overflowY: 'auto'}}
      selectedKeys={[selectedProject?.id || '']}
      onClick={({key}) => {
        selectProject(key);
      }}
    >
      <Input.Search
        placeholder="Search projects"
        value={searchValue}
        onChange={handleSearch}
        style={{marginBottom: 8}}
      />
      {menuItems?.map(item => (
        <Menu.Item key={item.key}>{item.label}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown.Button
      overlay={menu}
      icon={<DownOutlined/>}
    >
      <p style={{width: 150}}>
        {selectedProject?.name || 'No project'}
      </p>
    </Dropdown.Button>
  );
};
