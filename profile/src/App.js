import logo from "./logo.svg";
import "./App.css";
import CustomerRegister from "./pages/customerRegister";
import Check from "./pages/check";
import CustomerError from "./pages/error/customerError";
import RegisterComplete from "./pages/registerComplete";
import AdminLogin from "./pages/login";
import AdminTop from "./pages/adminTop";
import AdminWrittenConsent from "./pages/adminWrittenConsent";
import AdminCustomerDetail from "./pages/adminCustomerDetail";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* お客様画面 */}
        <Route path="/" element={<CustomerRegister />} />
        <Route path="/check" element={<Check />} />
        <Route path="/complete" element={<RegisterComplete />} />
        <Route path="/error" element={<CustomerError />} />
        {/* 従業員画面 */}
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/admin_top" element={<AdminTop />} />
        <Route
          path="/admin_written_consent/:customerId"
          element={<AdminWrittenConsent />}
        />
        <Route
          path="/admin_customer_detail/:customerId"
          element={<AdminCustomerDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
