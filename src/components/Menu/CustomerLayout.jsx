import React from "react";

import {
  Outlet,
} from "react-router-dom";

import CustomerFooter from "./CustomerFooter";


function CustomerLayout() {

  return (

    <>

      <Outlet />

      <CustomerFooter />

    </>

  );

}


export default CustomerLayout;