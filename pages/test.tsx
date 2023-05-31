import axios from "axios";
import { GetServerSideProps, Metadata, NextPage } from "next";
import Link from "next/link";

interface PlayerPageProps {
  video: IVideo;
  params?: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

interface IVideo {
  id: string;
  title: string;
  description: string;
}

export const metadata: Metadata = {
  title: "...",
};

const PlayerPage: NextPage<PlayerPageProps> = ({ video }) => {
  return (
    <>
      {/* <Head>
        <title>{video.title}</title>
        <meta name="description" content={video.description} />
        <meta name="og:title" content={video.title} />
        <meta name="og:description" content={video.description} />
        <meta name="og:type" content="video.other" />
        <meta name="og:url" content="/milord" />
        <meta name="og:image:url" content={`http://miyulibackend.pp.ua/api/video/thumbnail/${video.id}`} />
        <meta name="og:image:secure_url" content={`https://miyulibackend.pp.ua/api/video/thumbnail/${video.id}`} />
        <meta name="og:video:width" content="1280" />
        <meta name="og:video:height" content="720" />
        <meta name="og:video:url" content={`http://miyulibackend.pp.ua/api/video/stream/${video.id}.mp4`} />
        <meta name="og:video:secure_url" content={`https://miyulibackend.pp.ua/api/video/stream/${video.id}.mp4`} />
        <meta name="og:video:type" content="text/html" />
      </Head> */}
      <video controls src={`https://miyulibackend.pp.ua/api/video/stream/${video.id}`}></video>
      <Link href={"pvz"}>1</Link>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PlayerPageProps> = async () => {
  const video = (await axios.get<IVideo>(`https://miyulibackend.pp.ua/api/video/1`)).data;

  return { props: { video } };
};

export default PlayerPage;
