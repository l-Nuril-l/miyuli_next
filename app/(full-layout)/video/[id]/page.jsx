import { metadataExtractor } from '@/lib/functions';
import Video from "@/pages_app/Video";
import React from 'react';

export async function generateMetadata({ params, searchParams }) {
    return {
        title: "MIYULI | VIDEOS",
        ...(await metadataExtractor((await searchParams).z))
    }
}

export default function Page() {
    return (
        <Video />
    )
}
