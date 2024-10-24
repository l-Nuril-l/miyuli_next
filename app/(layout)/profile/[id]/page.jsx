import { metadataExtractor } from '@/lib/functions';
import Profile from '@/pages_app/Profile';
import { MiyuliService } from '@/services/miyuli.service';
import React from 'react';

export async function generateMetadata({ params, searchParams }) {
    const profile = await MiyuliService.getAccount((await params).id);
    return {
        title: "MIYULI | " + profile.name + ' ' + profile.surname,
        ...(await metadataExtractor((await searchParams).z))
    }
}

export default async function Page({ params }) {
    const profile = await MiyuliService.getAccount((await params).id);
    return (
        <Profile profile={profile} />
    )
}
