import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, Route, Routes, Outlet } from "react-router-dom";
import Profile from '../User/Profile';
const ProtectedRoute = ({ isAdmin, element: Element, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const doSomething=(isAdmin,isAuthenticated , Element)=>{
    if (isAuthenticated === false) {
      console.log("checking")
     
      navigate("/login");
      window.location.reload()
    }
    if (isAdmin === true && user.role !== "admin") {
              return navigate("/login");
            }
  
      return Element ;
  }
  return (
    <Fragment>
    
    <Fragment>
      {loading === false 
         && (
        <Routes>
        <Route
          {...rest}
          
          element={doSomething(true, isAuthenticated, <Element />)}
          // render={(props) => {
          //   if (isAuthenticated === true) {
          //     console.log("checking")
          //     return navigate("/");
          //   }

            // // if (isAdmin === true && user.role !== "admin") {
            // //   return navigate("/login");
            // }

            // return <Component {...props} />;
          // }}
        >
          </Route>
          </Routes>

      )}
    
    </Fragment>
    <Outlet/>
    </Fragment>
  );
};

export default ProtectedRoute;