import axios from "axios";
import { GetServerSideProps, Metadata } from "next";
import { FunctionComponent } from "react";

interface PlayerPageProps {
  video: IVideo;
}

interface IVideo {
  id: number;
  title: string;
  description: string;
}

export async function generateMetadata({ video }: PlayerPageProps): Promise<Metadata> {
  return {
    title: `${video.title}`,
    description: `${video.description}`,
    openGraph: {
      title: `${video.title}`,
      description: `${video.description}`,
      type: "video.other",
      url: "/milord",
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

const PlayerPage: FunctionComponent<PlayerPageProps> = ({ video }) => {
  return (
    <>
      <video controls src="https://miyulibackend.pp.ua/api/video/stream/5"></video>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PlayerPageProps> = async () => {
  const video = (await axios.get<IVideo>(`https://miyulibackend.pp.ua/api/video/5`)).data;
  return { props: { video } };
};

export default PlayerPage;
