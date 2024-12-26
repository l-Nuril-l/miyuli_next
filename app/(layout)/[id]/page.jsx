import { metadataExtractor, staticMetadataExtractor } from '@/lib/functions';
import Profile from '@/pages_app/Profile';
import { MiyuliService } from '@/services/miyuli.service';
import React, { Suspense } from 'react';

export async function generateMetadata({ params, searchParams }) {
    const profile = await MiyuliService.getAccount((await params).id);
    return {
        ...staticMetadataExtractor('profile', profile),
        ...(await metadataExtractor((await searchParams).z))
    }
}

export default async function Page({ params }) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Skeleton id={(await params).id} />
        </Suspense>
    )
}
async function Skeleton({ id }) {
    const profile = await MiyuliService.getAccount(id);
    return (
        <Profile profile={profile} />
    )
 }