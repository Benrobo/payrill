import React,{useState, useEffect, useContext, useRef} from 'react'
import { Layout } from '../../components'
import Modal from '../../components/UI-COMP/modal';
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
    subDomain: string;
    description:string;
    logo: string;
    coverPhoto: string;
}

function Store() {

    const [active, setActive] = useState(false)

    const toggleActive = ()=> setActive(!active);

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
                    {Array(5).fill(1).map((data) => (
                        <div className="w-full rounded-[5px] p-5 bg-dark-200 flex items-start justify-start relative">
                        <div
                            id="img"
                            className="w-[50px] h-[50px] opacity-[.8] rounded-md "
                            style={{
                                ...bgImageStyle,
                                backgroundImage: `url("https://avatars.dicebear.com/api/initials/store-name.svg")`,
                            }}
                        ></div>
                        <div className="w-auto flex flex-col items-start justi9fy-start ml-2 ">
                            <p className="text-white-100 font-extrabold">Store Name</p>
                            <p className="text-white-200 text-[12px] ">title here</p>
                        </div>
                        <a href="/store/store_name" target={"_blank"} className="w-auto">
                            <button className=" absolute right-5 top-4 bg-dark-100 px-5 py-2 rounded-md text-white-300 scale-[.80]">
                                Manage
                            </button>
                        </a>
                    </div>
                    ))}
                    <div className="w-full h-[100px] "></div>
                </div>
            </div>
            {active && <CreateStore active={active} toggleActive={toggleActive} />}
        </Layout>
    )
}

export default Store

function CreateStore({active, toggleActive}: any){

    const [steps, setSteps] = useState(1)
    const [inputData, setInputData] = useState<inputDataType>({
        name: "",
        location: "",
        subDomain: "",
        description:"",
        logo: "",
        coverPhoto: ""
    })

    const toggleSteps = (step: number)=> {
        if(step === 1) setSteps(step)
        if(step === 2){
            const {name,location, subDomain, description } = inputData;
            if(name === "") return notif.error("store name cant be empty")
            if(location === "") return notif.error("store location cant be empty")
            if(subDomain === "") return notif.error("store sub-domain cant be empty")
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
            if(name === "coverPhoto") inputData["coverPhoto"] = (reader.result);
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
        console.log(inputData)
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
                                <input type="text" placeholder='sub-domain' name="subDomain"  onChange={handleInput} value={inputData.subDomain} className="w-full px-3 py-2 bg-dark-100 border-none outline-none " />
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
                                    <input type="file" name="coverPhoto" className="w-full px-4 py-3 rounded-md bg-dark-100 text-white-300" onChange={handleImgUpload}/>
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
        </Modal>
    )
}