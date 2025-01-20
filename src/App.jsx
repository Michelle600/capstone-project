import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { AuthProvider } from "./components/AuthProvider";
import Expenses from "./pages/Expenses";
import { Provider } from "react-redux";
import { store } from "./store";
import CurrencyExchange from "./pages/CurrencyExchange";
import Receipt from "./pages/Receipt";
import ProtectedRoute from "./components/ProtectedRoute";



export default function App() {
  return (

    <Provider store={store}>    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/currency" element={<CurrencyExchange />} />
            <Route path="/receipt" element={<Receipt />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </Provider>


  );
}
