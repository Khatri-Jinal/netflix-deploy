import Link from "next/link";
import React from "react";
import Card from "./Card";
import styles from "./Section-card.module.css";

function SectionCard({ title, size, videos = [] }) {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((video, idx) => {
          console.log("video is", video.id);
          return (
            <Link href={`/video/${video.id}`} key={idx}>
              <div>
                <Card id={idx} imgUrl={video.imgUrl} size={size} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default SectionCard;
