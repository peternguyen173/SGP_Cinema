export const setAdmin = (admin) => {
    console.log('Dispatching setAdmin:', admin); // Debug log
    return {
        type: "SET_ADMIN",
        payload: admin,
    };
};

export const clearAdmin = () => ({
    type: "CLEAR_ADMIN",
});
