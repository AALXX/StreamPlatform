'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getCookie } from 'cookies-next'

const NavBar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [searchInput, setSearchInput] = useState<string>('')

    const postSearch = () => {
        window.location.href = `http://localhost:3000/search?q=${searchInput}`
    }

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

                <Link href={'/account/live-dashbord'} className="self-center w-[90%] h-[2rem] mt-[1rem]">
                    <button className="w-full h-full bg-[#3a3a3a] text-white">LIVE</button>
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
            <form
                className="flex w-[20vw] ml-[40vw] h-full self-center"
                onSubmit={e => {
                    e.preventDefault()

                    postSearch()
                }}
            >
                <input type="text" className="h-9 self-center  w-[75%] bg-[#373737] text-white indent-3" placeholder="Search" onChange={e => setSearchInput(e.currentTarget.value)} />
                <div
                    className="flex bg-[#373737] ml-3 w-10  h-9 self-center cursor-pointer hover:bg-[#444444]"
                    onClick={() => {
                        postSearch()
                    }}
                >
                    <Image className="ml-1 self-center" src="/assets/CommentsIcons/SendComment_icon.svg" width={30} height={30} alt="Send image" />
                </div>
            </form>
            <Link className="ml-auto mr-16 self-center " href={'/account'}>
                <img className="z-10 rounded-full" src={`${process.env.FILE_SERVER}/${getCookie('userPublicToken')}/Main_Icon.png`} width={50} height={50} alt="Picture of the author" />
            </Link>
        </div>
    )
}

export default NavBar
