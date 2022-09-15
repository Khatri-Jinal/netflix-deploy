import Link from "next/link";
import React from "react";
import styles from "./Navbar.module.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import { magic } from "../../lib/magic-client";
import { removeTokenCookie } from "../../lib/cookies";

function Navbar() {
  const [userName, setUserName] = useState(" ");
  const [showDropDown, setShowDropDown] = useState(false);

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const handleDropDown = () => {
    setShowDropDown((val) => !val);
  };

  useEffect(() => {
    const user = async () => {
      try {
        const { email, issuer } = await magic.user.getMetadata();
        const didToken = await magic.user.getIdToken();
        if (email) {
          setUserName(email);
        }
      } catch (e) {
        console.error("error retrieving", e);
      }
    };
    user();
  }, []);

  const router = useRouter();

  const handleSignout = async (e) => {
    e.preventDefault();
    const didToken = await magic.user.getIdToken();
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });
      const res = await response.json();
      removeTokenCookie(res);
    } catch (error) {
      console.error("Error logging out", error);
      router.push("/login");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link href="/">
          <a className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix logo"
                width="120px"
                height="34px"
              />
            </div>
          </a>
        </Link>

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My list
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={handleDropDown}>
              <p className={styles.username}>{userName}</p>
              <Image
                src="/static/expand_more.svg"
                width="20px"
                height="20px"
                alt="image"
              />
            </button>
            {showDropDown && (
              <div className={styles.navDropdown}>
                <div>
                  <button className={styles.linkName} onClick={handleSignout}>
                    Sign out
                  </button>

                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
