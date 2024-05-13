import {DownOutlined, PlusOutlined} from '@ant-design/icons';
import {PageContainer} from '@ant-design/pro-components';
import {FormattedMessage, useRequest} from '@umijs/max';

import {
  Avatar, Badge,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Modal, PaginationProps,
  Progress,
  Radio,
  Row,
} from 'antd';
import dayjs from 'dayjs';
import {FC, useEffect} from 'react';
import React, {useState} from 'react';
import CreateProjectModal from './components/CreateProjectModal';
import useStyles from './style.style';
import PropTypes from "prop-types";
import {useModel} from "umi";
import UpdateProjectModal from "@/pages/project/components/UpdateProjectModal";
import VuforiaKeyForm from "@/pages/project/components/VuforiaKeyForm";
import {truncated} from "@/utils/stringUtils";


const {Search} = Input;
const Info: FC<{
  title: string;
  value: any;
  bordered?: boolean;
}> = ({title, value, bordered}) => {
  const {styles} = useStyles();
  return (
    <div className={styles.headerInfo}>
      <span>{title}</span>
      <p>{value}</p>
      {bordered && <em/>}
    </div>
  );
};
const ListContent = ({data: {owner, name, description, createdAt, contentCount, vuforiaKey}}: {
  data: Project;
}) => {
  const {styles} = useStyles();
  return (
    <div>
      <div className={styles.listContentItem}>
        <span>Vuforia Status</span>
        <p>
          {vuforiaKey ? <Badge status="success" text="active"/> : <Badge status="default" text="inactive" />}
        </p>
      </div>
      <div className={styles.listContentItem}>
        <span>Content Count</span>
        <p>{contentCount}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>Owner</span>
        <p>{owner.username}</p>
      </div>
      <div className={styles.listContentItem}>
        <span>Created Time</span>
        <p>{dayjs(createdAt).format('YYYY-MM-DD HH:mm')}</p>
      </div>
    </div>
  );
};

export const ProjectList: FC = () => {
  const {styles} = useStyles();

  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [doneAdd, setDoneAdd] = useState<boolean>(false);

  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [doneUpdate, setDoneUpdate] = useState<boolean>(false);

  const [current, setCurrent] = useState<Partial<Project> | undefined>(undefined);

  const [openVuforiaConfigModal, setOpenVuforiaConfigModal] = useState<boolean>(false);
  const [currentVuforiaKey, setCurrentVuforiaKey] = useState<VuforiaKey>(null);

  const {
    projectList,
    fetchProjectList,
    createProject,
    updateProject,
    deleteProject,
  } = useModel('project');

  const onChange: PaginationProps['onChange'] = (pageNumber) => {
    console.log('Page: ', pageNumber);
  };

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    total: projectList?.length,
    onChange: onChange,
    pageSizeOptions: [5, 10, 15, 20],
    defaultPageSize: 5,
  };

  const showEditModal = (item: Project) => {
    setOpenUpdateModal(true);
    setCurrent(item);
  };

  const showDeleteModal = (item: Project) => {
    Modal.confirm({
      title: 'Delete Project',
      content: 'Are you sure you want to delete project ' + item.name + '?',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => deleteProject(item.id),
    });
  }

  const showVuforiaConfigModal = (project: Project) => {
    setOpenVuforiaConfigModal(true);
    setCurrent(project);
    setCurrentVuforiaKey(project.vuforiaKey);
  };

  const extraContent = (
    <div>
      <Button
        type='primary'
        onClick={() => {
          setOpenAddModal(true);
        }}
        style={{marginRight: 24}}
      >
        <PlusOutlined/>
        Add new project
      </Button>
      <Search className={styles.extraContentSearch} placeholder="Search" onSearch={() => ({})}/>
    </div>
  );

  const getTotalContent = () => {
    let totalContent = 0;
    projectList?.forEach((project) => {
      totalContent += project.contentCount;
    });
    return totalContent;
  }

  useEffect(() => {
    fetchProjectList();
  }, []);

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="Total Projects" value={projectList?.length} bordered/>
              </Col>
              <Col sm={8} xs={24}>
                <Info title="Total Contents" value={getTotalContent()} bordered/>
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="List of Project"
            style={{
              marginTop: 24,
            }}
            bodyStyle={{
              padding: '0 32px 40px 32px',
            }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              pagination={paginationProps}
              dataSource={projectList}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        showEditModal(item);
                      }}
                    >
                      Edit
                    </a>,
                    <a
                      key="delete"
                      onClick={(e) => {
                        e.preventDefault();
                        showDeleteModal(item);
                      }}
                    >
                      Delete
                    </a>,
                    <a
                      key="vuforia_config"
                      onClick={(e) => {
                        e.preventDefault();
                        showVuforiaConfigModal(item);
                      }}
                    >
                      Vuforia Config
                    </a>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{backgroundColor: '#aadafd', color: '#ffb4f1'}}
                        shape="square" size='large'
                        icon={<img src="/logo.svg" style={{width: 30, height: 30}}/>}
                      />
                    }
                    title={<a href={item.id}>{item.name}</a>}
                    description={truncated(item.description, 30)}
                  />
                  <ListContent data={item}/>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageContainer>


      <CreateProjectModal
        done={doneAdd}
        open={openAddModal}
        current={current}
        onDone={
          () => {
            setOpenAddModal(false);
          }
        }
        onSubmit={createProject}
      />

      <UpdateProjectModal
        id={current?.id as string}
        done={doneUpdate}
        open={openUpdateModal}
        current={current}
        onDone={
          () => {
            setOpenUpdateModal(false);
          }
        }
        onSubmit={updateProject}
      />

      <VuforiaKeyForm
        projectId={current?.id as string}
        id={current?.vuforiaKey?.id}
        open={openVuforiaConfigModal}
        current={current?.vuforiaKey}
        onDone={
          () => {
            setOpenVuforiaConfigModal(false);
          }
        }
      />
    </div>
  );
};

ProjectList.propTypes = {
  onDelete: PropTypes.func.isRequired,
  projectList: PropTypes.array.isRequired,
};

export default ProjectList;
