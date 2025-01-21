import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const URL = import.meta.env.VITE_REPLIT_API;


// Format date as DD/MM/YYYY
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

// Upload File To Firebase
export const uploadFileToFirebase = async (file) => {
    try {
        const imageRef = ref(storage, `expenses/${file.name}`);
        const uploadResult = await uploadBytes(imageRef, file);
        const url = await getDownloadURL(uploadResult.ref);
        console.log('Uploaded Image URL:', url);
        return url;
    } catch (error) {
        console.error("Error uploading file to Firebase:", error);
        throw new Error("File upload failed");
    }
}


// Fetch Expenses
export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async () => {
    const response = await axios.get(`${URL}/expenses`);
    const data = response.data.map((expense) => ({
        ...expense,
        date: formatDate(expense.date), 
        month: new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' }), 
        imageUrl: expense.imageurl,
    }));
    return data;
});


// Add Expenses
export const addExpense = createAsyncThunk('expenses/addExpense', async ({ expenseData, file }, { dispatch }) => {

    try {
        let imageUrl = null;
        if (file) {
            imageUrl = await uploadFileToFirebase(file)
        }

        // Ensure date is in DD/MM/YYYY format
        const formattedExpenseData = {
            ...expenseData,
            date: formatDate(expenseData.date),
            month: new Date(expenseData.date).toLocaleString('default', { month: 'long', year: 'numeric' }),
            imageUrl,
        };

        const response = await axios.post(`${URL}/expenses`, formattedExpenseData);
        const newExpense = { ...formattedExpenseData, id: response.data.id } 
        dispatch(fetchExpenses());
        return newExpense;
    } catch (err) {
        console.error(err)
    }
});

// update Expenses
export const updateExpense = createAsyncThunk('expenses/updateExpense', async ({ expenseData, file }, { dispatch }) => {
    try {
        let imageUrl = expenseData.imageurl;
        if (file) {
            imageUrl = await uploadFileToFirebase(file);
        }

        const formattedExpenseData = {
            ...expenseData,
            date: formatDate(expenseData.date), 
            month: new Date(expenseData.date).toLocaleString('default', { month: 'long', year: 'numeric' }),
            imageUrl,
        };

        await axios.put(`${URL}/expenses/${expenseData.id}`, formattedExpenseData);
        dispatch(fetchExpenses());
        return formattedExpenseData;
    } catch (err) {
        console.error(err)
    }
});

// Delete Expenses

export const deleteExpense = createAsyncThunk('expenses/deleteExpense', async (id, { dispatch }) => {
    await axios.delete(`${URL}/expenses/${id}`);


    dispatch(fetchExpenses());
    return id;
});

// Expenses slice
const expensesSlice = createSlice({
    name: 'expenses',
    initialState: {
        expenses: {},
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;

                // Sort all expenses by date in ascending order
                const sortedExpenses = action.payload.sort((a, b) => {
                    const dateA = new Date(a.date.split('/').reverse().join('/'));
                    const dateB = new Date(b.date.split('/').reverse().join('/'));
                    return dateB - dateA; 
                });

                // Group expenses by month
                const groupedExpenses = sortedExpenses.reduce((acc, expense) => {
                    if (!acc[expense.month]) {
                        acc[expense.month] = [];
                    }
                    acc[expense.month].push(expense);
                    return acc;
                }, {});

                // Sort months in descending order (latest first)
                const sortedMonths = Object.keys(groupedExpenses).sort((a, b) => {
                    const dateA = new Date(a);
                    const dateB = new Date(b);
                    return dateB - dateA; 
                });

                // Create a new object with sorted months and sorted expenses inside each month
                const finalSortedExpenses = sortedMonths.reduce((acc, month) => {
                    
                    acc[month] = groupedExpenses[month];
                    return acc;
                }, {});

                state.expenses = finalSortedExpenses;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                const expense = action.payload;
                if (!state.expenses[expense.month]) {
                    state.expenses[expense.month] = [];
                }
                state.expenses[expense.month].push(expense);
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                const updatedExpense = action.payload;
                const month = new Date(updatedExpense.date).toLocaleString('default', { month: 'long', year: 'numeric' });
                if (state.expenses[month]) {
                    const index = state.expenses[month].findIndex((e) => e.id === updatedExpense.id);
                    if (index !== -1) state.expenses[month][index] = updatedExpense;
                }
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                const id = action.payload;
                Object.keys(state.expenses).forEach((month) => {
                    state.expenses[month] = state.expenses[month].filter((e) => e.id !== id);
                });
            });
    },
});

export default expensesSlice.reducer;
