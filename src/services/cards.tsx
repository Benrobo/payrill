// import { useContext } from "react";
// import APIROUTES from "../apiRoutes"
// import DataContext from "../context/DataContext";
// import Fetch from "../utils/fetch";


// /**
//  * 
//  * @type :- Virtual Card Services
// */

// export async function getVirtualCards(){

//     const {user} = useContext<any>(DataContext)

//     const result = {
//         err: null,
//         success: false,
//         data: []
//     }

//     try {
        
//         const url = APIROUTES.getUserCards;
//         const {res, data} = await Fetch(url, {
//             method: "GET"
//         });

//         if(!data.success){
//             result["err"] = data.error;
//             result["success"] = data.success;
//             result["data"] = [];
//             return result;
//         }
//         result["err"] = data.error;
//         result["success"] = true;
//         result["data"] = data.data;

//         return result

//     } catch (e: any) {
//         result["err"] = e.message;
//         result["success"] = false;
//         result["data"] = [];
//         return result;
//     }
// }