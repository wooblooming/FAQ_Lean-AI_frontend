import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Custom404.module.css'

export default function Custom404() {
  return (
    <div className={styles.container}>
      <Head>
        <title>404 - 페이지를 찾을 수 없습니다</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          4<span className={styles.robot}>
            <Image
              src="/robot.png"
              alt="Crying robot"
              width={100}
              height={100}
            />
          </span>4
        </h1>
        <p className={styles.description}>죄송합니다, 페이지를 찾을 수 없습니다.</p>
        <p className={styles.subdescription}>복구를 위해 최선을 다할게요</p>
        <Link href="/" className={styles.button}>
          홈으로 돌아가기
        </Link>
      </main>
    </div>
  )
}