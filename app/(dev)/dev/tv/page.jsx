"use client"
import React, { useState } from 'react';
import ReactPlayer from 'react-player';

export default function Page() {
    const [state, setState] = useState(false);
    return (
        <div>
            <button onClick={() => setState(true)}>click</button>
            {state && <ReactPlayer url='http://localhost:5284/api/video/stream/2' playing={true} />}
        </div>
    )
}
