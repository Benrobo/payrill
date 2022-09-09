
import React from 'react'

export default function Container({ children, rest }: any) {
    return (
        <div className={` w-full mx-auto md:w-[80%] `} {...rest}>
            {children}
        </div>
    )
}
