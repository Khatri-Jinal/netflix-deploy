import Image from "next/image";
import React from "react";
import { useState } from "react";
import styles from "./Card.module.css";
import { motion } from "framer-motion";

function Card({ imgUrl, size = "medium", id, shouldScale = true }) {
  const classMap = {
    large: styles.lgItem,
    medium: styles.mdItem,
    small: styles.smItem,
  };
  const [imgSrc, setImgSrc] = useState(imgUrl);
  const handleError = () => {
    setImgSrc(imgUrl);
  };
  const scale = id === 0 ? { scaleY: 1.1 } : { scale: 1.1 };

  const shouldHover = shouldScale && {
    whileHover: { ...scale },
  };
  return (
    <div>
      <motion.div
        className={`${classMap[size]} ${styles.imgMotionWrapper}`}
        {...shouldHover}
      >
        <Image src={imgSrc} layout="fill" onError={handleError} alt="image" />
      </motion.div>
    </div>
  );
}

export default Card;
