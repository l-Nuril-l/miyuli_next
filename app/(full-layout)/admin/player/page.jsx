import VideoPlayer from '@/components/VideoPlayer'
import React from 'react'

export default function Page() {
    return (
        <VideoPlayer url={'https://localhost:7284/api/video/stream/74'} />
    )
}
