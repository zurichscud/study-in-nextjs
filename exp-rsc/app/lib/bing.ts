const BING_IMAGE_API =
  "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN";

export type DailyImage = {
  url: string;
  alt: string;
  copyright: string;
};

type BingImageArchive = {
  images?: {
    url?: string;
    title?: string;
    copyright?: string;
  }[];
};

export async function getDailyImage(): Promise<DailyImage | null> {
  try {
    const res = await fetch(BING_IMAGE_API, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return null;
    }

    const data = (await res.json()) as BingImageArchive;
    const image = data.images?.[0];
    if (!image?.url) {
      return null;
    }

    return {
      url: new URL(image.url, "https://www.bing.com").toString(),
      alt: image.title ?? image.copyright ?? "必应每日一图",
      copyright: image.copyright ?? "",
    };
  } catch {
    return null;
  }
}
