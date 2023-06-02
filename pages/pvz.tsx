import IVideo from "@/interfaces/video.interface";
import { VideoService } from "@/services/video.service";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

interface PlayerPageProps {
  video: IVideo;
}

const PlayerPage: NextPage<PlayerPageProps> = ({ video }) => {
  return (
    <>
      <Head>
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
      </Head>
      <video controls src={`https://miyulibackend.pp.ua/api/video/stream/${video.id}`}></video>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PlayerPageProps> = async () => {
  const video = await VideoService.getById("5");
  return { props: { video } };
};

export default PlayerPage;
