import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import OrgLayout from '../../components/Layout/OrgLayout'
import { OrgModal } from '../../components/UI-COMP/modal'

import milkImg from "../../assets/images/products/milk.png"
import { AiOutlineClose } from 'react-icons/ai'
import { MdQrCodeScanner } from 'react-icons/md'
import {QRCode, QRCodeProps} from "react-qrcode"
import { FaTrashAlt } from 'react-icons/fa'
import Notification from '../../utils/toast'
import DataContext from '../../context/DataContext'
import Fetch from '../../utils/fetch'
import APIROUTES from '../../apiRoutes'
import { LoaderScreen, LoaderScreenComp, Spinner } from '../../components/UI-COMP/loader'
import { sleep } from '../../utils'
import { ErrorScreen } from '../../components/UI-COMP/error'
import { formatCurrency } from '../../utils/creditCard'

const notif = new Notification();

const userCurrency = localStorage.getItem("payrill_user_currency") === null ? "" : JSON.parse(localStorage.getItem("payrill_user_currency") as any)

const storeId = localStorage.getItem("payrill_store_id") === null ? "" : JSON.parse(localStorage.getItem("payrill_store_id") as any)

function Products() {

  const {Data, Loader, walletInfo, getOrgStoreInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext)
  const [activeState, setActiveState] = useState({
    productCard: false,
    addProduct: false
  })
  const [selectedItem, setSelectedItem] = useState({})

  const toggleProductCardInfo = (e: any, state:any)=>{
    if(state === "productCard"){

      if(e === null){
        return setActiveState((prev: any)=>({...prev, productCard: !activeState.productCard}))
      }
      const dataset = e.target.dataset;
      if(Object.entries(dataset).length === 0) return;
      const {id} = dataset;
      const filteredItem = Data.storeItems.filter((item: any)=> item.id === id)[0]
      setSelectedItem(filteredItem)
      setActiveState((prev: any)=>({...prev, productCard: !activeState.productCard}))
    }
    if(state === "addProduct"){
      setActiveState((prev: any)=>({...prev, addProduct: !activeState.addProduct}))
    }
  }

  useEffect(()=>{
    getAllItems()
  },[])

  useEffect(()=>{
    // const storeName = JSON.parse(localStorage.getItem("payrill_store_domain") as any)
    getOrgStoreInfo(Data.orgStoreInfo.subdomain)
  },[])

  async function getAllItems(){
    try {

      setLoader((prev: any)=>({...prev, getStoreItems: true}))
      const url = APIROUTES.getStoreItems

      const {res, data} = await Fetch(url, {
        method: "POST",
        body: JSON.stringify({storeId})
      });
      setLoader((prev: any)=>({...prev, getStoreItems: false}))

      if(!data.success){
        setError((prev: any)=>({...prev, getStoreItems: data.message}))
        return
      }

      setData((prev: any)=>({...prev, storeItems: data.data}))
      setError((prev: any)=>({...prev, getStoreItems: null}))

    } catch (e: any) {
      setLoader((prev: any)=>({...prev, getStoreItems: false}))
      setError((prev: any)=>({...prev, getStoreItems: `An Error Occured:  ${e.message}`}))
    }
  }

  if(Error.getOrgStoreInfo !== null){
    return <ErrorScreen text={Error.getOrgStoreInfo} size={"lg"} full={true} />
  }

  if(!Loader.getOrgStoreInfo && Object.entries(Data.orgStoreInfo).length === 0){
    return <ErrorScreen text={Error.getOrgStoreInfo} full={true} />
  }

  return (
    <OrgLayout sideBarActiveName='products'>
        <div className="w-full flex items-center justify-between gap-5  px-5 py-4 border-b-[2px] border-solid border-dark-800 ">
          <div className="w-auto flex flex-col items-start justify-start ">
            <p className="text-white-100 font-extrabold text-[20px] ">All Products</p>
            <p className="text-white-300 text-[15px] ">Manage all store products</p>
          </div>
          <div className="w-auto flex items-center justify-start">
            <button className="px-3 py-2 rounded-md bg-blue-300 text-white-100 font-extrabold scale-[.85] hover:scale-[.95] transition-all " onClick={()=> toggleProductCardInfo(null, "addProduct")} disabled={Loader.getStoreItems}>
              Create Product
            </button>
          </div>
        </div>
        <br />
        <div className="w-full h-screen overflow-y-scroll noScrollBar flex flex-wrap items-center justify-start px-10 gap-10 ">
          {
            Loader.getStoreItems ?
              <LoaderScreenComp full={true} text="Loading..." />
              :
            Error.getStoreItems !== null ?
              <ErrorScreen text={Error.getStoreItems} full={true} />
              :
            Data.storeItems.length > 0 ?
              Data.storeItems.map((data: any)=>(
                <ProductCards key={data.id} data={data} toggleProduct={toggleProductCardInfo} />
              ))
              :
            <ErrorScreen text="No product items available" full={true} />
          }
          <div className="w-full h-[100px] "></div>
        </div>
        {activeState.productCard && <SelectedProduct data={selectedItem} toggleProduct={toggleProductCardInfo} />}

        {activeState.addProduct && <CreateProduct getAllItems={getAllItems} toggleAddProduct={toggleProductCardInfo} />}
    </OrgLayout>
  )
}

export default Products

function CreateProduct({toggleAddProduct, getAllItems}: any){
  const {Data, Loader, walletInfo, getOrgStoreInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext)
  const [steps, setSteps] = useState(1)
  const [inputData, setInputData] = useState({
    itemName: "",
    price: "",
    quantity: "",
    description: "",
    image: ""
  })

  const toggleSteps = (step: number) => {
    const { itemName, price, quantity, image, description } = inputData;
    if(step === 1) setSteps(step)
    if(step === 2){
      if(itemName === "") return notif.error("item name cant be empty")
      if(price === "") return notif.error("item price cant be empty")
      if(quantity === "") return notif.error("item quantity cant be empty")
      if(description === "") return notif.error("item description cant be empty")
      setSteps(step)
    }
  }

  const handleInput = (e: any)=>{
    const name = e.target.name,
          value = e.target.value;
    setInputData((prev: any)=>({...prev, [name]: value}))
  }


  function handleImgUpload(e: any) {
    const validType = ["jpg", "png", "jpeg", "JPG", "JPEG", "PNG"];
    const file = e.target.files[0];
    const type = file?.type.split("/")[1];

    if (!validType.includes(type)) {
      return notif.error("Invalid file type uploaded");
    }
    const reader : any = new FileReader();
    reader.addEventListener("load",function () {
      // convert image file to base64 string
      setInputData((prev: any)=>({...prev, image: reader.result}))
      console.log(reader.result)
    },false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }


  async function createProduct(){
    console.log(inputData)
    const { itemName, price, quantity, image, description } = inputData;
    if(itemName === "") return notif.error("item name cant be empty")
    if(price === "") return notif.error("item price cant be empty")
    if(quantity === "") return notif.error("item quantity cant be empty")
    if(description === "") return notif.error("item description cant be empty")
    if(image === "") return notif.error("item image cant be empty")
    try {

      setLoader((prev: any)=>({...prev, addItems: true}))
      const url = APIROUTES.addStoreItems

      const payload = {
        name: itemName,
        storeId,
        price,
        quantity,
        image,
        description,
        currency: userCurrency
      }

      const {res, data} = await Fetch(url, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setLoader((prev: any)=>({...prev, addItems: false}))

      if(!data.success){
        notif.error(data.message)
        return
      }

      notif.success(data.message)
      await sleep(1.2)
      toggleAddProduct(null, "addProduct")
      getAllItems()

    } catch (e: any) {
      setLoader((prev: any)=>({...prev, addItems: false}))
      notif.error(`An Error Occured:  ${e.message}`)
    }
  }

  return (
    <OrgModal isActive={true}>
      <div className="w-[450px] h-auto p-5 flex flex-col items-center justify-start bg-dark-200 rounded-md ">
        <div className="w-full flex flex-col items-start justify-start">
          <p className="text-white-100 font-extraboold ">Product Items</p>
          <p className="text-white-300 font-extraboold ">add product items</p>
        </div>
        <br />
        {
          steps === 1 ?
            <div className="w-full flex flex-col items-start justify-start gap-4">
              <input type="text" value={inputData.itemName} name="itemName" onChange={handleInput} placeholder='Item Name' className="w-full px-3 py-3 bg-dark-100 rounded-md text-white-200 " />
              <div className="w-full flex items-center justify-between gap-3">
                <input type="number" value={inputData.price} name="price" onChange={handleInput} placeholder='$100' className="w-full px-3 py-3 bg-dark-100 rounded-md text-white-200 " />
                <input type="number" value={inputData.quantity} name="quantity" onChange={handleInput} placeholder='40qty' className="w-full px-3 py-3 bg-dark-100 rounded-md text-white-200 " />
              </div>
              <input type="text" value={inputData.description} placeholder='description' className="w-full px-3 py-3 bg-dark-100 rounded-md text-white-200 " name="description" onChange={handleInput} />
              <div className="w-full flex items-center justify-between gap-20">
                <button className="w-full px-3 py-3 rounded-md text-[15px] text-white-200 bg-dark-100 flex flex-col items-center justify-center scale-[.95] hover:scale-[1] transition-all " onClick={()=>toggleAddProduct(null, "addProduct")}>
                  Cancel
                </button>
                <button className="w-full px-3 py-3 rounded-md text-[15px] text-white-100 bg-blue-300 flex flex-col items-center justify-center scale-[.95] hover:scale-[1] transition-all" onClick={()=>toggleSteps(2)}>
                  Continue
                </button>
              </div>
            </div>
            :
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <div className="w-full h-[100px] border-[2px] border-dashed border-white-300 flex flex-col items-center justify-center ">
                <input type="file" name="image" onChange={handleImgUpload} className="px-4 py-3 bg-dark-100" />
              </div>
              <br />
              <div className="w-full flex items-center justify-between gap-20">
                <button className="w-full px-3 py-3 rounded-md text-[15px] text-white-200 bg-dark-100 flex flex-col items-center justify-center scale-[.95] hover:scale-[1] transition-all" onClick={()=>toggleSteps(1)}>
                  Back
                </button>
                <button className="w-full px-3 py-3 rounded-md text-[15px] text-white-100 bg-blue-300 flex flex-col items-center justify-center scale-[.95] hover:scale-[1] transition-all" onClick={createProduct} disabled={Loader.addItems}>
                  { Loader.addItems ? <Spinner /> : "Add Product" }
                </button>
              </div>
            </div>
        }

        { Loader.addItems && <LoaderScreen full={true} text="Adding items..." /> }
      </div>
    </OrgModal>
  )
}

function ProductCards({toggleProduct, data, key}:any){

  const cardStyle = {
    backgroundImage: `url(${data.item_image})`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }

  return (
    <div className="w-[200px] h-[300px] relative flex flex-col items-center justify-center border-[1px] border-solid border-dark-500 rounded-md "key={key}>
      <div onClick={(e)=>toggleProduct(e, "productCard")} className="w-full h-[150px] bg-dark-200 rounded-md p-2 cursor-pointer  " data-id={data.id}  style={{...cardStyle}}></div>
      <br />
      <div className="w-full flex flex-col items-start justify-start mt-5 px-2 pb-3">
        <p className="text-white-100 text-[18px] font-extrabold ">{data.item_name}</p>
        <p className="text-white-200 text-[12px] ">{data.item_description}</p>
      </div>
      <br />
      <br />
      <div className="w-full absolute bottom-1 flex items-center justify-between mt-3 px-2 pb-2">
        <p className="text-white-100 text-[18px] font-extrabold ">
          {formatCurrency(data.item_currency, data.item_price)}
        </p>
        <p className="text-white-200 text-[15px] "> {data.item_quantity} qty </p>
      </div>
    </div>
  )
}

function SelectedProduct({toggleProduct, data}: any){

  const {Data, Loader, walletInfo, getOrgStoreInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext)
  const [activeState, setActiveState] = useState({
    edit: false,
    qrcode: false
  })
  const [tempData, setTempData] = useState<any>({})
  const [inputData, setInputData] = useState({
    itemName: "",
    price: "",
    quantity: "",
    description: "",
    image: ""
  })
  const toggleActiveState = () => setActiveState((prev: any)=>({...prev, edit: !activeState.edit}))
  const toggleQrcode = ()=> setActiveState((prev: any)=>({...prev, qrcode: !activeState.qrcode}))

  useEffect(()=>{
    setTempData(data);
  },[])

  const handleInput = (e: any)=>{
    const name = e.target.name,
          value = e.target.value;
    setInputData((prev: any)=>({...prev, [name]: value}))
  }


  function handleImgUpload(e: any) {
    const validType = ["jpg", "png", "jpeg", "JPG", "JPEG", "PNG"];
    const file = e.target.files[0];
    const type = file?.type.split("/")[1];

    if (!validType.includes(type)) {
      return notif.error("Invalid file type uploaded");
    }
    const reader : any = new FileReader();
    reader.addEventListener("load",function () {
      // convert image file to base64 string
      setInputData((prev: any)=>({...prev, image: reader.result}))
    },false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  const cardStyle = {
    backgroundImage: `url(${data.item_image})`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }

  function clearInputData(){
    setInputData({description: "",image: "", itemName: "", price: "", quantity: ""})
  }

  async function updateItem(){
    const {itemName, description, price, quantity, image} = inputData;
    const {id, item_name, item_description, item_price, item_quantity, item_image} = tempData;
    const itemImage = image === "" ? item_image : image;
    const itemname = itemName === "" ? item_name : itemName;
    const itemDesc = description === "" ? item_description : description;
    const itemPrice = price === "" ? item_price : +price;
    const itemQty = quantity === "" ? item_quantity : +quantity;

    if(itemName === "" && description === "" && price === "" && quantity === "" && image === "") {
      console.log("CANT UPDATE EMPTY FIELDS")
      return
    }

    // const payload = {
    //   name: itemname, 
    //   description:itemDesc, 
    //   price: itemPrice, 
    //   quantity: itemQty,
    //   image: itemImage, 
    // }

    try {
      // setLoader((prev: any)=>({...prev, updateStoreItems: true}))
      const url = APIROUTES.updateItem.replace(":item_id", id)
      const payload = {
        name: itemname,
        storeId,
        price: itemPrice,
        quantity: itemQty,
        image: itemImage,
        description: itemDesc,
        currency: userCurrency
      }
      
      const {res, data} = await Fetch(url, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setLoader((prev: any)=>({...prev, updateStoreItems: false}))

      if(!data.success){
        notif.error(data.message)
        return
      }

      notif.success(data.message)
      await sleep(1.2)
      window.location.reload()
    } catch (e: any) {
      setLoader((prev: any)=>({...prev, updateStoreItems: false}))
      notif.error(`An Error Occured:  ${e.message}`)
    }

  }

  return (
    <>
      <div className="w-[350px] h-screen  overflow-y-scroll noScrollBar fixed top-0 right-0 bg-dark-100 shadow-xl shadow-dark-300 ">
        <div className="w-full flex items-center justify-between p-4">
          <button className="p-2 text-red-200 bg-red-800 rounded-md flex flex-col items-center justify-center" onClick={()=>toggleProduct(null, "productCard")}>
            <AiOutlineClose />
          </button>
          <div className="w-auto flex items-center justify-center gap-4">
            <button className="px-3 py-2 text-[20px] text-white-200 bg-dark-300 rounded-md flex flex-col items-center justify-center" onClick={toggleQrcode}>
              <MdQrCodeScanner />
            </button>
            <button className="p-2 text-red-200 bg-red-800 rounded-md flex flex-col items-center justify-center opacity-[.5] hover:opacity-1 ">
              <FaTrashAlt />
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col items-center justify-center p-4 relative">
            <div className="w-full h-[250px] bg-dark-100 rounded-md p-2  " style={{...cardStyle}}></div>
            <br />
            <br />
            { !activeState.edit && <div className="w-full flex flex-col items-start justify-start">
              <p className="text-white-100 text-[20px] ">{data.item_name}</p>
              <p className="text-white-200 text-[15px] ">{data.item_description}</p>
              <br />
              <div className="w-full flex items-center justify-between gap-20">
                <p className="text-white-100 text-[20px] font-extrabold ">{formatCurrency(data.item_currency, data.item_price)}</p>
                <p className="text-white-200 text-[15px] font-extrabold ">{data.item_quantity}qty</p>
              </div>
              <br />
              <button className="w-full px-3 py-3 rounded-[30px] text-[18px] text-white-100 bg-blue-300 flex flex-col items-center justify-center border-[2px] border-solid border-blue-300 hover:bg-dark-100 " onClick={toggleActiveState}>
                Edit Product
              </button>
            </div>}
            {activeState.edit && <div className="w-full flex flex-col items-start justify-start gap-4">
              
              <div className="w-full flex items-center justify-between gap-3">
                <input type="text" placeholder='Name' className="w-full px-3 py-3 bg-dark-200 rounded-md text-white-200 " name="itemName" onChange={handleInput} />
                <input type="file" className="w-full px-3 py-3 bg-dark-200 rounded-md text-white-200 " name="image" onChange={handleImgUpload} />
              </div>
              <div className="w-full flex items-center justify-between gap-3">
                <input type="number" name="price" placeholder='$100' className="w-full px-3 py-3 bg-dark-200 rounded-md text-white-200 " onChange={handleInput} />
                <input type="number" name="quantity" placeholder='40qty' className="w-full px-3 py-3 bg-dark-200 rounded-md text-white-200 " onChange={handleInput} />
              </div>
              <input type="text" name="description" placeholder='description' className="w-full px-3 py-3 bg-dark-200 rounded-md text-white-200 " onChange={handleInput} />
              <div className="w-full flex items-center justify-between">
                <button className="px-3 py-3 rounded-[30px] text-[15px] text-white-200 bg-dark-100 flex flex-col items-center justify-center" onClick={()=>{
                  clearInputData()
                  toggleActiveState()
                }}>
                  Cancel
                </button>
                <button className="px-5 py-3 rounded-[30px] text-[15px] text-white-100 bg-blue-300 flex flex-col items-center justify-center" onClick={updateItem} disabled={Loader.updateStoreItems}>
                  { Loader.updateStoreItems ? <Spinner /> : "Save Changes" }
                </button>
              </div>
            </div>}
        { Loader.updateStoreItems && <LoaderScreen full={true} text="Updating..." /> }
        </div>
        {activeState.qrcode && <ViewProductQrCode value={data.id}  toggleQrcode={toggleQrcode} />}
      </div>
    </>
  )
}

function ViewProductQrCode({toggleQrcode, value}: any){

  const downloadQrcode = (e: any)=>{
    e.preventDefault()
    let qrcode = document.querySelector("#product-qrcode") as any;
    let a = document.createElement("a") as any;
    a.href = qrcode?.src;
    a.download=  "product-qrcode"
    a.click()
  }

  return (
    <OrgModal isActive={true} clickHandler={toggleQrcode} >
      <div className="w-[350px] flex flex-col items-center justify-center h-auto bg-white-100 rounded-md ">
        <QRCode scale={10} width={"100%"} height={"100%"} id="product-qrcode" value={value} />
        <button className="w-[200px] px-3 py-3 rounded-[30px] text-[18px] text-white-100 bg-dark-100 flex flex-col items-center justify-center" onClick={downloadQrcode}>
          Download
        </button>
        <br />
      </div>
    </OrgModal>
  )
}


