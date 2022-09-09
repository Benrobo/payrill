import React, { useEffect, useRef, useState } from "react";
import { Header, DomHead } from "..";
import { DEVICE_WIDTH } from "../../config";
import BottomNavbar from "../Navbar/bottomNav";


type LayoutProps= {
  children: React.ReactNode
  sideBarActiveName?: string;
  includeNav?: boolean;
  width?: string | number;
}

function Layout({ sideBarActiveName, includeNav = true, children }: LayoutProps) {

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden " >
      <DomHead />
      <div id="device-container" className={`relative w-full md:w-[500px] md:w-[${DEVICE_WIDTH}] h-screen overflow-y-scroll`}>
        <div className={`w-full h-auto text-white-100`}>
         <Content count={0} />          
          {children}
          {/* <div className="w-full h-[200px] "></div> */}
        </div>
        {includeNav && <BottomNavbar activeName={sideBarActiveName} />}
      </div>
    </div>
  );
}

export default Layout;

function Content({count = 20}: any){
  return (
    <div className="w-full">
      {
        Array(count).fill(count).map((data)=>(
          <p>
            
          </p>
        ))
      }
    </div>
  )
}
