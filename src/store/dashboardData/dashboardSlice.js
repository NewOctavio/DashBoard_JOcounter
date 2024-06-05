import { createSlice } from '@reduxjs/toolkit';

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        XMLs: [],
        totales: {}

    },
    reducers: {
        Datos_insert: (state, { payload }) => {
            state.XMLs.push(payload);
        },
        totales_Insert: (state, { payload }) => {
            state.totales = payload;
        }
    }
});


// Action creators are generated for each case reducer function
export const { Datos_insert, totales_Insert } = dashboardSlice.actions;