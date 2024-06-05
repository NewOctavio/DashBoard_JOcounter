
import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './Auth/authSlice';
import { dashboardSlice } from './dashboardData/dashboardSlice';


export const store = configureStore({
  reducer: {
   auth: authSlice.reducer,
   DashBoard: dashboardSlice.reducer,
    
  },
});