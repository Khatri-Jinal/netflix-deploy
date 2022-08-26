import { useRouter } from "next/router";
import React from "react";
import Modal from "react-modal";
import Navbar from "../../components/Navbar/Navbar";
import { getYoutubeVideoById } from "../../lib/videos";
import styles from "./Video.module.css";

Modal.setAppElement("#__next");
function VideoId({ video }) {
  console.log("my video", video);
  const router = useRouter();
  const { title, publishTime, description, channelTitle, statistics } = video;
  console.log("view", statistics);

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
            src={`https://www.youtube.com/embed/${router.query.videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}
            frameBorder="0"
          ></iframe>
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
  // const video = {
  //   title: "Hi cute dog",
  //   publishTime: "1990-01-01",
  //   description:
  //     "As middle schooler Emily Elizabeth struggles to fit in at home and at school, she discovers a small red puppy who is destined to become her best friend from a magical animal rescuer. When Clifford becomes a gigantic red dog in her New York City apartment and attracts the attention of a genetics company who wish to supersize animals, Emily and her clueless Uncle Casey have to fight the forces of greed as they go on the run across New York City and take a bite out of the Big Apple. Along the way, Clifford affects the lives of everyone around him and teaches Emily and her uncle the true meaning of acceptance and unconditional love. Based on the beloved Scholastic character, Clifford will teach the world how to love big.",
  //   channelTitle: "Paramount Pictures",
  //   viewCount: 100078,
  // };
  const videoId = context.params.videoId;
  const videoArray = await getYoutubeVideoById(videoId);
  console.log("array", videoArray);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const listOfVideos = ["CEOc2bGV3j8", "4zH5iYM4wJo", "HxtLlByaYTc"];

  // Get the paths we want to pre-render based on posts
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}
export default VideoId;

//GET https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=Ks-_Mh1QhMc&key=[YOUR_API_KEY] HTTP/1.1
