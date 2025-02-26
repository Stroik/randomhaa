"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
}

export default function VideoPlayer({ initialVideo }: { initialVideo: Video }) {
  const [video, setVideo] = useState(initialVideo);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchVideos = async (api: string) => {
    setIsShuffling(true);
    setThumbnails([]); // Reiniciar thumbnails en cada request
    setCurrentIndex(0); // Reiniciar índice

    try {
      const response = await fetch(api);
      const data = await response.json();
      if (data.videos && data.videos.length > 0) {
        const thumbList = data.videos.map((v: Video) => v.thumbnail);
        setThumbnails(thumbList);

        const interval = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % thumbList.length);
        }, 150); // Cambio rápido de imágenes

        setTimeout(() => {
          clearInterval(interval);
          const randomVideo =
            data.videos[Math.floor(Math.random() * data.videos.length)];
          setVideo(randomVideo);
          setThumbnails([]); // Limpiar previews después de la animación
          setIsShuffling(false);
        }, 2000); // La animación dura 2 segundos antes de elegir el video
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      setIsShuffling(false);
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center text-white p-4">
      <h1 className="text-3xl font-bold mb-2">¿El GSV te tiene manija?</h1>
      <h2 className="text-xl mb-4">Mirate un capitulo random de HAA</h2>

      <div className="w-full max-w-2xl h-64 md:h-96 flex items-center justify-center overflow-hidden">
        {isShuffling && thumbnails.length > 0 ? (
          <motion.img
            key={currentIndex}
            src={thumbnails[currentIndex]}
            alt="Shuffling preview"
            className="w-full h-full object-cover"
            initial={{ opacity: 0.5, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.1 }}
          />
        ) : (
          <motion.iframe
            key={video.videoId}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}`}
            frameBorder="0"
            allowFullScreen
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          ></motion.iframe>
        )}
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={() => fetchVideos("/api/random-video")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          CAPÍTULO ALEATORIO
        </button>
        <button
          onClick={() => fetchVideos("/api/edibordial-video")}
          className="bg-zinc-600 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded"
        >
          EDIBORDIAR ALEATORIA
        </button>
      </div>
    </div>
  );
}
