import { configureStore } from '@reduxjs/toolkit';
import expensesReducer from '../src/features/expensesSlice.js';

export const store = configureStore({
    reducer: {
        expenses: expensesReducer,
    },
});
