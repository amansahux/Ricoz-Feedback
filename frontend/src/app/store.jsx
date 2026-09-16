import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice.jsx";
export const store = configureStore({
    reducer: {
        "auth":authReducer
    }
})