import VideoPlayer from "@/components/VideoPlayer";
import Image from "next/image";

async function getRandomVideo() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/random-video`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data.videos ? data.videos[0] : null;
}

export default async function Home() {
  const firstVideo = await getRandomVideo();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center text-center">
      <Image
        src="/logo.png"
        alt="Hay algo ahi aleatorio"
        width={150}
        height={150}
        className="mx-auto object-cover"
      />
      {firstVideo ? (
        <VideoPlayer initialVideo={firstVideo} />
      ) : (
        <p className="text-center text-white">Error cargando video</p>
      )}
    </div>
  );
}
