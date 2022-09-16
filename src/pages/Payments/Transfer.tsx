import React, { useState, useContext, useEffect } from 'react'
import { Layout } from '../../components'
import { RiSearchLine } from "react-icons/ri"
import { IoIosArrowForward } from "react-icons/io"
import { HiArrowSmLeft } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import Modal from '../../components/UI-COMP/modal'
import { formatCurrency } from '../../utils/creditCard'
import Keyboard from '../../components/UI-COMP/keyboard'
import DataContext from '../../context/DataContext'
import { UsersData } from '../../data'
import { NetworkDataType } from '../../@types'
import { LoaderScreen, LoaderScreenComp } from '../../components/UI-COMP/loader'
import validator from "validator"
import Notification from '../../utils/toast'
import APIROUTES from '../../apiRoutes'
import Fetch from '../../utils/fetch'
import { ErrorScreen } from '../../components/UI-COMP/error'
import { sleep } from '../../utils'


const notif = new Notification(10000)


interface ActiveStateProps {
    dialog: boolean;
    keyboard: boolean;
}

interface TransferNetworkData {
    userId?: string;
    email?: string;
    type: string;
    amount: number | string;
    pin: string;
    currency: string;
}



const searchHistory = localStorage.getItem("payrill-search-history") === null ? [] : JSON.parse(localStorage.getItem("payrill-search-history") as any)


function Transfer() {

    const {pin, clearPin, Data, Loader, Error, setError, setLoader, Currency, setData, clearStep, user} = useContext<any>(DataContext)
    const [activeState, setActiveState] = useState<ActiveStateProps>({
        dialog: false,
        keyboard: false
    })
    const [searchValue, setSearchValue] = useState<string>("")
    const [selectedUser, setSelectedUser] = useState<any>({
        currency: Currency
    })
    const [transferData, setTransferData] = useState<TransferNetworkData>({
        userId: "",
        email: "",
        type: "",
        amount: "",
        pin: "",
        currency: ""
    })

    const storageUserData = localStorage.getItem("payrill-users") === null ? [] : JSON.parse(localStorage.getItem("payrill-users") as any)


    useEffect(()=>{
        fetchAllUsers()
    },[])

    async function fetchAllUsers(){
        try{
            const url = APIROUTES.getAllUsers;
            setLoader((prev: any)=>({...prev, users: true}))
            const {res, data} = await Fetch(url, {
                method: "GET"
            });
            setLoader((prev: any)=>({...prev, users: false}))

            if(!data.success){
                return setError((prev: any)=>({...prev, users: data.error}));
            }

            const {id} = user;
            const usersData = data.data.filter((user: any)=> user.id !== id);
            localStorage.setItem("payrill-users", JSON.stringify(usersData));
            setError((prev: any)=>({...prev, users: null}));
        }   
        catch(e: any){
            setLoader((prev: any)=>({...prev, users: false}))
            setError((prev: any)=>({...prev, users: e.message}));
        }
    }


    function handleActiveState(e: any, state?: boolean){
        const dataset = e.target.dataset
        if(Object.entries(dataset).length > 0){
            const {name, id, type} = dataset;
            if(name === "dialog"){
                if(type === "user") {
                    setTransferData((prev: any)=>({
                        ...prev,
                        userId: id 
                    }))
                    setActiveState((prev)=> ({...prev, ["dialog"]: !activeState.dialog}))
                }
                // if(type === "email") {
                //     setSelectedUser((prev: any)=>({
                //         ...prev,
                //         email: id,
                //         type
                //     }))
                //     setActiveState((prev)=> ({...prev, ["dialog"]: !activeState.dialog}))
                // }

                clearStep("dialog", 1)
                clearPin()
            }
        }
    }

    function toggleKeyboard(){
        if(activeState.keyboard) clearPin()
        setActiveState((prev)=> ({...prev, ["keyboard"]: !activeState.keyboard}))
    }

    function closeDialogModal(){
        setActiveState((prev)=> ({...prev, ["dialog"]: !activeState.dialog}))
    }

    // search users
    function searchUsers(e: any){
        const value = e.target.value.toLowerCase();
        let filteredData : any;
        if(value.includes("@")){
            // update search value
            if(validator.isEmail(value)) setSearchValue(value)

            let newVal = value.replace("@", "")
            filteredData = storageUserData.filter((data: any)=> data.username.includes(newVal))
            return setData((prev: any)=> ({...prev, ["users"]: filteredData}))
        }
        
        filteredData = storageUserData.filter((data: any)=> data.name.toLowerCase().includes(value))
        setData((prev: any)=> ({...prev, ["users"]: filteredData}))

        // clear state if input is empty
        if(value === "") {
            setData((prev: any)=> ({...prev, ["users"]: []}))
            setSearchValue("")
        }
    }


    // handle keyboard data
    async function handleTransactionData(){
        transferData["pin"] = pin.originalPin
        console.log(transferData);
        try{
            const url = APIROUTES.transferFund.replace(":receiverId", transferData.userId as any);
            setLoader((prev: any)=>({...prev, transfer: true}))
            const {res, data} = await Fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    amount: +transferData.amount,
                    currency: transferData.currency,
                    pin: transferData.pin
                })
            });
            setLoader((prev: any)=>({...prev, transfer: false}))

            if(!data.success){
                return notif.error(data.message)
            }

            notif.success(data.message)
            await sleep(1.1)
            toggleKeyboard()
            clearStep("dialog", 1)
            clearPin()
            setActiveState((prev: any)=> ({...prev, ["dialog"]: false}))
        }   
        catch(e: any){
            setLoader((prev: any)=>({...prev, transfer: false}))
            notif.error(`An Error occured: ${e.message}`)
        }
    }

    return (
        <Layout>
            <div className={`w-full md:w-[500px] h-screen bg-dark-100 fixed top-0 z-[20]`}>
                <div id="head" className="relative w-full h-auto flex flex-col items-center justify-center px-3 py-3">
                    <Link to="/dashboard">
                        <button className="px-3 py-2 flex flex-row items-center justify-center rounded-md text-[12px] hover:bg-dark-200 text-white-300 gap-3 absolute top-2 left-0 ">
                            <HiArrowSmLeft className="text-[20px] " /> Back
                        </button>
                    </Link>
                    <p className="text-white-200 font-extrabold">Choose Recipient</p>
                    <br />
                </div>
                <div id="input" className="w-full h-auto flex flex-row items-center justify-start bg-dark-200 rounded-md  px-3 py-1">
                    <RiSearchLine className='text-white-300 text-[20px] ' />
                    <input type="text" className="w-full px-4 py-2 border-none outline-none bg-none bg-dark-200 font-extrabold " placeholder='@username' onChange={searchUsers} />
                </div>
                <br />

                {
                    Loader.users ?
                        <LoaderScreenComp full={true} />
                        :
                    Error.users !== null ?
                        <ErrorScreen text={Error.users} />
                    :
                    <SearchComponent 
                        handleActiveState={handleActiveState} 
                        data={storageUserData} 
                        searchInput={searchValue} 
                    />
                }


                {activeState.dialog && <TransferDialog 
                    active={activeState.dialog} 
                    handleActiveState={closeDialogModal} 
                    toggleKeyboard={toggleKeyboard} 
                    data={selectedUser} 
                    setTransferData={setTransferData} 
                    transferData={transferData}
                />}

                <Keyboard active={activeState.keyboard} toggleKeyboard={toggleKeyboard} handler={handleTransactionData} />
                
                {Loader.transfer && <LoaderScreen />}
            </div>
        </Layout>
    )
}

export default Transfer

function SearchComponent({handleActiveState, data, searchInput}: any) {

    const avatarImg = {
        
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
    };

    // if(data.length > 0){
    //     localStorage.setItem("payrill-search-history", JSON.stringify(data))
    // }
    

    return (
        <div className="w-full h-auto px-3 flex flex-col items-center justify-center gap-3">
            <div className="w-full flex flex-row items-start justify-start">
                <p className="text-white-300 text-[15px] ">All Users</p>
            </div>
            {
                data.length === 0 ?
                    <ErrorScreen full={true} text="No user were found" />
                    :
                data.map((list: any, i: number)=>(
                    <div id="card" key={i} className="w-full flex flex-row items-row justify-between py-2 rounded-[12px] cursor-pointer" data-name="dialog" data-type="user" data-id={list.id} onClick={handleActiveState}>
                        <div id="left" data-name="dialog" className="w-auto flex flex-row items-start justify-start gap-3">
                            <div
                                id="img"
                                className="p-6 rounded-[50%] bg-dark-200 border-[3px] border-solid border-blue-200 "
                                style={{...avatarImg, background: `url("https://avatars.dicebear.com/api/avataaars/${list.username}.svg")`}}
                            ></div>
                            <div className="w-auto flex flex-col items-start justify-start">
                                <span className="text-white-200 text-[15px] font-extrabold capitalize ">
                                    {list.name}
                                </span>
                                <span className="text-white-300 text-[12px]">
                                    @{list.username}
                                </span>
                            </div>
                        </div>
                        <div id="right" className="w-auto flex flex-col items-center justify-center">
                            <IoIosArrowForward className='text-white-100' />
                        </div>
                    </div>
                ))
            }
            <br />
            {/* {searchInput !== "" && <div className="w-full">
                <p className="text-white-300 text-[15px] ">By Email: </p>
                <div id="card" className="w-full flex flex-row items-row justify-between py-2 rounded-[12px] cursor-pointer" data-name="dialog" data-type="email" data-id={searchInput} onClick={handleActiveState}>
                    <div id="left" data-name="dialog" className="w-auto flex flex-row items-start justify-start gap-3">
                        <div
                            id="img"
                            className="p-6 rounded-[50%] bg-dark-200 border-[3px] border-solid border-blue-200 "
                            style={{...avatarImg, background: `url("https://avatars.dicebear.com/api/avataaars/${searchInput}.svg")`}}
                        ></div>
                        <div className="w-auto flex flex-col items-start justify-start">
                            <span className="text-white-200 text-[15px] font-extrabold capitalize ">
                                {searchInput}
                            </span>
                        </div>
                    </div>
                    <div id="right" className="w-auto flex flex-col items-center justify-center">
                        <IoIosArrowForward className='text-white-100' />
                    </div>
                </div>
            </div>} */}
        </div>
    )
}

function TransferDialog({active, handleActiveState, toggleKeyboard, data, setTransferData, transferData}: any){
    const {steps, setSteps} = useContext<any>(DataContext)

    const handleStep = (step?: number)=>{
        if(step === 1){
            const {currency, amount} = transferData;
            if(amount === "") return notif.error("amount cant be empty.")
            if(currency === "") return notif.error("currency cant be empty.")
        }
        setSteps((prev: any)=>({...prev, ["dialog"]: 2}))
    }

    return (
        <Modal isActive={active} clickHandler={handleActiveState} >
            <div id="dailog-box" className="w-full h-[380px] bg-dark-200 rounded-t-[30px] absolute bottom-0 left-0 px-5 py-3 flex flex-col items-center justify-start ">
                <div id="knob" className="w-[50px] h-[5px] rounded-[50px] absolute top-3 bg-white-400 "></div>
                {
                    steps.dialog === 1 ?
                        <Step1 handleStep={handleStep} data={transferData} setTransferData={setTransferData} />
                        :
                        <Step2 toggleKeyboard={toggleKeyboard} setTransferData={setTransferData} transferData={transferData} />
                }
            </div>
        </Modal>
    )
}


function Step1({handleStep, data, setTransferData}: any){

    const {walletInfo, Loader, Error} = useContext<any>(DataContext)
    const [balance, setBalance] = useState(0);
    const [currency, setCurrency] = useState("");



    const avatarImg = {
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
    };

    const storageData = JSON.parse(localStorage.getItem("payrill-users") as any);
    const userData = storageData.filter((udata: any) => udata.id === data.userId)[0];

    const handleInput = (e: any)=>{
        const value = e.target.value;
        setTransferData((prev: any)=>({...prev, currency: value}))
        setCurrency(value)
    }

    useEffect(()=>{
        if(currency === "") return;
        getWalletBalance(currency)
    },[currency])

    function getWalletBalance(currency: string){
        if(Object.entries(walletInfo).length === 0) return
        let filterCurr;
        if(typeof currency === "undefined" || currency === ""){
          filterCurr = walletInfo.accounts[0];
          setCurrency(filterCurr.currency)
          setBalance(filterCurr.balance)
          return;
        }
        filterCurr = walletInfo.accounts.filter((curr: any)=> curr.currency === currency)[0]
        setCurrency(filterCurr.currency)
        setBalance(filterCurr.balance)
    }

    return (
        <>
            <div id="head" className="w-full flex flex-col items-center justify-center mt-5">
                <p className="text-white-300">PayRill Balance : <span className="text-white-100 font-extrabold"> { currency === "" ? "" : formatCurrency(currency, balance)} </span> </p>
            </div>
            <div id="content" className="w-full flex flex-col items-center justify-center mt-5">
                <div id="img" className="w-[50px] h-[50px] rounded-[50%] bg-dark-100 border-[3px] border-solid border-blue-200 " style={{...avatarImg, background: `url("https://avatars.dicebear.com/api/avataaars/${userData?.username}.svg")`,}}
                ></div>
                <br />
                {
                    typeof data.type !== "undefined" && data.type === "user" ? 
                        <>
                            <p className="text-white-100 font-extrabold">{data.fullName}</p>
                            <p className="text-white-300">@{data.username}</p>
                        </>
                        :
                        <>
                            <p className="text-white-100 font-extrabold">{data?.email?.split("@")[0]}</p>
                            <p className="text-white-300">{data.email}</p>
                        </>
                }
                <br />
                <input type="number" value={data.amount} placeholder='200' className="w-full px-4 py-3 rounded-[30px] bg-dark-100 border-[1px] border-solid border-blue-200 " onChange={(e: any)=> setTransferData((prev: any)=> ({...prev, ["amount"]: e.target.value}))} autoFocus={true} />
                <br />
                <select name="" id="" onChange={handleInput} className="w-full px-4 py-3 bg-dark-100 text-white-100 rounded-[30px]">
                    <option value="">Select Currency Account</option>
                    {
                        Loader.wallet ? 
                            <option value="">Loading...</option>
                            :
                        Error.wallet ?
                            <option value="">{Error.wallet}</option>
                            :
                        walletInfo.accounts.map((act: any)=>(
                            <option value={act.currency} key={act.id}>{act.currency}</option>
                        ))
                    }
                </select>
                <br />
                <button className="w-full flex flex-col rounded-[30px] px-4 py-3 items-center justify-center bg-blue-300 transition-all scale-[1] hover:scale-[.95] text-white-100 font-extrabold " onClick={()=>handleStep(1)}>
                    Transfer
                </button>
                <br />
            </div>
        </>
    )
}


function Step2({toggleKeyboard, transferData}: any){

    const {user} = useContext<any>(DataContext)
    
    const storageData = JSON.parse(localStorage.getItem("payrill-users") as any);
    const userData = storageData.filter((udata: any) => udata.id === transferData.userId)[0];
    
    const avatarImg = {
        background: `url("https://avatars.dicebear.com/api/avataaars/${userData.username}.svg")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
    };

    useEffect(()=>{
    },[])

    // const returnUserName = ()=>{
    //     const {type, email, username} = transferData;
    //     if(type === "email") return email?.split("@")[0];
    //     return username
    // }

    return (
        <>
            <div id="head" className="w-full flex flex-col items-center justify-center mt-5">
                <p className="text-white-200 font-extrabold">Review Transaction</p>
            </div>
            <div id="content" className="w-full flex flex-col items-center justify-center mt-5">
                <div id="img" className="w-[50px] h-[50px] rounded-[50%] bg-dark-100 border-[3px] border-solid border-blue-200 " style={avatarImg}
                ></div>
                <br />
                <p className="text-white-300">@{userData.username}</p>
                
                <br />
                <div className="w-full flex flex-col items-center justify-between gap-3">
                    <div className="w-full flex flex-row items-center justify-between">
                        <span className="text-white-300 text-[14px]">To</span>
                        <span className="text-white-100 text-[13px] font-extrabold">
                            {userData.username}
                        </span>
                    </div>
                    <div className="w-full flex flex-row items-center justify-between">
                        <span className="text-white-300 text-[14px]">From</span>
                        <span className="text-white-100 text-[13px] font-extrabold">{user.username}</span>
                    </div>
                    <div className="w-full flex flex-row items-center justify-between">
                        <span className="text-white-300 text-[14px]">Amount</span>
                        <span className="text-white-100 text-[13px] font-extrabold"> {formatCurrency(transferData.currency, +transferData.amount)} </span>
                    </div>
                </div>
                <br />
                <button className="w-full flex flex-col rounded-[30px] px-4 py-3 items-center justify-center border-[1px] border-solid border-blue-200 bg-blue-400 hover:bg-dark-100 text-white-100 font-extrabold " data-name="keyboard" onClick={(e)=>toggleKeyboard(e, "keyboard")}>
                    Proceed
                </button>
                <br />
            </div>
        </>
    )
}