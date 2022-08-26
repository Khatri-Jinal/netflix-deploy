import Image from "next/image";
import React from "react";
import { useState } from "react";
import styles from "./Card.module.css";
import { motion } from "framer-motion";

function Card({
  imgUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=859&q=80",
  size = "medium",
  id,
}) {
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
  return (
    <div>
      <motion.div
        className={`${classMap[size]} ${styles.imgMotionWrapper}`}
        whileHover={scale}
      >
        <Image src={imgSrc} layout="fill" onError={handleError} alt="image" />
      </motion.div>
    </div>
  );
}

export default Card;
