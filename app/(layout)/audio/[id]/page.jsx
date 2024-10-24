import { metadataExtractor, staticMetadataExtractor } from '@/lib/functions';
import { MiyuliService } from '@/services/miyuli.service';
import Link from 'next/link';

export async function generateMetadata({ params, searchParams }) {
    const audio = await MiyuliService.getAudio((await params).id);
    return {
        ...staticMetadataExtractor('audio', audio),
        ...(await metadataExtractor((await searchParams).z))
    }
}
export default function Page() {
    <div>
        METADATA ONLY PAGE
        <Link href={'/audios'}>AUDIOS</Link>
        <Link href={'/'}>MAIN</Link>
    </div>
}
