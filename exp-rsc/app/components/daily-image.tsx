import Image from "next/image";
import { getDailyImage } from "../lib/bing";

export default async function DailyImage() {
  const daily = await getDailyImage();

  if (!daily) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        加载图片失败
      </div>
    );
  }

  return (
    <figure className="flex flex-col gap-2">
      <Image
        src={daily.url}
        alt={daily.alt}
        width={1920}
        height={1080}
        priority
        className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800"
      />
      {daily.copyright ? (
        <figcaption className="text-right text-xs text-zinc-500 dark:text-zinc-400">
          {daily.copyright}
        </figcaption>
      ) : null}
    </figure>
  );
}
