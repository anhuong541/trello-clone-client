import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { server, serverCl } from "@/lib/network";
import {
  CreateProjectInputType,
  MemberAuthorityType,
  EditProjectInputType,
  LoginInputType,
  RegisterInputType,
  TaskInput,
} from "@/types/query-types";

export const onUserRegister = async (dataInput: RegisterInputType) => {
  return await server.post("/user/register", dataInput);
};

export const onUserLogin = async (dataInput: LoginInputType) => {
  return await server.post("/user/login", dataInput);
};

export const onUserLogout = async () => {
  try {
    return await server.get("/user/logout");
  } catch (error) {
    console.log("logout error: ", error);
  }
};

export const handleUserInfo = async (cookie: ReadonlyRequestCookies) => {
  const token = cookie.get("user_session")?.value;

  try {
    return await serverCl
      .get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data);
  } catch (error) {
    console.log("user info error: ", error);
  }
};

export const handleUserProjectList = async () => {
  try {
    return await server.get(`/project`);
  } catch (error) {
    console.log("user project list error: ", error);
  }
};

export const handleProjectInfo = async (projectId: string) => {
  try {
    return await server.get(`/project/${projectId}`);
  } catch (error) {
    console.log("user project info error: ", error);
  }
};

export const onCreateProject = async (dataInput: CreateProjectInputType) => {
  try {
    return await server.post(`/project`, dataInput);
  } catch (error) {
    console.log("create project error: ", error);
  }
};

export const onEditProject = async (dataInput: EditProjectInputType) => {
  try {
    return await server.put(`/project`, dataInput);
  } catch (error) {
    console.log("edit project error: ", error);
  }
};

export const onDeleteProject = async (projectId: string) => {
  try {
    return await server.delete(`/project/${projectId}`);
  } catch (error) {
    console.log("delete project error: ", error);
  }
};

export const callViewProjectTasks = async (projectId: string) => {
  if (projectId === "") {
    return { data: [] };
  }
  return await server.get(`/task/${projectId}`);
};

export const onCreateNewTask = async (dataInput: TaskInput) => {
  try {
    return await server.post(`/task`, dataInput);
  } catch (error) {
    console.log("add task error: ", error);
  }
};

export const onChangeTaskState = async (dataInput: TaskInput) => {
  try {
    return await server.put(`/task`, dataInput);
  } catch (error) {
    console.log("change task error: ", error);
    return error;
  }
};

export const onDeleteTaskFunction = async (props: { projectId: string; taskId: string }) => {
  try {
    return await server.delete(`/task/${props.projectId}/${props.taskId}`);
  } catch (error) {
    console.log("delete task error: ", error);
    return error;
  }
};

// members
export const viewProjectMemberAction = async (projectId: string) => {
  try {
    return await server.get(`/member/${projectId}`);
  } catch (error) {
    console.log("view members error: ", error);
  }
};

export const onRemoveMemberOutOfProject = async (props: { projectId: string; email: string }) => {
  try {
    return await server.delete(`/member/${props.projectId}/${props.email}`);
  } catch (error) {
    console.log("remove member error: ", error);
  }
};

export const onAddMemberOnProject = async (props: {
  projectId: string;
  dataInput: MemberAuthorityType;
}) => {
  return await server.post(`/member/${props.projectId}`, props.dataInput);
};
