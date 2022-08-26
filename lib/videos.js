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
        imgUrl: snippet.thumbnails?.high?.url,
        id,
      };
    });
  } catch (error) {
    console.log("something went wrong", error);
  }
};

// import videodata from "../data/videos.json";
// export const getVideos = (query) => {
//   console.log("video", videodata[query]);

//   return videodata[query].map((item) => {
//     const id = item?.id?.videoId || item?.id;
//     return {
//       title: item?.snippet?.title,
//       imgUrl: item?.snippet?.thumbnails?.high?.url,
//       id,
//     };
//   });
// };

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
      console.log("item", item);
      return {
        title: snippet.title,
        imgUrl: snippet.thumbnails?.high?.url,
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
