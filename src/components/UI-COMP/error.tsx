interface ErrorScreenProp{
    text: string;
    full?: boolean;
}

export function ErrorScreen({text, full}: ErrorScreenProp){
    return (
        <div className={`w-full ${full ? "h-screen": "h-auto"} flex flex-col items-center justify-center `}>
            <span className="text-white-100 text-[13px] font-extrabold ">{text}</span>
        </div>
    )
}