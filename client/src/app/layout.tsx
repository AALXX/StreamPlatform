import Meta from '@/Meta/Meta'
import './globals.css'
import NavBar from '@/Components/NavBar/NavBar'
import React from 'react'

/**
 * Root Layout of the application
 * @return {JSX}
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <Meta />
            <body>
                <NavBar />
                {children}
            </body>
        </html>
    )
}
