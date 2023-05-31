import IVideo from "@/interfaces/video.interface";
import axios from "axios";
import { Metadata } from "next";

interface PlayerPageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PlayerPageProps): Promise<Metadata> {
  var video = (await axios.get<IVideo>("http://miyulibackend.pp.ua/api/video/" + params.id)).data;
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
  const { data } = await axios.get<IVideo>("http://miyulibackend.pp.ua/api/video/" + params.id);
  return (
    <>
      <video controls src={`https://miyulibackend.pp.ua/api/video/stream/${data.id}`}></video>
    </>
  );
}
