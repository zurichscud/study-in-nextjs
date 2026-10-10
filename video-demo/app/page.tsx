import VideoPlayer from "./video-player";
import styles from "./page.module.css";

const VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <span className={styles.badge}>DPlayer · Next.js</span>
        <h1 className={styles.title}>视频播放演示</h1>
        <p className={styles.subtitle}>
          使用 DPlayer 播放器组件加载远程视频流，支持快捷键与全屏播放。
        </p>
      </header>

      <section className={styles.playerCard}>
        <VideoPlayer src={VIDEO_URL} />
      </section>

      <footer className={styles.footer}>
        <span>视频源</span>
        <code className={styles.source}>{VIDEO_URL}</code>
      </footer>
    </main>
  );
}
