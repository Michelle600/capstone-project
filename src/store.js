import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from './features/expensesSlice.js';

export const store = configureStore({
    reducer: {
        expenses: expensesReducer,
    },
});
