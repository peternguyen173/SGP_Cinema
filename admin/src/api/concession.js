import instance from './axiosClient';  // Assuming axiosClient is pre-configured

// Get all concessions (Admin and User)
export const getAllConcessions = async () => {
    try {
        const response = await instance.get(`/concession/getall`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all concessions:", error);
    }
};

// Add a new concession (Admin only)
export const addConcession = async (concessionData) => {
    try {
        const response = await instance.post(`/concession/add`, concessionData);
        return response.data;
    } catch (error) {
        console.error("Error adding new concession:", error);
    }
};

// Delete a concession by ID (Accessible by ADMIN only)
export const deleteConcession = async (id) => {
    try {
        const response = await instance.delete(`/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting concession:', error);
    }
};