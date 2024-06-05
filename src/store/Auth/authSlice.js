import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', // 'checking', 'autenticado', 'no-autenticado'
        user: {},
        errorMessage: undefined, 
    },
    reducers: {
        onChecking: (state) => { 
            state.status = 'checking';
            state.user = {};
        },
        onLogin: (state, { payload }) => {
            state.status = 'autenticado';
            state.user = payload;
            state.errorMessage = undefined;
        },
        onLogout: (state, { payload }) => {
            state.status = 'no-autenticado';
            state.user = {};
            state.errorMessage = payload;
        },
        clearErrorMessage: (state) => {
            state.errorMessage = undefined;
        }

    }
});


// Action creators are generated for each case reducer function
export const {
    onChecking,
    onLogin,
    onLogout,
    clearErrorMessage 
} = authSlice.actions;