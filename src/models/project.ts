import {useEffect, useState} from "react";
import {
  sendCreateProject,
  sendDeleteProject,
  sendGetProjectListByOwner,
  sendUpdateProject
} from "@/api/project";
import {message} from "antd";
import {sendAddVuforiaKeyCmd, sendUpdateVuforiaKeyCmd} from "@/api/vuforia";
import {useModel} from "@umijs/max";
import useNotiModel from "@/models/noti";

export default () => {

  const {initialState} = useModel('@@initialState');

  const [projectList, setProjectList] = useState<Project[]>([]);

  const [selectedProject, setSelectedProject] = useState<Project | null>();

  const [projectListLoading, setProjectListLoading] = useState<boolean>(false);
  const [createProjectLoading, setCreateProjectLoading] = useState<boolean>(false);
  const [createProjectModalVisible, setCreateProjectModalVisible] = useState<boolean>(false);
  const [currentProject, setCurrentProject] = useState<Project>();

  const { notifications, addNotification, removeNotification } = useNotiModel();

  const selectProject = (projectId?: string) => {
    if (!projectId || !projectList?.length) {
      setSelectedProject(null);
      return;
    }
    const project = projectList.find(project => project.id === projectId);
    if (project) {
      setSelectedProject(project);
      message.info("Load project: " + project.name);
    } else {
      setSelectedProject(null);
    }
  };

  const fetchProjectList = async () => {
    setProjectListLoading(true);
    try {
      const res = await sendGetProjectListByOwner();
      if (res.success) {
        const newProjectList = res.data || [];
        setProjectList(newProjectList);
        return newProjectList;
      }
    } catch (e) {
      console.error(e);
    }
    return undefined;
  };

  useEffect(() => {
    console.log("USEEFFEFT NOTI" + JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    setSelectedProject(null);
    setProjectList([]);
    fetchProjectList().then(r => {
      if (selectedProject !== null && r?.find(p => p.id === selectedProject?.id) !== null) {
        return;
      }
      if (r && r.length > 0) {
        selectProject(r[0].id);
      }
    });
  }, [initialState?.currentUser]);

  const createProject = async (project: ProjectCO) => {
    setCreateProjectLoading(true);
    try {
      await sendCreateProject(project);
      setCreateProjectModalVisible(false);
      await fetchProjectList();
    } finally {
      setCreateProjectLoading(false);
    }
  };

  const updateProject = async (id: string, cmd: ProjectUpdateCmd) => {
    await sendUpdateProject(id, cmd);
    await fetchProjectList();
  }

  const addVuforiaKey = async (projectId: string, cmd: VuforiaAddKeyCmd) => {
    cmd.projectId = projectId;
    try {
      await sendAddVuforiaKeyCmd(cmd);
      message.success("Vuforia key added successfully");
      await fetchProjectList();
    } catch (e) {
      console.error("Error adding vuforia key");
    }
  }

  const updateVuforiaKey = async (id: string, cmd: VuforiaUpdateKeyCmd) => {
    cmd.id = id;
    try {
      await sendUpdateVuforiaKeyCmd(cmd);
      message.success("Vuforia key updated successfully");
      await fetchProjectList();
    } catch (e) {
      console.error("Error updating vuforia key");
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      const msg = await sendDeleteProject(projectId);
      if (msg.success) {
        console.log("Project deleted successfully");
      }
      await fetchProjectList().then(() => {
        if (selectedProject?.id === projectId) {
          console.log("Selected project is deleted, select a new one");
          selectProject();
        }
      })
    } catch (e) {
      console.error("Error deleting project");
    }
  }

  return {
    projectList,
    fetchProjectList,
    selectProject,
    selectedProject,

    createProject,
    updateProject,
    deleteProject,

    addVuforiaKey,
    updateVuforiaKey,

    createProjectModalVisible,
    setCreateProjectModalVisible,

    projectListLoading,
    createProjectLoading,
    currentProject,
    setCurrentProject
  };
}
