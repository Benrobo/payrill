import React, { useState, useEffect } from "react"
import { Container } from ".."

// import usersInfo from "../../data/usersInfo.json"
// import languages from "../../data/languages.json"

export default function Header({ children }: any) {

    return (
        <header className={`header w-full h-[100vh] relative bg-dark-200 md:h-auto`}>
            <Container>
                {children}

                {/* shows on desktop */}

            </Container>
        </header>
    )
}
