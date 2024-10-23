import { VideoService } from "@/services/video.service";
import { Metadata } from "next";

interface PlayerPageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  const video = await VideoService.getById(params.id);
  return {
    title: video.title,
    description: video.description,
    openGraph: {
      title: video.title,
      type: "video.other",
      url: "/video/" + video.id,
      images: {
        url: `http://miyulibackend.pp.ua/api/video/thumbnail/${video.id}`,
        secureUrl: `https://miyulibackend.pp.ua/api/video/thumbnail/${video.id}`,
      },
      videos: {
        url: `http://miyulibackend.pp.ua/api/video/stream/${video.id}.mp4`,
        secureUrl: `https://miyulibackend.pp.ua/api/video/stream/${video.id}.mp4`,
        type: "text/html",
      },
    },
  };
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const video = await VideoService.getById(params.id);
  return (
    <>
      <video controls autoPlay playsInline src={`https://miyulibackend.pp.ua/api/video/stream/${video.id}`}></video>
    </>
  );
}
