import {useEffect, useState} from "react";

import {sendDeleteContent, sendGetContentListByPageQry, sendUpdateContent} from "@/api/content";

import {message} from "antd";
import {useModel} from "@umijs/max";

export default () => {
  const [pageContent, setPageContent] = useState<PageResponse<Content[]>>()
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {selectedProject} = useModel('project');

  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const [changed, setChanged] = useState<boolean>(false);

  const getContentListByPage = async (projectId: string, pageIndex: number, pageSize: number) => {
    console.log("getContentListByPage", projectId, pageIndex, pageSize);
    console.log("selectedProject", selectedProject);
    setRefreshing(true);
    try {
      const res = await sendGetContentListByPageQry(projectId, pageIndex, pageSize);
      if (res.success) {
        setPageContent(res);
        setPageIndex(res.pageIndex);
        setPageSize(res.pageSize);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (changed) {
      getContentListByPage(selectedProject?.id as string, pageIndex, pageSize);
      setChanged(false);
    }
  }, [changed]);

  useEffect(() => {
    if (selectedProject) {
      getContentListByPage(selectedProject.id, pageIndex, pageSize);
    }
  }, [selectedProject, pageIndex, pageSize]);

  const updateContent = async (id: string, body: ContentUpdateCmd) => {
    try {
      await sendUpdateContent(id, body);
      message.info("Content updated successfully");
      await getContentListByPage(selectedProject?.id as string, pageIndex, pageSize);
    } catch (e) {
      message.error("Failed to update content");
    }
  }

  const deleteContent = async (id: string) => {
    try {
      await sendDeleteContent(id);
      message.info("Content deleted successfully");
      await getContentListByPage(selectedProject?.id as string, pageIndex, pageSize);
    } catch (e) {
      message.error("Failed to delete content");
    }
  }


  return {
    pageContent,
    refreshing,
    getContentListByPage,
    deleteContent,

    pageSize,
    pageIndex,
    updateContent,

    changed,
    setChanged
  };
}
