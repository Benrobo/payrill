import React, { useContext, useEffect, useState } from 'react'
import OrgLayout from '../../components/Layout/OrgLayout'
import milkImg from "../../assets/images/products/milk.png"
import { MdProductionQuantityLimits } from 'react-icons/md'
import { QrReader } from 'react-qr-reader';
import DataContext from '../../context/DataContext';
import APIROUTES from '../../apiRoutes';
import Fetch from '../../utils/fetch';
import { LoaderScreenComp } from '../../components/UI-COMP/loader';
import { ErrorScreen } from '../../components/UI-COMP/error';
import { formatCurrency } from '../../utils/creditCard';

function Verify() {

  const {Data, Loader, walletInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext)
  const [activeState, setActiveState] = useState("scanner")
  const [qrcodeId, setQrcodeId] = useState("")


  const toggleActiveState = (name: string)=> setActiveState(name)

  const cardStyle = {
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }

  const qrcodeconstraints = {
    facingMode: "user"
  }

  function handleQrcodeResult(result: any, error: any){
    if (!!result) {
      setQrcodeId(result?.text);
    }
    if (!!error) {
      // console.info(error);
    }
  }

  useEffect(()=>{
    // if(qrcodeId === "") return;
    getItemById("d26d5203-5448-4d83-bc82-0d2ccb4e516f")
  },[qrcodeId])

  async function getItemById(itemId: string){
    try {

      setLoader((prev: any)=>({...prev, getAllEcartItems: true}))
      const url = APIROUTES.getStoreItemById.replace(":itemId", itemId);

      const {res, data} = await Fetch(url, {
        method: "GET",
      });
      setLoader((prev: any)=>({...prev, getAllEcartItems: false}))

      if(!data.success){
        setError((prev: any)=>({...prev, getAllEcartItems: data.message}))
        return
      }
      setError((prev: any)=>({...prev, getAllEcartItems: null}))
      setData((prev: any)=>({...prev, ecartItems: [data.data.item]}))
    } catch (e: any) {
      setLoader((prev: any)=>({...prev, getAllEcartItems: false}))
      setError((prev: any)=>({...prev, getAllEcartItems: `An Error Occured:  ${e.message}`}))
    }
  }


  return (
    <OrgLayout sideBarActiveName='verify'>
      <div className="w-full h-screen flex items-start justify-start">
        <div id="" className="w-full h-screen flex flex-col items-start justify-start px-4 py-3 gap-4">
          <div className="w-full flex flex-col items-start justify-start">
            <p className="text-white-200 font-extrabold">Cart</p>
            <p className="text-white-300">cart items</p>
          </div>
          <br />
          <div className="w-full h-[450px] flex flex-col items-start justify-start gap-10 overflow-y-scroll noScrollBar showBar ">
            {

              Loader.getAllEcartItems ? 
                <LoaderScreenComp full={true} />
                :
              Error.getAllEcartItems !== null ?
                <ErrorScreen size='md' full={true} text={Error.getAllEcartItems} />
                :
              Data.ecartItems.length > 0 ?  
                Data.ecartItems.map((data: any, i: number)=>(
                  <div key={i} className="w-[600px] rounded-md bg-dark-200 flex items-center justify-between p-4">
                    <div className="w-auto flex items-start justify-start gap-5">
                      <div className="w-[50px] h-[50px] bg-dark-200 rounded-md" style={{...cardStyle, backgroundImage: `url(${data.item_image})`}}></div>
                      <div className="w-auto flex flex-col items-start justify-start">
                        <p className="text-white-200 font-extrabold">{data.item_name}</p>
                        <p className="text-white-200 font-extrabold ">{formatCurrency(data.item_currency, data.item_price)}</p>
                      </div>
                    </div>
                    <div className="w-auto flex items-center justify-center gap-3 text-white-200 font-extrabold ml-6">
                      <MdProductionQuantityLimits className='px-2 py-1 text-white-200 rounded-md text-[30px] bg-dark-100 font-extrabold  ' /> {data.item_quantity} qty
                    </div>
                  </div>
                ))
                :
              <ErrorScreen size='md' full={true} text={"No items available."} />
            }
          </div>
          <div className="w-full h-auto flex items-center justify-between ">
            <p className="text-white-200 text-[20px] font-extrabold">Total :</p>
            <p className="text-white-100 text-[25px] font-extrabold"> $300 </p>
          </div>
        </div>
        <div id="" className="w-[800px] px-4 h-screen  mt-10 ">
          <div className="w-full flex items-start justify-start gap-5">
            <button className={`px-4 py-2 rounded-[30px] text-white-200 ${activeState === "scanner" ? "bg-dark-200" : "bg-dark-100"} font-extrabold `} onClick={()=>toggleActiveState("scanner")}>
              Scanner
            </button>
            <button className={`px-4 py-2 rounded-[30px] text-white-200 ${activeState === "custom" ? "bg-dark-200" : "bg-dark-100"} font-extrabold `} onClick={()=>toggleActiveState("custom")}>
              Custom
            </button>
          </div>
          <br />
          {activeState === "scanner" && <div id="scanner" className="w-full h-[350px] bg-dark-200 ">
            <QrReader
              onResult={handleQrcodeResult}
              constraints={qrcodeconstraints}
              className="w-full"
            />
          </div>}
          {activeState === "custom" && <div id="custom" className="w-full h-[300px] flex flex-col items-center justify-center bg-dark-200 p-5 ">
            <input type="text" placeholder='Tracking_Id' className="w-full px-4 py-3 text-white-100 bg-dark-100 rounded-[30px] " />
            <br />
            <button className="w-full px-4 py-3 mt-5 rounded-[30px] bg-blue-300 text-center hover:bg-dark-100 font-extrabold border-[2px] border-solid border-blue-300 ">
              Continue Veirification
            </button>
          </div>}
          <br />
          <div className="w-full flex p-5 flex-col items-center justify-center">
            <button className="w-full px-3 py-4 mt-5 rounded-[30px] bg-green-400 text-center hover:bg-dark-100 hover:text-green-400 font-extrabold text-dark-100 border-[2px] border-solid border-green-400 ">
              Approve Checkout
            </button>
          </div>
        </div>
      </div>
    </OrgLayout>
  )
}

export default Verify