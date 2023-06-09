import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const NavBar = () => {
    return (
        <div className="flex bg-navbar-grey w-[100%] h-[4rem] items-center	">
            <Link href={'/'}>
                <h1>LOGO</h1>
            </Link>

            <Link className="ml-auto mr-16 " href={'/account'}>
                <Image src="/AccountIcon.svg" width={50} height={30} alt="Picture of the author" />
            </Link>
        </div>
    )
}

export default NavBar
