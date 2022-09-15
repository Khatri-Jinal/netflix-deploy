import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";
import { magic } from "../lib/magic-client";
import { useEffect } from "react";

function Login() {
  const [userMsg, setuserMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const router = useRouter();

  const handleLoginWithEmail = async (e) => {
    setuserMsg("");
    e.preventDefault();
    if (email) {
      if (email.includes(".com")) {
        setIsLoading(true);
        // router.push('/');
        try {
          const didToken = await magic.auth.loginWithMagicLink({
            email,
          });

          if (didToken) {
            // setIsLoading(false);
            const response = await fetch("/api/login", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${didToken} `,
              },
            });
            const loggedInResponse = await response.json();
            if (loggedInResponse.done) {
              router.push("/");
            } else {
              setIsLoading(false);
              setuserMsg("Something went wrong logging in");
            }
          }
        } catch (error) {
          setIsLoading(false);

          console.error("something went wrong ", error);
        }
      } else {
        setuserMsg("Something went wrong loggin in.");
      }
    } else {
      setuserMsg("Enter valid email address");
    }
  };
  const handleOnchangeemail = (e) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
    };
  }, [router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix signIn</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
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
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="text"
            placeholder="email"
            className={styles.emailInput}
            onChange={handleOnchangeemail}
          />
          <p className={styles.userMessage}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? "Loading.." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default Login;
