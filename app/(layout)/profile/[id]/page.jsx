import { MiyuliService } from '@/services/miyuli.service';

export async function generateMetadata({ params, searchParams }) {
    try {
        const profile = await MiyuliService.getAccount((await params).id);
        return {
            title: "MIYULI | ok"
        }
    }
    catch (e) {
        return {
            title: "MIYULI | error"
        }
    }


    // const profile = await MiyuliService.getAccount((await params).id);
    // return {
    //     title: "MIYULI | " + profile.name + ' ' + profile.surname,
    //     ...(await metadataExtractor((await searchParams).z))
    // }
}

export default async function Page({ params }) {
    // const profile = await MiyuliService.getAccount((await params).id);
    return (
        123
        // <Profile profile={profile} />
    )
}
