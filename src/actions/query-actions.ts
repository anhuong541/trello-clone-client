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

interface ProjectIdAndUserIdInput {
  projectId: string;
  userId: string;
}

interface CreateProjectInputType {
  userId: string;
  projectName: string;
  description: string;
}

interface EditProjectInputType {
  userId: string;
  projectId: string;
  projectName: string;
  description: string;
  createAt: number;
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
    console.log("login error: ", error);
  }
};

export const handleUserInfo = async (userId: string) => {
  try {
    return await server.get(`/user/${userId}`);
  } catch (error) {
    console.log("user info error: ", error);
  }
};

export const handleUserProjectList = async (userId: string) => {
  try {
    return await server.get(`/project/${userId}`);
  } catch (error) {
    console.log("user project list error: ", error);
  }
};

export const onCreateProject = async (dataInput: CreateProjectInputType) => {
  try {
    return await server.post(`/project`, {
      ...dataInput,
      createAt: Date.now(),
      projectId: "",
    });
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

export const onDeleteProject = async (dataInput: ProjectIdAndUserIdInput) => {
  const { projectId, userId } = dataInput;
  try {
    return await server.delete(`/project/${projectId}/${userId}`);
  } catch (error) {
    console.log("delete project error: ", error);
  }
};

export const handleViewProjectTasks = async (
  dataInput: ProjectIdAndUserIdInput
) => {
  const { projectId, userId } = dataInput;
  try {
    if (projectId !== "" && userId !== "") {
      return await server.get(`/task/${userId}/${projectId}`);
    }
    return { data: [] };
  } catch (error) {
    console.log("project tasks list error: ", error);
  }
};
