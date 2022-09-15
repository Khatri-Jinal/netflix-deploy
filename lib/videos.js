import { getWatchedVideos } from "./db/hasura";
import { getMyListVideos } from "./db/hasura";

export const getVideos = async (query) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${query}&key=${YOUTUBE_API_KEY}`
    );
    let data = await response.json();
    if (data?.error) {
      console.error("Youtube api error", error);
      return [];
    }
    return data?.items?.map((item) => {
      const id = item?.id?.videoId || item?.id;
      const snippet = item?.snippet;
      return {
        title: snippet.title,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        id,
      };
    });
  } catch (error) {
    console.log("something went wrong", error);
  }
};

export const getYoutubeVideoById = async (videoId) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${YOUTUBE_API_KEY}
`
    );
    let data = await response.json();
    if (data?.error) {
      console.error("Youtube api error", error);
      return [];
    }
    return data?.items?.map((item) => {
      const id = item?.id?.videoId || item?.id;
      const snippet = item?.snippet;
      return {
        title: snippet.title,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        publishTime: snippet.publishedAt,
        description: snippet.description,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics
          ? item.statistics.viewCount
          : { viewCount: 0 },
        id,
      };
    });
  } catch (error) {
    console.log("something went wrong", error);
  }
};

export const getWatchItAgainVideos = async (userId, token) => {
  const videos = await getWatchedVideos(userId, token);
  if (videos) {
    return videos.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
      };
    });
  } else {
    return [];
  }
};

export const getMyList = async (userId, token) => {
  const videos = await getMyListVideos(userId, token);
  if (videos) {
    return videos.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
      };
    });
  } else {
    return [];
  }
};
