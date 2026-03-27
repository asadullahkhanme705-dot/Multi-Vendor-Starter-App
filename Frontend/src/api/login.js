import API from "./axios.js";

export const loginUser = async (formData) => {
    const { data } = await API.post("/auth/login", formData);
    return data;
};