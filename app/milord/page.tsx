import { Metadata } from "next";
import Head from "next/head";
import { FunctionComponent } from "react";

interface PlayerPageProps {
  data: {
    title: string;
    description: string;
  };
}

export const metadata: Metadata = {
  title: "Milord",
  description: "Test SSR",
  openGraph: {
    title: "Milord Video",
    type: "video.other",
    url: "/milord",
    images: {
      url: "http://miyulibackend.pp.ua/api/video/thumbnail/1",
      secureUrl: "https://miyulibackend.pp.ua/api/video/thumbnail/1",
    },
    videos: {
      url: "http://miyulibackend.pp.ua/api/video/stream/1.mp4",
      secureUrl: "https://miyulibackend.pp.ua/api/video/stream/1.mp4",
      width: 1280,
      height: 720,
      type: "text/html",
    },
  },
};

const PlayerPage: FunctionComponent<PlayerPageProps> = ({ data }) => {
  return (
    <>
      <Head>
        <meta name="title" content={data.title} />
        <meta name="og:title" content={"og" + data.title} />
        <meta name="description" content={"og" + data.description} />
        <meta name="og:description" content={data.description} />
        <meta name="og:video:url" content="http://miyulibackend.pp.ua/api/video/stream/1.mp4" />
        <meta name="og:video:secure_url" content="https://miyulibackend.pp.ua/api/video/stream/1.mp4" />
      </Head>
      <video controls src="https://miyulibackend.pp.ua/api/video/stream/1"></video>
    </>
  );
};

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://miyulibackend.pp.ua/api/video/1`);
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}

export default PlayerPage;
