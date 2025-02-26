import { NextResponse } from "next/server";

const API_KEY = process.env.API_KEY;
const PLAYLIST_ID = process.env.PLAYLIST_ID;
const YOUTUBE_API_URL = process.env.API_URL;

console.log(API_KEY, PLAYLIST_ID, YOUTUBE_API_URL);

export const GET = async () => {
  try {
    let edibordialVideos = [];
    let attempts = 0;

    while (edibordialVideos.length < 10 && attempts < 3) {
      // Intentar hasta 3 veces obtener una buena mezcla
      const pageResponse = await fetch(
        `${YOUTUBE_API_URL}/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}`
      );
      const pageData = await pageResponse.json();

      if (!pageData.items || pageData.items.length === 0) {
        return NextResponse.json({ error: "No videos found" }, { status: 404 });
      }

      // Mezclar y filtrar por "EDIBORDIAL"
      const shuffledVideos = pageData.items.sort(() => Math.random() - 0.5);
      edibordialVideos = shuffledVideos
        .filter((item: any) =>
          item.snippet.title.toUpperCase().includes("EDIBORDIAL")
        )
        .map((item: any) => ({
          videoId: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
        }));

      attempts++;
    }

    if (edibordialVideos.length === 0) {
      return NextResponse.json(
        { error: "No EDIBORDIAL videos found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ videos: edibordialVideos.slice(0, 10) });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching data", error },
      { status: 500 }
    );
  }
};
