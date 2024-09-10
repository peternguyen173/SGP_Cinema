import axiosClient from "./axiosClient";

export const getAllConcessions = async (token) => {
    try {
        const response = await axiosClient.get("/api/concession/getall", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        return response.data;
    } catch (error) {
        throw new Error("Error getting concession data.");
    }
};

export const addConcession = async (token, formDatam) => {
    try {
        const response = await axiosClient.post("/api/concession/add", formData, {
            header: {
                "Authorization": "Bearer " + token
            }
        });
        return response.data;

    } catch (error) {
        throw new Error("Error adding concession.");
    }
};