interface ErrorScreenProp{
    text: string;
    full?: boolean;
    size?: string;
}

export function ErrorScreen({text, full, size}: ErrorScreenProp){

    const text_size = size === "sm" ? "text-[13px]" : size === "md" ? "text-[15px]" : size === "lg" ? "text-[20px]" : "text-[13px]"

    return (
        <div className={`w-full ${full ? "h-screen": "h-auto"} flex flex-col items-center justify-center `}>
            <span className={`text-white-100 ${text_size} font-extrabold `}>{text}</span>
        </div>
    )
}