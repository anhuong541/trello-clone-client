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
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

export const OnUserRegisterAction = () => {
  return useMutation({
    mutationFn: async (dataInput: RegisterInputType) => await server.post("/user/register", dataInput),
    mutationKey: [queryKeys.register],
    onError(error, variables, context) {
      console.log(`${queryKeys.register} error => `, { error, variables, context });
    },
  });
};

export const OnUserLoginAction = () => {
  return useMutation({
    mutationFn: async (dataInput: LoginInputType) => await server.post("/user/login", dataInput),
    mutationKey: [queryKeys.login],
    onError(error, variables, context) {
      console.log(`${queryKeys.login} error => `, { error, variables, context });
    },
  });
};

export const OnUserLogoutAction = () => {
  return useMutation({
    mutationFn: async () => await server.get("/user/logout"),
    mutationKey: [queryKeys.logout],
    onError(error, variables, context) {
      console.log(`${queryKeys.logout} error => `, { error, variables, context });
    },
  });
};

export const QueryUserProjectList = () => {
  return useQuery({
    queryKey: [queryKeys.projectList],
    queryFn: () => server.get(`/project`),
  });
};

export const QueryUserProjectInfo = (projectId: string) => {
  return useQuery({
    queryKey: [queryKeys.projectInfo],
    queryFn: () => server.get(`/project/${projectId}`),
  });
};

export const OnCreateProject = () => {
  return useMutation({
    mutationFn: async (dataInput: CreateProjectInputType) => await server.post(`/project`, dataInput),
    mutationKey: [queryKeys.addProject],
    onError(error, variables, context) {
      console.log(`${queryKeys.addProject} error => `, { error, variables, context });
    },
  });
};

export const OnEditProject = () => {
  return useMutation({
    mutationFn: async (dataInput: EditProjectInputType) => server.put(`/project`, dataInput),
    mutationKey: [queryKeys.editProject],
    onError(error, variables, context) {
      console.log(`${queryKeys.editProject} error => `, { error, variables, context });
    },
  });
};

export const OnDeleteProject = () => {
  return useMutation({
    mutationFn: async (projectId: string) => await server.delete(`/project/${projectId}`),
    mutationKey: [queryKeys.deleteProject],
    onError(error, variables, context) {
      console.log(`${queryKeys.deleteProject} error => `, { error, variables, context });
    },
  });
};

export const OnCreateNewTask = () => {
  return useMutation({
    mutationFn: async (dataInput: TaskInput) => await server.post(`/task`, dataInput),
    mutationKey: [queryKeys.addTask],
    onError(error, variables, context) {
      console.log(`${queryKeys.addTask} error => `, { error, variables, context });
    },
  });
};

export const OnEditTask = () => {
  return useMutation({
    mutationFn: async (dataInput: TaskInput) => await server.put(`/task`, dataInput),
    mutationKey: [queryKeys.updateTask],
    onError(error, variables, context) {
      console.log(`${queryKeys.updateTask} error => `, { error, variables, context });
    },
  });
};

export const OnDeleteTask = () => {
  return useMutation({
    mutationFn: async (props: { projectId: string; taskId: string }) =>
      await server.delete(`/task/${props.projectId}/${props.taskId}`),
    mutationKey: [queryKeys.deleteTask],
    onError(error, variables, context) {
      console.log(`${queryKeys.deleteTask} error => `, { error, variables, context });
    },
  });
};

// members
export const QueryProjectMember = (projectId: string) => {
  return useQuery({
    queryKey: [queryKeys.viewProjectMember],
    queryFn: () => server.get(`/member/${projectId}`),
  });
};

export const OnDeleteMember = () => {
  return useMutation({
    mutationKey: [queryKeys.removeMember],
    onError(error, variables, context) {
      console.log(`${queryKeys.removeMember} error => `, { error, variables, context });
    },
    mutationFn: async (props: { projectId: string; email: string }) =>
      await server.delete(`/member/${props.projectId}/${props.email}`),
  });
};

export const OnAddMember = () => {
  return useMutation({
    mutationKey: [queryKeys.addMember],
    onError(error, variables, context) {
      console.log(`${queryKeys.addMember} error => `, { error, variables, context });
    },
    mutationFn: async (props: { projectId: string; dataInput: MemberAuthorityType }) =>
      await server.post(`/member/${props.projectId}`, props.dataInput),
  });
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
