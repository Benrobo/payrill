import React,{useState, useEffect, useContext, useRef} from 'react'
import APIROUTES from '../../apiRoutes';
import { Layout } from '../../components'
import { ErrorScreen } from '../../components/UI-COMP/error';
import { LoaderScreen, LoaderScreenComp } from '../../components/UI-COMP/loader';
import Modal from '../../components/UI-COMP/modal';
import DataContext from '../../context/DataContext';
import Fetch from '../../utils/fetch';
import Notification from '../../utils/toast';


const notif = new Notification(10000)

const bgImageStyle = {
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
};

interface inputDataType {
    name: string;
    location: string;
    subdomain: string;
    description:string;
    logo: string;
    cover_photo: string;
}

function Store() {
    const {Data, Loader, walletInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext)
    const [active, setActive] = useState(false)

    const toggleActive = ()=> setActive(!active);

    useEffect(()=>{
        getAllStores()
    },[])

    async function getAllStores(){
        try {

            setLoader((prev: any)=>({...prev, getStore: true}))
            const url = APIROUTES.getAllStore;

            const {res, data} = await Fetch(url, {
              method: "GET",
            });
            setLoader((prev: any)=>({...prev, getStore: false}))
      
            if(!data.success){
              setError((prev: any)=>({...prev, getStore: data.message}))
              return
            }
            setData((prev: any)=>({...prev, stores: data.data}));
        } catch (e: any) {
            setLoader((prev: any)=>({...prev, getStore: false}))
            setError((prev: any)=>({...prev, getStore: e.message}))
        }
    }

    if(Loader.getStore){
        return <LoaderScreenComp full={true} text="Loading...."  />
    }
    if(Error.getStore !== null && !Loader.getStore){
        return <ErrorScreen full={true} text={Error.getStore} />
    }

    return (
        <Layout sideBarActiveName='store'>
            <div className="w-full h-full flex flex-col items-center justify-start">
                <div className="w-full flex items-center justify-between px-4 py-3">
                    <div className="w-auto">
                        <p className="text-white-100 font-extrabold">Virtual Store</p>
                        <p className="text-white-300 text-[13px] ">Create and Manage your store</p>
                    </div>
                    <button className=" absolute right-5 top-4 bg-blue-300 px-5 py-2 rounded-md text-white-100 scale-[.80]" onClick={toggleActive} >
                        Create Store
                    </button>
                </div>
                <br />
                <div className="w-full px-4 md:px-4 h-full noScrollBar overflow-y-scroll flex flex-wrap items-center justify-start gap-5">
                    {
                        Data.stores.length > 0 ?
                            Data.stores.map((data: any) => (
                                <div key={data.id} className="w-full rounded-[5px] p-5 bg-dark-200 flex items-start justify-start relative">
                                    <div
                                        id="img"
                                        className="w-[50px] h-[50px] opacity-[.8] rounded-md "
                                        style={{
                                            ...bgImageStyle,
                                            backgroundImage: `url("${data.logo}")`,
                                        }}
                                    ></div>
                                    <div className="w-auto flex flex-col items-start justi9fy-start ml-2 ">
                                        <p className="text-white-100 font-extrabold capitalize">
                                            {data.name}
                                        </p>
                                        <p className="text-white-200 text-[12px] ">{data.subdomain}</p>
                                    </div>
                                    <a href={`/store/${data.subdomain}`} target={"_blank"} className="w-auto">
                                        <button className=" absolute right-5 top-4 bg-dark-100 px-5 py-2 rounded-md text-white-300 scale-[.80]">
                                            Manage
                                        </button>
                                    </a>
                                </div>
                            ))
                            :
                            <ErrorScreen full={true} text={"No store available. create one.."} />
                    }
                    <div className="w-full h-[100px] "></div>
                </div>
            </div>
            {active && <CreateStore active={active} getAllStores={getAllStores} toggleActive={toggleActive} />}
        </Layout>
    )
}

export default Store

function CreateStore({active, toggleActive, getAllStores}: any){
    const {Data, Loader, walletInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext)
    const [steps, setSteps] = useState(1)
    const [inputData, setInputData] = useState<inputDataType>({
        name: "",
        location: "",
        subdomain: "",
        description:"",
        logo: "",
        cover_photo: ""
    })

    const toggleSteps = (step: number)=> {
        if(step === 1) setSteps(step)
        if(step === 2){
            const {name,location, subdomain, description } = inputData;
            if(name === "") return notif.error("store name cant be empty")
            if(location === "") return notif.error("store location cant be empty")
            if(subdomain === "") return notif.error("store sub-domain cant be empty")
            if(description === "") return notif.error("store description cant be empty")
            setSteps(step)
        }
    }
    
    // let fileElem = useRef(null)

    function handleImgUpload(e: any) {
        const name = e.target.name;
        const validType = ["jpg", "png", "jpeg", "JPG", "JPEG", "PNG"];
        // const file = (fileElem as any).current.files[0];
        const file = e.target.files[0];
        const type = file?.type.split("/")[1];
        console.log(file)
        if (!validType.includes(type)) {
          return notif.error("Invalid file type uploaded");
        }
        const reader : any = new FileReader();
        reader.addEventListener("load",function () {
          // convert image file to base64 string
            if(name === "logo") inputData["logo"] = (reader.result);
            if(name === "cover_photo") inputData["cover_photo"] = (reader.result);
        },false);
    
        if (file) {
          reader.readAsDataURL(file);
        }
    }

    const handleInput = (e: any)=>{
        const value = e.target.value;
        const name = e.target.name;
        setInputData((prev: any)=>({...prev, [name]: value}))
    }

    async function createStore(){
        const {cover_photo, logo, description, location, name, subdomain } = inputData;
        try {

            setLoader((prev: any)=>({...prev, createStore: true}))
            const url = APIROUTES.createStore;

            const {res, data} = await Fetch(url, {
              method: "POST",
              body: JSON.stringify(inputData)
            });
            setLoader((prev: any)=>({...prev, createStore: false}))
      
            if(!data.success){
              notif.error(data.message)
              return
            }
            notif.success(data.message)
            setData((prev: any)=>({...prev, stores: data.data}));
            toggleActive()
            getAllStores()
          } catch (e: any) {
            setLoader((prev: any)=>({...prev, createStore: false}))
            notif.error(e.message)
          }
    }

    return (
        <Modal isActive={active} clickHandler={toggleActive} >
            <div className="w-[90%] h-auto px-4 py-4 rounded-md bg-dark-200 ">
                <div className="w-full flex flex-col items-start justify-start">
                    <p className="text-white-100 font-extrabold">Virtual Store</p>
                    <p className="text-white-200">create your virtual store</p>
                </div>
                <br />
                <div className="w-full flex flex-col items-start justify-start">
                    {
                        steps === 1 ?
                        <>
                            <input type="text" placeholder='store name' name="name" className="w-full px-3 py-2 rounded-md bg-dark-100 border-none outline-none " onChange={handleInput} value={inputData.name}  />
                            <br />
                            <input type="text" placeholder='location' name="location" className="w-full px-3 py-2 rounded-md bg-dark-100 border-none outline-none " onChange={handleInput} value={inputData.location}  />
                            <br />
                            <div className="w-full flex items-start justify-start">
                                <button className="px-3 py-2 bg-dark-300 cursor-default  rounded-l-md text-white-300 ">https://</button>
                                <input type="text" placeholder='sub-domain' name="subdomain"  onChange={handleInput} value={inputData.subdomain} className="w-full px-3 py-2 bg-dark-100 border-none outline-none " />
                                <button className="px-3 py-2 bg-dark-300 cursor-default rounded-r-md text-white-300 ">payrill.com</button>
                            </div>
                            <br />
                            <textarea name="description" id="" placeholder='description' cols={30} rows={2} className="w-full bg-dark-100 rounded-md text-white-200 border-none outline-none px-3 py-3 "  onChange={handleInput} value={inputData.description}></textarea>
                            <br />
                            <button className="w-full px-3 py-3 bg-blue-300 rounded-md mt-3 text-white-100 " onClick={()=> toggleSteps(2)}>
                                Continue
                            </button>
                        </>
                        :
                        steps === 2 ?
                        <>
                            <div className="w-full flex items-start flex-col justify-start p-4">
                                <p className="text-white-100">Store Logo</p>
                                <div className="w-full flex items-center justify-center p-3 border-[1px] border-dashed border-white-300 mt-3 mb-5">
                                    <input type="file" name="logo" className="w-full px-4 py-3 rounded-md bg-dark-100 text-white-300" onChange={handleImgUpload}/>
                                </div>
                                <p className="text-white-100">Cover Photo (<span className="text-white-300">optional</span> ) </p>
                                <div className="w-full flex items-center justify-center p-3 border-[1px] border-dashed border-white-300 mt-3">
                                    <input type="file" name="cover_photo" className="w-full px-4 py-3 rounded-md bg-dark-100 text-white-300" onChange={handleImgUpload}/>
                                </div>
                                <br />
                                <div className="w-full flex items-center justify-between gap-8">
                                    <button className="w-full px-3 py-3 bg-dark-100 rounded-md mt-3 text-white-100 " onClick={()=> toggleSteps(1)}>
                                        Back
                                    </button>
                                    <button className="w-full px-3 py-3 bg-blue-300 rounded-md mt-3 text-white-100 " onClick={createStore}>
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </>
                        :
                        ""
                    }
                </div>
            </div>
            {Loader.createStore && <LoaderScreen full={true} text="Creating store..." />}
        </Modal>
    )
}