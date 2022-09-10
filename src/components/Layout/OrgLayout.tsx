import React, { useEffect, useRef, useState } from "react";
import { Sidebar, Header, DomHead } from "..";
import { DEVICE_WIDTH } from "../../config";


type OrgLayoutProps= {
  children: React.ReactNode
  sideBarActiveName?: string;
  includeNav?: boolean;
  width?: string | number;
}

function OrgLayout({ sideBarActiveName, children }: OrgLayoutProps) {

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden " >
      <DomHead />
      <div id="device-container" className={`relative w-full h-screen flex items-start justify-start overflow-y-scroll`}>
        <Sidebar activeName={sideBarActiveName} />
        <div className={` w-full h-screen overflow-y-hidden text-white-100`}>
          {children}
          <div className="w-full h-[200px] "></div>
        </div>
      </div>
    </div>
  );
}

export default OrgLayout;

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
