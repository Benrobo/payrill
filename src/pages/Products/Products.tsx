import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import OrgLayout from '../../components/Layout/OrgLayout'
import { OrgModal } from '../../components/UI-COMP/modal'

import milkImg from "../../assets/images/products/milk.png"
import { AiOutlineClose } from 'react-icons/ai'
import { MdQrCodeScanner } from 'react-icons/md'
import {QRCode, QRCodeProps} from "react-qrcode"
import { FaTrashAlt } from 'react-icons/fa'
import Notification from '../../utils/toast'

const notif = new Notification();

function Products() {

  const [activeState, setActiveState] = useState({
    productCard: false,
    addProduct: false
  })

  const toggleProductCardInfo = (e: any, state:any)=>{
    if(state === "productCard"){
      setActiveState((prev: any)=>({...prev, productCard: !activeState.productCard}))
    }
    if(state === "addProduct"){
      setActiveState((prev: any)=>({...prev, addProduct: !activeState.addProduct}))
    }
  }

  return (
    <OrgLayout sideBarActiveName='products'>
        <div className="w-full flex items-center justify-between gap-5  px-5 py-4 border-b-[2px] border-solid border-dark-800 ">
          <div className="w-auto flex flex-col items-start justify-start ">
            <p className="text-white-100 font-extrabold text-[20px] ">All Products</p>
            <p className="text-white-300 text-[15px] ">Manage all store products</p>
          </div>
          <div className="w-auto flex items-center justify-start">
            <button className="px-3 py-2 rounded-md bg-blue-300 text-white-100 font-extrabold scale-[.85] hover:scale-[.95] transition-all " onClick={()=> toggleProductCardInfo(null, "addProduct")}>
              Create Product
            </button>
          </div>
        </div>
        <br />
        <div className="w-full h-screen overflow-y-scroll noScrollBar flex flex-wrap items-center justify-start px-10 gap-10 ">
          {
            Array(10).fill(0).map((data: any, i: number)=>(
              <ProductCards key={i} data={data} toggleProduct={toggleProductCardInfo} />
            ))
          }
          <div className="w-full h-[100px] "></div>
        </div>
        {activeState.productCard && <SelectedProduct toggleProduct={toggleProductCardInfo} />}

        {activeState.addProduct && <CreateProduct toggleAddProduct={toggleProductCardInfo} />}
    </OrgLayout>
  )
}

export default Products

function CreateProduct({toggleAddProduct}: any){

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

  let fileElem = useRef(null);

  function handleImgUpload(e: any) {
    const validType = ["jpg", "png", "jpeg", "JPG", "JPEG", "PNG"];
    const file = (fileElem as any).current.files[0];
    const type = file?.type.split("/")[1];

    if (!validType.includes(type)) {
      return notif.error("Invalid file type uploaded");
    }
    const reader : any = new FileReader();
    reader.addEventListener("load",function () {
      // convert image file to base64 string
      inputData["image"] = (reader.result);
    },false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }


  async function createProduct(){
    const { itemName, price, quantity, image, description } = inputData;
    if(itemName === "") return notif.error("item name cant be empty")
    if(price === "") return notif.error("item price cant be empty")
    if(quantity === "") return notif.error("item quantity cant be empty")
    if(description === "") return notif.error("item description cant be empty")
    if(image === "") return notif.error("item image cant be empty")

    console.log(inputData)
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
                <button className="w-full px-3 py-3 rounded-md text-[15px] text-white-100 bg-blue-300 flex flex-col items-center justify-center scale-[.95] hover:scale-[1] transition-all" onClick={createProduct}>
                  Add Product
                </button>
              </div>
            </div>
        }
      </div>
    </OrgModal>
  )
}

function ProductCards({toggleProduct, data, key}:any){

  const cardStyle = {
    backgroundImage: `url(${milkImg})`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }

  return (
    <div className="w-[200px] h-auto relative flex flex-col items-center justify-center border-[1px] border-solid border-dark-500 rounded-md " key={key}>
      <div onClick={()=>toggleProduct(null, "productCard")} className="w-full h-[150px] bg-dark-200 rounded-md p-2 cursor-pointer  " style={{...cardStyle}}></div>
      <br />
      <div className="w-full flex flex-col items-start justify-start px-2 pb-2">
        <p className="text-white-100 text-[18px] font-extrabold ">Milk Bottle</p>
        <p className="text-white-200 text-[15px] ">Some description....</p>
      </div>
      <div className="w-full flex items-center justify-between mt-3 px-2 pb-2">
        <p className="text-white-100 text-[18px] font-extrabold ">
          $48
        </p>
        <p className="text-white-200 text-[15px] "> 40 left </p>
      </div>
    </div>
  )
}

function SelectedProduct({toggleProduct}: any){

  const [activeState, setActiveState] = useState({
    edit: false,
    qrcode: false
  })

  const toggleActiveState = () => setActiveState((prev: any)=>({...prev, edit: !activeState.edit}))
  const toggleQrcode = ()=> setActiveState((prev: any)=>({...prev, qrcode: !activeState.qrcode}))

  const cardStyle = {
    backgroundImage: `url(${milkImg})`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }

  return (
    <div className="w-[350px] h-screen fixed top-0 right-0 bg-dark-100 shadow-xl shadow-dark-300 ">
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
            <p className="text-white-100 text-[20px] ">Product Title</p>
            <p className="text-white-200 text-[15px] ">Product description....</p>
            <br />
            <div className="w-full flex items-center justify-between gap-20">
              <p className="text-white-100 text-[20px] font-extrabold ">$40</p>
              <p className="text-white-200 text-[15px] font-extrabold ">140qty</p>
            </div>
            <br />
            <button className="w-full px-3 py-3 rounded-[30px] text-[18px] text-white-100 bg-blue-300 flex flex-col items-center justify-center border-[2px] border-solid border-blue-300 hover:bg-dark-100 " onClick={toggleActiveState}>
              Edit Product
            </button>
          </div>}
          {activeState.edit && <div className="w-full flex flex-col items-start justify-start gap-4">
            <div className="w-full flex items-center justify-between gap-3">
              <input type="text" placeholder='$100' className="w-full px-3 py-3 bg-dark-200 rounded-md text-white-200 " />
              <input type="text" placeholder='40qty' className="w-full px-3 py-3 bg-dark-200 rounded-md text-white-200 " />
            </div>
            <input type="text" placeholder='description' className="w-full px-3 py-3 bg-dark-200 rounded-md text-white-200 " />
            <br />
            <div className="w-full flex items-center justify-between">
              <button className="px-3 py-3 rounded-[30px] text-[15px] text-white-200 bg-dark-100 flex flex-col items-center justify-center" onClick={toggleActiveState}>
                Cancel
              </button>
              <button className="px-3 py-3 rounded-[30px] text-[15px] text-white-100 bg-blue-300 flex flex-col items-center justify-center">
                Save Changes
              </button>
            </div>
          </div>}
      </div>

      {activeState.qrcode && <ViewProductQrCode toggleQrcode={toggleQrcode} />}
    </div>
  )
}

function ViewProductQrCode({toggleQrcode}: any){

  const downloadQrcode = ()=>{

  }

  return (
    <OrgModal isActive={true} clickHandler={toggleQrcode} >
      <div className="w-[350px] flex flex-col items-center justify-center h-auto bg-white-100 rounded-md ">
        <QRCode scale={10} width={"100%"} height={"100%"} value="dfvdfvdfdfdvfv" />
        <button className="w-[200px] px-3 py-3 rounded-[30px] text-[18px] text-white-100 bg-dark-100 flex flex-col items-center justify-center" onClick={downloadQrcode}>
          Download
        </button>
        <br />
      </div>
    </OrgModal>
  )
}


