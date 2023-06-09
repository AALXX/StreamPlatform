'use client'
import Hls from 'hls.js'
import React, { useEffect, useRef } from 'react'

export default function StreamPlayer() {
    var video = document.getElementById('video')
    var videoSrc = '/hls/test.m3u8'

    const mounted = useRef(false)
    const videoRef = useRef()
    useEffect(() => {
        mounted.current = true
    }, [])

    if (Hls.isSupported()) {
        var hls = new Hls()
        hls.loadSource(videoSrc)
    }
    return <div></div>
}
