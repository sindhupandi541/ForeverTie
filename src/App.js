import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import LandingPage from './Pages/LandingPage/LandingPage';
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Home from "./Pages/Home/Home";
import Venue from "./Pages/Home/Venue";
import Caterer from "./Pages/Home/Caterer";
import Decorer from "./Pages/Home/Decorer";
import DetailPage from "./Pages/DetailPage/DetailPage";
import Filter from "./Pages/Filter/Filter";
import Cart from "./Pages/Cart/Cart";
import PaymentHistory from "./Pages/Cart/PaymentHistory";
import CheckOut from "./Pages/Cart/CheckOut";
import Admin from "./Pages/Admin/Admin";
import AdminVenue from "./Pages/Admin/Venue";
import AdminDecors from "./Pages/Admin/Decors";
import AdminCaters from "./Pages/Admin/Caters";
import Payments from "./Pages/Admin/Payments";
import AddService from "./Pages/Admin/AddService";
import UpdateService from "./Pages/Admin/UpdateService";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Filter" element={<Filter />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/home/:date/:place" element={<Home />} />
          <Route path="/venue" element={<Venue />} />
          <Route path="/cater" element={<Caterer />} />
          <Route path="/decor" element={<Decorer />} />
          <Route path="/detail/:serviceId" element={<DetailPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/PaymentHistory" element={<PaymentHistory />} />
          <Route path="/Checkout" element={<CheckOut />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/venues" element={<AdminVenue />} />
          <Route path="/decors" element={<AdminDecors />} />
          <Route path="/caters" element={<AdminCaters />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/addService/:category" element={<AddService />} />
          <Route path="/updateService/:id" element={<UpdateService />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
