"use client"
import React, { useState } from 'react';
import ReactPlayer from 'react-player';

export default function page() {
    const [state, setstate] = useState(false);
    return (
        <div>
            <button onClick={() => setstate(true)}>click</button>
            {state && <ReactPlayer url='http://localhost:5284/api/video/stream/2' playing={true} />}
        </div>
    )
}
