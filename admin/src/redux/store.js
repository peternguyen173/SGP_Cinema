import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth/Reducer";

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default store;