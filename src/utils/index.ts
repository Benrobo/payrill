


export const sleep = (sec: number) => {
    return new Promise((res: any)=>{
        setTimeout(res, sec*1000)
    })
}

export function isEqual(propA: string | undefined, propB: string) {
    if(typeof propA === "undefined") return false
    return propA === propB;
}

export function getLastPathName(){
  const path = window.location.pathname.replace(/\D/, "").split("/");
  if(path.length > 2) return path[path.length-1]
  return path[1]
}

export function genUnique(count: number){
    const alpnum = "1234567890abcdefghimnopq".split("")
    let uuid = "";
    Array(count).fill(0).forEach((data: any)=>{
        const rand = Math.floor(Math.random() * alpnum.length)
        uuid += alpnum[rand]
    })
    return uuid;
}