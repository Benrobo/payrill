import React from 'react'
import { BiBell } from 'react-icons/bi'

function TopNavbar() {

    const user = JSON.parse(localStorage.getItem("payrill") as any)

    const avatarImg = {
        background: `url("https://avatars.dicebear.com/api/avataaars/${user.username}.svg")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition:"center"
    }


  return (
    <div className="w-full h-auto flex flex-row items-center justify-between py-2">
        <div id="info" className="w-auto py-2 px-3 flex flex-row items-start justify-start gap-4">
            <div id="img" className="p-4 rounded-[50%] bg-dark-200 border-[3px] border-solid border-blue-200 " style={avatarImg}></div>    
            {/* <div id="info" className="w-auto flex flex-col items-start justify-start">
                <span className="text-[15px] text-white-300 ">Hello, John Doe</span>
                <span className="text-[18px] text-white-300 font-extrabold ">Welcome Back.</span>
            </div> */}
        </div>
        <div id="notification" className="w-auto">
            <button className='relative flex flex-col items-center justify-center p-2 text-[25px] rounded-md scale-[.86] bg-dark-200 text-blue-200'>
                <BiBell />
                {/* <span className="p-2 scale-[.70] bg-blue-200 rounded-[50%] absolute top-[-1px] right-1 "></span> */}
            </button>
        </div>
    </div>
  )
}

export default TopNavbar


