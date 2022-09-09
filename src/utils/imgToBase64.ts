import Notification from "./toast"

const notif = new Notification()


function convertImgToBase64(imgElement: any){
    const fileElem = document.querySelector(imgElement) as HTMLInputElement
    if(fileElem === null) throw new Error("Expected valid input file element")

    const validType = ["jpg", "png", "jpeg", "JPG", "JPEG", "PNG"]
    const file = (fileElem as any).files[0]
    const type = file?.type.split("/")[1]
    let imgData: any = ""

    if (!validType.includes(type)) {
        return notif.error("Invalid file type uploaded")
    }
    const reader = new FileReader();
    reader.addEventListener("load", function () {
        // convert image file to base64 string
        imgData = reader.result
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
    console.log(imgData);
    
    return imgData
}

export default convertImgToBase64