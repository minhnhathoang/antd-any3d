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

  const { notifications, trigger } = useModel('noti');


  const getContentListByPage = async (projectId: string, pageIndex: number, pageSize: number) => {
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

  const searchContent = async (projectId: string, pageIndex: number, pageSize: number, searchKey: string) => {
    setRefreshing(true);
    try {
      const res = await sendGetContentListByPageQry(projectId, pageIndex, pageSize, searchKey);
      if (res.success) {
        setPageContent(res);
        setPageIndex(res.pageIndex);
        setPageSize(res.pageSize);
      }
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    console.log("Trigger: content", trigger);
  }, [trigger, notifications]);

  useEffect(() => {
    if (selectedProject?.id) {
      getContentListByPage(selectedProject.id, pageIndex, pageSize);
    } else {
      setPageIndex(1);
      setPageSize(5);
      setPageContent(undefined);
    }
  }, [selectedProject]);

  const updateContent = async (id: string, body: ContentUpdateCmd) => {
    try {
      const res = await sendUpdateContent(id, body);
      message.info("Content updated successfully");
      return res;
    } catch (e) {
      message.error("Failed to update content");
    }
    return undefined;
  }

  const deleteContent = async (id: string) => {
    try {
      await sendDeleteContent(id);
      message.info("Content deleted successfully");
      await getContentListByPage(selectedProject?.id, pageIndex, pageSize);
    } catch (e) {
      message.error("Failed to delete content");
    }
  }


  return {
    pageContent,
    setPageContent,

    refreshing,
    getContentListByPage,
    searchContent,
    deleteContent,

    pageSize,
    pageIndex,
    updateContent,

    changed,
    setChanged
  };
}
