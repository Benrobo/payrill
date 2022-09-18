import React from 'react'
import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="w-full md:w-[70%] h-screen flex flex-col items-center justify-center text-center px-4 mx-auto">
        <p className="text-[50px] font-sans font-extrabold text-white-100 ">PayRill</p>
        <br />
        <p className="text-[20px] font-extrabold text-white-200  ">
            Blazingly <span className="text-blue-200 font-extrabold font-sans">fast</span> web app to ease checkout processes, reduce queues in physical stores, automate booking processes and make cross border payments with ease.
        </p>
        <br />
        <br />
        <Link to="/auth" className='w-[300px]'>
            <button className="w-[300px] px-4 py-4 flex flex-col items-center justify-center text-white-100 font-extrabold scale-[1] hover:scale-[1.1] rounded-[30px] transition-all bg-blue-300 ">Get Started</button>
        </Link>
    </div>
  )
}

export default HomePage