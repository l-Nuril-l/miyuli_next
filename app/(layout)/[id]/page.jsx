import { metadataExtractor, staticMetadataExtractor } from '@/lib/functions';
import Profile from '@/pages_app/Profile';
import { MiyuliService } from '@/services/miyuli.service';
import { Suspense, use } from 'react';

export async function generateMetadata({ params, searchParams }) {
    const profile = await MiyuliService.getAccount((await params).id);
    return {
        ...staticMetadataExtractor('profile', profile),
        ...(await metadataExtractor((await searchParams).z))
    }
}

export default async function Page({ params }) {
    return (
        <SkeletonWrapper>
            <ProfileWithSuspense paramsPromise={params} />
        </SkeletonWrapper>
    );
}

function ProfileWithSuspense({ paramsPromise }) {
    const resolvedParams = use(paramsPromise);
    const id = resolvedParams.id;

    const profile = use(MiyuliService.getAccount(id));
    return <Profile profile={profile} />;
}

export function SkeletonWrapper({ children, skeleton = <div className='loader'>Loading...</div> }) {
    return (
        <Suspense fallback={skeleton}>
            {children}
        </Suspense>
    );
}