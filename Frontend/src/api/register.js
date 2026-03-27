import API from "./axios.js";

export const registerUser = async (formData) => {
    const { data } = await API.post("/auth/register", formData);
    return data;
};