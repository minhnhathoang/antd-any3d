import {useEffect, useState} from "react";
import {
  sendCreateProject,
  sendDeleteProject,
  sendGetProjectList,
  sendGetProjectListByOwner,
  sendUpdateProject
} from "@/api/project";
import {message} from "antd";
import {useModel} from "@umijs/max";
import {sendAddVuforiaKeyCmd, sendUpdateVuforiaKeyCmd} from "@/api/vuforia";

export default () => {
  const [projectList, setProjectList] = useState<Project[] | null>([]);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [projectListLoading, setProjectListLoading] = useState<boolean>(false);
  const [createProjectLoading, setCreateProjectLoading] = useState<boolean>(false);
  const [createProjectModalVisible, setCreateProjectModalVisible] = useState<boolean>(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const selectProject = (projectId?: string) => {
    if (!projectId) {
      setSelectedProject(projectList.length > 0 ? projectList[0] : null);
    } else {
      const project = projectList.find(project => project.id === projectId);
      if (project) {
        setSelectedProject(project);
        message.info("Load project: " + project.name);
      } else {
        setSelectedProject(null);
      }
    }
  };

  const fetchProjectList = async () => {
    setProjectListLoading(true);
    try {
      const res = await sendGetProjectListByOwner();
      if (res.success) {
        const newProjectList = res.data || [];

        // Update project list state
        setProjectList(newProjectList);

        // Check if the selected project is still in the new project list
        if (selectedProject && !newProjectList.find(p => p.id === selectedProject.id)) {
          // If selected project is not in the new list, deselect it and select a new one
          setSelectedProject(null);
          selectProject();
        } else if (!selectedProject && newProjectList.length > 0) {
          // If no selected project and there are projects in the list, select the first one
          selectProject(newProjectList[0].id);
        }

        return newProjectList;
      }
    } catch (e) {
      console.error(e);
    }
    return undefined;
  };

  useEffect(() => {
    fetchProjectList();
  }, []);


  useEffect(() => {
    selectProject();
  }, [projectList]);

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
    try {
      await sendUpdateProject(id, cmd);
      await fetchProjectList();
    } finally {

    }
  }

  const addVuforiaKey = async (projectId: string, cmd: VuforiaAddKeyCmd) => {
    cmd.projectId = projectId;
    try {
      await sendAddVuforiaKeyCmd(cmd);
      await fetchProjectList();
    } catch (e) {
      console.error("Error adding vuforia key");
    }
  }

  const updateVuforiaKey = async (id: string, cmd: VuforiaUpdateKeyCmd) => {
    cmd.id = id;
    try {
      await sendUpdateVuforiaKeyCmd(cmd);
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
