import { server } from "@/lib/network";

interface RegisterInputType {
  email: string;
  password: string;
  username: string;
}

interface LoginInputType {
  email: string;
  password: string;
}

export const onUserRegister = async (dataInput: RegisterInputType) => {
  try {
    return await server.post("/user/register", dataInput);
  } catch (error) {
    console.log("user register error: ", error);
  }
};

export const onUserVerifyEmail = async (email: string) => {
  try {
    return await server.post("/user/email-verify", { email });
  } catch (error) {
    console.log("email verify error: ", error);
  }
};

export const onUserLogin = async (dataInput: LoginInputType) => {
  try {
    return await server.post("/user/login", dataInput);
  } catch (error) {
    console.log("email verify error: ", error);
  }
};

export const handleUserInfo = async (userId: string) => {
  try {
    return await server.get(`/user/${userId}`);
  } catch (error) {
    console.log("user project list error: ", error);
  }
};

export const handleUserProjectList = async (userId: string) => {
  try {
    return await server.get(`/project/${userId}`);
  } catch (error) {
    console.log("user project list error: ", error);
  }
};

interface CreateProjectInputType {
  userId: string;
  projectName: string;
  description: string;
}

export const onCreateProject = async (dataInput: CreateProjectInputType) => {
  try {
    return await server.post(`/project`, {
      ...dataInput,
      createAt: Date.now(),
      projectId: "",
    });
  } catch (error) {
    console.log("user project list error: ", error);
  }
};

interface EditProjectInputType {
  userId: string;
  projectId: string;
  projectName: string;
  description: string;
  createAt: number;
}

export const onEditProject = async (dataInput: EditProjectInputType) => {
  try {
    return await server.put(`/project`, dataInput);
  } catch (error) {
    console.log("user project list error: ", error);
  }
};

interface ProjectDeleteInfo {
  projectId: string;
  userId: string;
}

export const onDeleteProject = async (dataInput: ProjectDeleteInfo) => {
  const { projectId, userId } = dataInput;
  try {
    return await server.delete(`/project/${projectId}/${userId}`);
  } catch (error) {
    console.log("user project list error: ", error);
  }
};
