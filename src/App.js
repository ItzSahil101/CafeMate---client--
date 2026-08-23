import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import ItemDetails from "./pages/ItemDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import CafeInfo from "./pages/CafeInfo";
import Orders from "./pages/Orders";

import CustomerFooter from "./components/Menu/CustomerFooter";

import { CartProvider } from "./context/CartContext";

import "./App.css";


// ==========================================
// CUSTOMER PAGE WRAPPER
// ==========================================

function CustomerPage({ children }) {

  return (

    <>

      {children}

      <CustomerFooter />

    </>

  );

}


function App() {

  return (

    <CartProvider>

      <BrowserRouter>

        <Routes>


          {/* =====================================
              HOME
          ====================================== */}

          <Route
            path="/"
            element={
              <CustomerPage>
                <Home />
              </CustomerPage>
            }
          />


          {/* =====================================
              MENU
          ====================================== */}

          <Route
            path="/menu"
            element={
              <CustomerPage>
                <Menu />
              </CustomerPage>
            }
          />


          {/* =====================================
              ITEM DETAILS
          ====================================== */}

          <Route
            path="/menu/:id"
            element={
              <CustomerPage>
                <ItemDetails />
              </CustomerPage>
            }
          />


          {/* =====================================
              CART
          ====================================== */}

          <Route
            path="/cart"
            element={
              <CustomerPage>
                <Cart />
              </CustomerPage>
            }
          />


          {/* =====================================
              CHECKOUT
          ====================================== */}

          <Route
            path="/checkout"
            element={
              <CustomerPage>
                <Checkout />
              </CustomerPage>
            }
          />


          {/* =====================================
              ORDER SUCCESS
          ====================================== */}

          <Route
            path="/order-success/:orderId"
            element={
              <CustomerPage>
                <OrderSuccess />
              </CustomerPage>
            }
          />


          {/* =====================================
              CAFE INFO
          ====================================== */}

          <Route
            path="/cafe"
            element={
              <CustomerPage>
                <CafeInfo />
              </CustomerPage>
            }
          />


          {/* =====================================
              ORDERS
          ====================================== */}

          <Route
            path="/orders"
            element={
              <CustomerPage>
                <Orders />
              </CustomerPage>
            }
          />


          {/* =====================================
              UNKNOWN ROUTE
          ====================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />


        </Routes>

      </BrowserRouter>

    </CartProvider>

  );

}


export default App;