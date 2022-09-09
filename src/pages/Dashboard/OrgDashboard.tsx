import React from "react";
import { GiWallet } from "react-icons/gi";
import { MdProductionQuantityLimits } from "react-icons/md";
import OrgLayout from "../../components/Layout/OrgLayout";
import { getLastPathName } from "../../utils";
import { formatCurrency } from "../../utils/creditCard";

function OrgDashboard() {

  const cardStyle = {
    backgroundImage: `url("")`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <OrgLayout sideBarActiveName="home">
      <div className="w-full flex flex-col items-between justify-between px-5 mt-5">
        <div className="w-auto flex items-start justify-start gap-5 border-b-[1px] border-solid border-dark-500 pb-2 ">
            <div className="w-[70px] h-[70px] bg-dark-200 rounded-md p-2 cursor-pointer  " style={{...cardStyle}}></div>
            <div className="w-auto flex flex-col items-start justify-start">
                <p className="text-white-100 text-[20px] font-extrabold "> <span className="text-white-300 font-extralight text-[14px] ">Welcome Back </span> Tesla</p>
                <p className="text-white-200 font-extrabold text-[15px] ">User Name</p>
            </div>
        </div>
        <br />
        <br />
        <div className="w-full flex items-center justify-start gap-5">
            <div className="w-[300px] h-auto p-5 rounded-md bg-dark-200 flex items-start flex-col justify-between ">
                <div className="w-auto flex items-start justify-start gap-3">
                    <GiWallet className=" p-1 rounded-md bg-green-700 text-green-400 text-[50px] " />
                    <div className="w-auto">
                        <p className="text-white-200 font-extrabold text-[20px] ">Balance</p>
                    </div>
                </div>
                <br />
                <div className="w-auto flex flex-col items-start justify-start">
                    <p className="text-white-100 font-extrabold text-[30px] ">{formatCurrency("USD", 4500)}</p>
                </div>
            </div>

            <div className="w-[300px] h-auto p-5 rounded-md bg-dark-200 flex items-start flex-col justify-between ">
                <div className="w-auto flex items-start justify-start gap-3">
                    <MdProductionQuantityLimits className=" p-1 rounded-md bg-blue-900 text-blue-200 text-[50px] " />
                    <div className="w-auto">
                        <p className="text-white-200 font-extrabold text-[20px] ">Products</p>
                    </div>
                </div>
                <br />
                <div className="w-auto flex flex-col items-start justify-start">
                    <p className="text-white-100 font-extrabold text-[30px] ">800</p>
                </div>
            </div>

            <div className="w-[300px] h-auto p-5 rounded-md bg-dark-200 flex items-start flex-col justify-between ">
                <div className="w-auto flex items-start justify-start gap-3">
                    <MdProductionQuantityLimits className=" p-1 rounded-md bg-blue-900 text-blue-200 text-[50px] " />
                    <div className="w-auto">
                        <p className="text-white-200 font-extrabold text-[20px] ">Total Transactions</p>
                    </div>
                </div>
                <br />
                <div className="w-auto flex flex-col items-start justify-start">
                    <p className="text-white-100 font-extrabold text-[30px] ">800</p>
                </div>
            </div>
        </div>
      </div>
    </OrgLayout>
  );
}

export default OrgDashboard;
