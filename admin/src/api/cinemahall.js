import instance from "./axiosClient";

export const createHallWithSeats = async (hallWithSeats) => {
    try {
        const response = await instance.post("/hall", hallWithSeats); // Adjust endpoint if necessary
        return response;
    } catch (error) {
        console.error("Error creating cinema hall with seats:", error);
    }
}

// Create a new cinema hall (Admin required)
export const createHall = async (hall) => {
    try {
        const response = await instance.put("/hall/new", hall);
        return response.data;
    } catch (error) {
        console.error("Error creating cinema hall:", error);
    }
}

// Update a cinema hall (Admin required)
export const updateHall = async (hall) => {
    try {
        const response = await instance.put(`/hall/${hall.id}/edit`, hall);
        return response.data;
    } catch (error) {
        console.error("Error updating cinema hall:", error);
    }
}

// Delete a cinema hall by ID (Admin required)
export const deleteHall = async (id) => {
    try {
        const response = await instance.delete(`/hall/${id}/delete`);
        return response.data;
    } catch (error) {
        console.error("Error deleting cinema hall:", error);
    }
}

// Get a cinema hall by ID
export const getHallById = async (id) => {
    try {
        const response = await instance.get(`/hall/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching cinema hall details:", error);
    }
}

// Get all cinema halls
export const getAllHalls = async () => {
    try {
        const response = await instance.get(`/hall/getall`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all cinema halls:", error);
    }
}



// Get all seats in a cinema hall by hall ID
export const getSeatsByHallId = async (hall_id) => {
    try {
        const response = await instance.get(`/hall/${hall_id}/seat/getall`);
        return response.data;
    } catch (error) {
        console.error("Error fetching seats in cinema hall:", error);
    }
}

export const getHallByName = async (hallName) => {
    try {
        const response = await instance.get(`/hall/byname/${hallName}`);
        return response.data;
    }
    catch (e){
    console.log(e);
    }
};

// Update seats in a cinema hall by hall ID (Admin required)
export const updateSeatsInHall = async (hall_id, seatRequest) => {
    try {
        const response = await instance.put(`/hall/${hall_id}/seats/edit`, seatRequest);
        return response.data;
    } catch (error) {
        console.error("Error updating seats in cinema hall:", error);
    }
}

