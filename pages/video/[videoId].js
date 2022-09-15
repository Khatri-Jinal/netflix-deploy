import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import DisLike from "../../components/icons/dislike-icon";
import Like from "../../components/icons/like-icon";
import Navbar from "../../components/Navbar/Navbar";
import { getYoutubeVideoById } from "../../lib/videos";
import styles from "./Video.module.css";

Modal.setAppElement("#__next");
function VideoId({ video }) {
  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);
  const router = useRouter();
  const videoId = router.query.videoId;
  const { title, publishTime, description, channelTitle, statistics } = video;

  const response = async () => {
    const response = await fetch(`../api/stats?videoId=${videoId}`, {
      method: "GET",
    });

    const data = await response.json();

    if (data?.length > 0) {
      const favourited = data[0].favourited;
      if (favourited === 1) {
        setToggleLike(true);
      } else if (favourited === 0) {
        setToggleDisLike(true);
      }
    }
  };

  useEffect(() => {
    response();
  }, []);

  const runRatingService = async (favourited) => {
    return await fetch("../api/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        favourited,
        videoId,
        watched: true,
      }),
    });
  };

  const handleToggleDislike = async () => {
    const val = !toggleDisLike;
    setToggleDisLike(val);
    setToggleLike(toggleDisLike);
    const favourited = val ? 0 : 1;
    await runRatingService(favourited);
  };

  const handleToggleLike = async () => {
    const val = !toggleLike;
    const favourited = val ? 1 : 0;
    setToggleLike(val);
    setToggleDisLike(toggleLike);
    await runRatingService(favourited);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <Modal
          className={styles.modal}
          isOpen={true}
          contentLabel="Example Modal"
          onRequestClose={() => {
            router.back();
          }}
          overlayClassName={styles.overlay}
        >
          <iframe
            className={styles.videoPlayer}
            id="ytplayer"
            type="text/html"
            width="100%"
            height="360"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}
            frameBorder="0"
          ></iframe>
          <div className={styles.likeDislikeBtnWrapper}>
            <div className={styles.likeBtnWrapper}>
              <button onClick={handleToggleLike}>
                <div className={styles.btnWrapper}>
                  <Like selected={toggleLike} />
                </div>
              </button>
            </div>
            <div className={styles.dislikeBtnWrapper}>
              <button onClick={handleToggleDislike}>
                <div className={styles.btnWrapper}>
                  <DisLike selected={toggleDisLike} />
                </div>
              </button>
            </div>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.modalBodyContent}>
              <div className={styles.col1}>
                <p className={styles.publishTime}>{publishTime}</p>
                <p className={styles.title}>{title}</p>
                <p className={styles.description}>{description}</p>
              </div>

              <div className={styles.col2}>
                <p className={styles.subtext}>
                  <span className={styles.textColor}>Cast :</span>
                  <span className={styles.channelTitle}>{channelTitle}</span>
                </p>
                <p className={`${styles.subtext} ${styles.subTextWrapper}`}>
                  <span className={styles.textColor}>View Count :</span>
                  <span className={styles.channelTitle}>{statistics}</span>
                </p>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
export async function getStaticProps(context) {
  const videoId = context.params.videoId;
  const videoArray = await getYoutubeVideoById(videoId);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const listOfVideos = ["CEOc2bGV3j8", "4zH5iYM4wJo", "HxtLlByaYTc"];

  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: "blocking" };
}
export default VideoId;
