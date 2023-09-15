'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="flex bg-navbar-grey w-[100%] h-[4rem]">
            <div className={`fixed top-0 left-0 h-full w-full bg-black transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}></div>
            <div
                onMouseOver={() => {
                    setIsOpen(true)
                }}
                onMouseLeave={() => {
                    setIsOpen(false)
                }}
                className={`flex flex-col fixed top-0 left-0 bg-navbar-grey h-screen w-[15rem]  z-30 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <Link href={'/'} className="self-center w-[90%] h-[2rem] mt-[1rem]">
                    <button className="w-full h-full bg-[#3a3a3a] text-white">HOME</button>
                </Link>

                <Link href={'/account/upload'} className="self-center w-[90%] h-[2rem] mt-[1rem]">
                    <button className="w-full h-full bg-[#3a3a3a] text-white">UPLOAD</button>
                </Link>

                <Link href={'/'} className="self-center w-[90%] h-[2rem] mt-[1rem]">
                    <button className="w-full h-full bg-[#3a3a3a] text-white">FOLLOWING</button>
                </Link>
            </div>

            <h1
                className="self-center z-20 cursor-pointer"
                onMouseEnter={() => {
                    setIsOpen(true)
                }}
                onMouseLeave={() => {
                    setIsOpen(false)
                }}
            >
                LOGO
            </h1>
            <Link className="ml-auto mr-16 " href={'/account'}>
                <Image src="/AccountIcon.svg" width={50} height={30} alt="Picture of the author" />
            </Link>
        </div>
    )
}

export default NavBar
