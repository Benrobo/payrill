import React, { useState, useContext, useEffect } from "react";
import DataContext from "../../context/DataContext";
import { Navigate, Route } from "react-router-dom";
import { ErrorScreen } from "../UI-COMP/error";
// import {Route} from "react-router"

type ProtectedRouteProps = {
  children: React.ReactNode
}

const ProtectedRoute = ({ children, ...rest }: ProtectedRouteProps) => {
  const { isAuthenticated } = useContext<any>(DataContext);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(()=>{
    setIsOnline(navigator.onLine)
  },[navigator.onLine])

  if(!isOnline){
    // return <ErrorScreen text="Opps, you're OFFLINE" full={true} />
  }

  // const isAuthenticated = true;
  return <>{
    isAuthenticated ? 
      children 
      : 
      <Navigate to={"/auth"} />
  }</>;
}

export default ProtectedRoute;

