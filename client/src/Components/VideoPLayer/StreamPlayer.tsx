'use client'
import Hls from 'hls.js'
import React, { useEffect, useRef } from 'react'

/**
 *
 * @return {JSX}
 */
export default function StreamPlayer() {
    const video = document.getElementById('video')
    const videoSrc = '/hls/test.m3u8'

    const mounted = useRef(false)
    const videoRef = useRef()
    useEffect(() => {
        mounted.current = true
    }, [])

    if (Hls.isSupported()) {
        const hls = new Hls()
        hls.loadSource(videoSrc)
    }
    return <div></div>
}
