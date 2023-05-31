import axios from "axios";
import { Metadata } from "next";
import { ReactElement } from "react";

interface PlayerPageProps {
  video: IVideo;
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

interface IVideo {
  id: string;
  title: string;
  description: string;
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
        width: 1280,
        height: 720,
        type: "text/html",
      },
    },
  };
}

export default async function PlayerPage({ params }: PlayerPageProps): Promise<ReactElement> {
  let video = (await axios.get<IVideo>("http://miyulibackend.pp.ua/api/video/" + params.id)).data;
  return (
    <>
      <video controls src={`https://miyulibackend.pp.ua/api/video/stream/${video.id}`}></video>
    </>
  );
}
