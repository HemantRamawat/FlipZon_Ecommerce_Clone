import './App.css';
import Header from './component/Header/Header';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Fragment ,useState, useEffect,} from 'react';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Navbar from './component/layout/Navbar/Navbar'
import Footer from './component/layout/Footer/Footer'
import Home from './component/layout/Home/Home';
import ProductDetails from './component/Product/ProductDetails';
import LoginSignUp from './component/User/LoginSignUp';
import { useSelector } from "react-redux";
import Products from './component/Product/Products';
import Search from './component/Product/Search.js';
import store from './store';
import { loadUser } from './actions/userAction'
import UserOptions from './component/Header/UserOptions';
import Profile from './component/User/Profile.js';
import ProtectedRoute from './component/Route/ProtectedRoute'
import UpdateProfile from './component/User/UpdateProfile.js'
import UpdatePassword from './component/User/UpdatePassword.js';
import ForgotPassword from './component/User/ForgotPassword.js';
import ResetPassword from './component/User/ResetPassword.js';
import Cart from './component/Cart/Cart.js';
import Shipping from './component/Cart/Shipping.js';
import ConfirmOrder from './component/Cart/ConfirmOrder';
import axios from 'axios';
import Payment from './component/Cart/Payment'
import OrderSuccess from './component/Cart/OrderSuccess'
import MyOrders from './component/Order/MyOrders'
import OrderDetails from './component/Order/OrderDetails'
import Dashboard from './component/admin/Dashboard.js';
import ProductList from './component/admin/ProductList';
import OrderList from './component/admin/OrderList';
import NewProduct from './component/admin/NewProduct';
import UpdateProduct from './component/admin/UpdateProduct';
import ProcessOrder from './component/admin/ProcessOrder';
import UsersList from './component/admin/UsersList';
import UpdateUser from './component/admin/UpdateUser';
import ProductReview from './component/admin/ProductReview'

function App() {

    const { isAuthenticated, user }  = useSelector((state) => state.user)
    const [stripeApiKey, setStripeApiKey] = useState("");
    async function getStripeApiKey(){
          const { data } = await axios.get("/api/v1/stripeapikey");
          setStripeApiKey(data.stripeApiKey);
    }
  React.useEffect(()=>{
    store.dispatch(loadUser());
    getStripeApiKey();
  },[]);
  return (

<Router>
<Fragment>
    <Navbar />
    {   isAuthenticated && <UserOptions user={user} /> }
    { stripeApiKey &&(
      <Elements stripe={loadStripe(stripeApiKey)}>
            <Routes>
    <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="process/payment" element={<Payment />}>
          </Route>
          </Route>
          </Routes>
          </Elements>
    )}
    <Routes>
   

    <Route exact path="/" element={<Home />}></Route>
    <Route exact path="/product/:id" element={<ProductDetails/>}></Route>
    <Route exact path="/products" element={<Products/>}></Route>
    <Route path="/products/:keyword" element={<Products/>}></Route>
    <Route exact path="/search" element={<Search/>}></Route>
    <Route exact path="/login" element={<LoginSignUp/>}></Route>
    {/* <Route exact path="/account" element={<Profile/>}></Route> 
    <Route path="/password/update" element={<UpdatePassword/>}></Route>
    <Route path="/password/forgot" element={<ForgotPassword/>}></Route> */}
   
    <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="account" element={<Profile />}>
          </Route>
    </Route>

    <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="password/update" element={<UpdatePassword />}>
          </Route>
    </Route>
    <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="me/update" element={<UpdateProfile />}>
          </Route>
    </Route>
          <Route exact path="password/forgot" element={<ForgotPassword />}>
          </Route>
          <Route exact path="password/reset/:token" element={<ResetPassword />}>
          </Route>
          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path= "cart" element={<Cart/>}> </Route>
          </Route>
          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="shipping" element={<Shipping />}>
          </Route>
          </Route>

          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="order/confirm" element={<ConfirmOrder />}>
          </Route>
          </Route>
          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="orders" element={<MyOrders />}>
          </Route>
    </Route>


    <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="success" element={<OrderSuccess />}>
          </Route>
          </Route>
          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="order/:id" element={<OrderDetails />}>
          </Route>
          </Route>

          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="admin/dashboard" element={<Dashboard />}>
          </Route>
          </Route>

          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="admin/products" element={<ProductList />}>
          </Route>
          </Route>
          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="admin/orders" element={<OrderList />}>
          </Route>
          </Route>

          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="admin/product" element={<NewProduct />}>
          </Route>
          </Route>


          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="admin/product/:id" element={<UpdateProduct />}>
          </Route>
          </Route>

          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="admin/order/:id" element={<ProcessOrder />}>
          </Route>
          </Route>

          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="admin/users" element={<UsersList />}>
          </Route>
          </Route>

          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="admin/user/:id" element={<UpdateUser />}>
          </Route>
          </Route>

          <Route exact path="/*" element={<ProtectedRoute/>}>
          <Route exact path="admin/reviews" element={<ProductReview />}>
          </Route>
          </Route>


      </Routes>
    <Footer />
 </Fragment>
  </Router>


  );
}

export default App;
