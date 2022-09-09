import React, { useContext } from 'react'
import { FaLongArrowAltLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { Layout } from '../../components'
import DataContext from '../../context/DataContext'

function UserProfile() {

  const { user, logout } = useContext<any>(DataContext);

  const avatarImg = {
    background: `url("https://avatars.dicebear.com/api/avataaars/${user.username}.svg")`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <Layout sideBarActiveName='profile'>
        <div className="w-full h-screen flex flex-col items-center justify-start px-4 py-3">
            <div className="w-full flex items-center justify-start">
                <Link to="/dashboard">
                    <button className="p-3 flex flex-row items-start justify-center rounded-md bg-dark-200 text-[15px] ">
                        <FaLongArrowAltLeft className="text-[20px] " />
                    </button>
                </Link>
                <p className="text-white-100 font-bold ml-4 ">Profile</p>
            </div>
            <br />
            <br />
            <div className="w-full flex flex-col items-center justify-center">
                <div className="w-[120px] h-[120px] bg-dark-200 rounded-[50%] border-[2px] border-solid border-blue-300 " style={avatarImg}></div>
                <br />
                <p className="text-white-100 font-extrabold"> @{user.username} </p>
                <p className="text-white-300 py-2 text-[15px] ">{user.email}</p>
                <br />
                <br />
                <div className="w-full flex items-center justify-center">
                    <button className="w-[70%] px-4 py-3 flex flex-col items-center justify-center rounded-[30px] font-extrabold bg-dark-100 text-white-100 hover:bg-red-700 border-2 border-solid border-red-700" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default UserProfile