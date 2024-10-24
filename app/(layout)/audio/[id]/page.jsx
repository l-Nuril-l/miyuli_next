import { metadataExtractor, staticMetadataExtractor } from '@/lib/functions';
import { MiyuliService } from '@/services/miyuli.service';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params, searchParams }) {
    const audio = await MiyuliService.getAudio((await params).id);
    return {
        ...staticMetadataExtractor('audio', audio),
        ...(await metadataExtractor((await searchParams).z))
    }
}
export default function Page() {
    redirect('/audios');
}
