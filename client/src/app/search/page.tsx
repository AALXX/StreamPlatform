'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import SearchResults from '@/Components/Search/SearchResults'

/**
 * watch video page
 * @return {JSX}
 */
export default function WatchVideoPage() {
    const urlParams = useSearchParams() //* q =  search query

    return (
        <>
            <SearchResults videoToken={urlParams.get('q') as string} />
        </>
    )
}
