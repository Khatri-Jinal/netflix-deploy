import React from "react";
import Head from "next/head";
import Navbar from "../../components/Navbar/Navbar";
import SectionCard from "../../components/Card/Section-cards";
import styles from "../../styles/MyList.module.css";
import { getMyList } from "../../lib/videos";
import useRedirectUsers from "../../utils/redirectUsers";

export async function getServerSideProps(context) {
  const { userId, token } = await useRedirectUsers(context);
  const videos = await getMyList(userId, token);

  return {
    props: {
      myListVideos: videos,
    },
  };
}

function MyList({ myListVideos }) {
  return (
    <div>
      <Head>
        <title>My list</title>
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.sectionWrapper}>
          <SectionCard
            title="My List"
            size="small"
            videos={myListVideos}
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
}

export default MyList;
