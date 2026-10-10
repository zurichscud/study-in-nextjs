"use client";

import { useEffect, useRef } from "react";
import type DPlayer from "dplayer";

export default function VideoPlayer({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let player: DPlayer | null = null;
    let disposed = false;

    import("dplayer")
      .then(({ default: DPlayerCtor }) => {
        if (disposed || !containerRef.current) return;
        player = new DPlayerCtor({
          container: containerRef.current,
          video: { url: src, type: "auto" },
          theme: "#38bdf8",
          preload: "auto",
          volume: 0.8,
          hotkey: true,
          fullScreen: "web",
          lang: "zh-cn",
        });
      })
      .catch((error) => {
        console.error("DPlayer 加载失败", error);
      });

    return () => {
      disposed = true;
      player?.destroy();
    };
  }, [src]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
