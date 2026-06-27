import express from "express";
import cors from "cors";
import { Agent as UndiciAgent } from "undici";
import { Innertube } from "youtubei.js";

const app = express();
const PORT = 3012;

let youtube;
const youtubeReady = Innertube.create({
  lang: "ja",
  location: "JP",
  retrieve_player: true,
  debug: false,
})
  .then((instance) => {
    youtube = instance;
    console.log("✅ YouTube API initialized");
  })
  .catch((err) => {
    console.error("❌ Failed to initialize YouTube API:", err);
  });

// 追加ルート内の createYoutube() を解決するためのヘルパー関数
async function createYoutube() {
  await youtubeReady;
  if (!youtube) {
    throw new Error("YouTube API failed to initialize.");
  }
  return youtube;
}

// 追加ルート内の applyChannelFilter() が未定義エラーにならないためのダミー・スタブ関数
// (必要に応じて実際のフィルタリングロジックに置き換えてください)
async function applyChannelFilter(videosFeed, sort) {
  return videosFeed;
}

app.use(cors());

const YOUTUBE_BASE_URL = "https://www.youtube.com/watch?v=";
const YOUTUBE_API_URL = "https://www.youtube.com/youtubei/v1/next";

const INNERTUBE_API_KEY = "AIzaSyDyT5W0Jh49F30Pqqtyfdf7pDLFKLJoAnw";

const REQUEST_HEADERS = {
  "accept": "*/*",
  "accept-encoding": "gzip, deflate, br, zstd",
  "accept-language": "ja,en;q=0.9",
  "cache-control": "no-cache",
  "cookie": "YSC=cFmONeO-T2E; VISITOR_INFO1_LIVE=79vF6F_Bloo; VISITOR_PRIVACY_METADATA=CgJKUBIEGgAgWA%3D%3D; _gcl_au=1.1.726696622.1769344213; LOGIN_INFO=AFmmF2swRAIgJ_Xc6ChPqF8Pp820nSBJ4uUY3te4CPhrVdf94BZnbOACID2ihpqWuvsXha7h95mlT-YAqDMFju3NElSBEeCYYOf0:QUQ3MjNmeUgwbmZzb1l3bVkydEZvdXI4YmtDTzJJQ2R3MmR1czlEM3FtRG5hRFgxbzVIZkMwTzVmS0tvQkJwVWQ3ZU0ybUt4UW1oaVVfanRLRE9LQUgxeTJmZ1VPWkllNDIxclkzSkp6Q0xxM1h4d0xFV3cwRHlvcG4tSVZ5MmxYWk9YdGRKbE0zNkpuY2NJcWtPamFDYkYybWZEVDVpWENR; PREF=tz=Asia.Tokyo&f5=20000&f7=100; SID=g.a0007wgMH5YFxZNEQe049yD6pEFKKLel-E_2ZNxhfW2dE6YruO7-bwcEPtH3JNsmB7r1Y6-QRAACgYKARgSARQSFQHGX2MidCRxCCtTx2Imwx4j6RP1MhoVAUF8yKqI9mnpqj7e81Rr3g3qaGeU0076; __Secure-1PSID=g.a0007wgMH5YFxZNEQe049yD6pEFKKLel-E_2ZNxhfW2dE6YruO7-ZW0jqw9F6qTIzil9lW2xcQACgYKATUSARQSFQHGX2MiyVPiW_lzjxYGb_rZ8VXyxhoVAUF8yKbiVcvWUCan0s-eNIVR2Lx0076; __Secure-3PSID=g.a0007wgMH5YFxZNEQe049yD6pEFKKLel-E_2ZNxhfW2dE6YruO7-2efRXwPiv4xai568FECqugACgYKAXsSARQSFQHGX2MiQ1vCeLjATbQq56sTAQraHRoVAUF8yKodd6cm5oQBNH6dxLWmKMsc0076; HSID=A4xbdR5t3wqRgbGAQ; SSID=Ak_NyHoQaPxuzRjCA; APISID=Mie2tJy2lp00rn-c/ArILhE9kMjGWQnC8E; SAPISID=u2DTg_71cgkt9FPc/AyB82aOFIdPErNuxr; __Secure-1PAPISID=u2DTg_71cgkt9FPc/AyB82aOFIdPErNuxr; __Secure-3PAPISID=u2DTg_71cgkt9FPc/AyB82aOFIdPErNuxr; __Secure-YNID=16.YT=0yP9vAgBN-ox_O_exdeIslVBp6qrCkoogTxeMd_ZA3gdebP_IKZp5yMTIWw1w98wWO88WwDQccLl2xJpsCRd5Q7qn8W2vlQ148PUbuJsGTWr0_N7dSEwADdfyaWXVjwBCURPkwrTItOtFPw8x2kgmVsmjSpj8Q22mFnRT8SVeaGHXTTZYrP8-DoyeYEVK3hAaKZMlANryYFkFPPuFgeKCMBFCumE1_k-rRMElor4r375P7G2JaDCes0U4QGp4cuM9-w4loH124Z7THx1Fz_1EB_iYOJfiXzePfFq_do1RprSHQm5zF6lh1cz4tKhPdo0Zo8U0KmjxDxNx90mSHk-og; __Secure-ROLLOUT_TOKEN=CIf2wuDz4-T6kwEQj5bhz9imkgMYsOWytoWxkwM%3D; __Secure-1PSIDTS=sidts-CjEBBj1CYsjA0ZtjO6PiejQ3DIA50cwW8TE2xPNKG8EWPl6LVMNz3AgZlM3Q5uAUyPe9EAA; __Secure-3PSIDTS=sidts-CjEBBj1CYsjA0ZtjO6PiejQ3DIA50cwW8TE2xPNKG8EWPl6LVMNz3AgZlM3Q5uAUyPe9EAA; ST-tladcw=session_logininfo=AFmmF2swRAIgJ_Xc6ChPqF8Pp820nSBJ4uUY3te4CPhrVdf94BZnbOACID2ihpqWuvsXha7h95mlT-YAqDMFju3NElSBEeCYYOf0%3AQUQ3MjNmeUgwbmZzb1l3bVkydEZvdXI4YmtDTzJJQ2R3MmR1czlEM3FtRG5hRFgxbzVIZkMwTzVmS0tvQkJwVWQ3ZU0ybUt4UW1oaVVfanRLRE9LQUgxeTJmZ1VPWkllNDIxclkzSkp6Q0xxM1h4d0xFV3cwRHlvcG4tSVZ5MmxYWk9YdGRKbE0zNkpuY2NJcWtPamFDYkYybWZEVDVpWENR; SIDCC=AKEyXzW_1CshoHehn7R-El47Qr6jD9D2kq9FzLtY0G85-XYrDzKR9LCT_QleNjarBQrcO3QMUvQ; __Secure-1PSIDCC=AKEyXzWRSdEitvGP0PdBz__ln1eSF8yLbp31xhPqodHM2WhaQlwVo_mXTdx8QQ1_xcsrf32vhv4; __Secure-3PSIDCC=AKEyXzWQbD4hyYA-0vbO6XHzrB2JvY9cuL-04hn4PEOC4yjNH89QfIH0bYmZC9u-b4EKt53WHA",
  "device-memory": "8",
  "origin": "https://www.youtube.com",
  "pragma": "no-cache",
  "priority": "u=1, i",
  "referer": "https://www.youtube.com/",
  "sec-ch-dpr": "1",
  "sec-ch-ua": '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
  "sec-ch-ua-arch": '"x86"',
  "sec-ch-ua-bitness": '"64"',
  "sec-ch-ua-form-factors": '"Desktop"',
  "sec-ch-ua-full-version": '"144.0.7559.221"',
  "sec-ch-ua-full-version-list": '"Not(A:Brand";v="8.0.0.0", "Chromium";v="144.0.7559.221", "Google Chrome";v="144.0.7559.221"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-model": '""',
  "sec-ch-ua-platform": '"Chrome OS"',
  "sec-ch-ua-platform-version": '"16503.76.0"',
  "sec-ch-ua-wow64": "?0",
  "sec-ch-viewport-width": "915",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent": "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
  "x-browser-channel": "stable",
  "x-browser-copyright": "Copyright 2026 Google LLC. All Rights reserved.",
  "x-browser-validation": "ZiXHB9YFjQ/cenQyml/9zpPvvIU=",
  "x-browser-year": "2026",
  "x-client-data": "CIm2yQEIo7bJAQipncoBCIztygEIlaHLAQiIoM0BCNajzwEI1a3PAQi7rs8BCMevzwEIya/PAQj6r88BCLSwzwEInrHPAQifs88BCIW0zwEY7IXPAQ=="
};

const undiciAgent = new UndiciAgent({
  connections: 16,
  keepAliveTimeout: 6000,
});

const fetchImageAsBase64 = async (url) => {
  if (!url) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      dispatcher: undiciAgent,
      headers: {
        Referer: "https://www.youtube.com/",
        "User-Agent": REQUEST_HEADERS["user-agent"],
      },
      signal: controller.signal,
    });

    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const b = Buffer.from(buf);
    const contentType = res.headers.get("content-type") || "image/jpeg";
    return `data:${contentType};base64,${b.toString("base64")}`;
  } catch (e) {
    console.warn("fetchImageAsBase64 failed", e?.message || e);
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

const CLIENT_CONTEXT = {
  client: {
    hl: "ja",
    gl: "JP",
    clientName: "WEB",
    clientVersion: "2.20240214.01.00",
    ua: REQUEST_HEADERS["user-agent"],
  },
};

const getTextFromRuns = (runs) => {
  return runs?.map((run) => run.text).join("") || null;
};

const safeGet = (fn) => {
  try {
    return fn();
  } catch (e) {
    return null;
  }
};

const parseRawItems = (rawItems) => {
  if (!Array.isArray(rawItems)) return [];

  const flattenedItems = rawItems.reduce((acc, item) => {
    if (item?.itemSectionRenderer?.contents) {
      return acc.concat(item.itemSectionRenderer.contents);
    }
    acc.push(item);
    return acc;
  }, []);

  return flattenedItems
    .map((item) => {
      if (item?.lockupViewModel) {
        return parseVideoLockup(item);
      }
      if (item?.compactVideoRenderer) {
        const cvr = item.compactVideoRenderer;
        return {
          type: "compact_video",
          videoId: cvr.videoId,
          title: getTextFromRuns(cvr.title?.runs),
          thumbnails: { static: cvr.thumbnail?.thumbnails },
          badge: {
            text: cvr.lengthText?.simpleText,
            icon: null,
          },
          playlistId: cvr.navigationEndpoint?.watchEndpoint?.playlistId || null,
          channel: {
            name: getTextFromRuns(cvr.shortBylineText?.runs),
            id: cvr.shortBylineText?.runs?.[0]?.navigationEndpoint
              ?.browseEndpoint?.browseId,
          },
          stats: {
            views: getTextFromRuns(cvr.viewCountText?.runs),
            publishedTime: getTextFromRuns(cvr.publishedTimeText?.runs),
          },
        };
      }
      if (item?.continuationItemRenderer) {
        const cir = item.continuationItemRenderer;
        const endpoint = cir.continuationEndpoint;
        const webCmd = endpoint?.commandMetadata?.webCommandMetadata;
        const contCmd = endpoint?.continuationCommand;

        return {
          type: "continuation",
          trigger: cir.trigger,
          sendPost: webCmd?.sendPost,
          apiUrl: webCmd?.apiUrl,
          token: contCmd?.token,
          request: contCmd?.request,
        };
      }
      return null;
    })
    .filter(Boolean);
};

const parseVideoLockup = (item) => {
  const lockup = item?.lockupViewModel;
  if (!lockup) return null;

  const metadataVM = lockup.metadata?.lockupMetadataViewModel;
  const contentMetadata = metadataVM?.metadata?.contentMetadataViewModel;
  const title = metadataVM?.title?.content;
  const videoId = lockup.contentId;

  const overlays =
    lockup.contentImage?.thumbnailViewModel?.overlays ||
    lockup.contentImage?.overlays ||
    [];

  const thumbnailData =
    lockup.contentImage?.thumbnailViewModel?.image?.sources ||
    lockup.contentImage?.image?.sources ||
    [];

  const animatedThumbnail = overlays.find(
    (o) => o.animatedThumbnailOverlayViewModel
  )?.animatedThumbnailOverlayViewModel?.thumbnail?.sources?.[0]?.url;

  const metadataRows = contentMetadata?.metadataRows || [];
  const channelRow = metadataRows[0]?.metadataParts?.[0];
  const channelName = channelRow?.text?.content;
  const channelBadges =
    channelRow?.attachmentRuns?.map((run) => ({
      icon: run.element?.type?.imageType?.image?.sources?.[0]?.clientResource
        ?.imageName,
    })) || [];

  const avatarData =
    metadataVM?.image?.decoratedAvatarViewModel?.avatar?.avatarViewModel;
  const channelAvatar = avatarData?.image?.sources?.[0]?.url;
  const channelUrl =
    metadataVM?.image?.decoratedAvatarViewModel?.rendererContext?.commandContext
      ?.onTap?.innertubeCommand?.browseEndpoint?.canonicalBaseUrl;

  const statsRow = metadataRows[1]?.metadataParts || [];
  const views = statsRow[0]?.text?.content;
  const publishedTime = statsRow[1]?.text?.content;

  const badgeViewModel = overlays.find((o) => o.thumbnailOverlayBadgeViewModel)
    ?.thumbnailOverlayBadgeViewModel?.thumbnailBadges?.[0]
    ?.thumbnailBadgeViewModel;

  const badgeText = badgeViewModel?.text;
  const badgeIcon =
    badgeViewModel?.icon?.sources?.[0]?.clientResource?.imageName;

  const playlistId =
    lockup.rendererContext?.commandContext?.onTap?.innertubeCommand
      ?.watchEndpoint?.playlistId;

  return {
    type: "video",
    videoId,
    title,
    thumbnails: {
      static: thumbnailData,
      animated: animatedThumbnail || null,
    },
    badge: {
      text: badgeText,
      icon: badgeIcon || null,
    },
    playlistId: playlistId || null,
    channel: {
      name: channelName,
      url: channelUrl,
      avatar: channelAvatar,
      badges: channelBadges,
      label: metadataVM?.image?.decoratedAvatarViewModel?.a11yLabel,
    },
    stats: {
      views,
      publishedTime,
      fullText: contentMetadata?.delimiter,
    },
    trackingParams:
      lockup.rendererContext?.loggingContext?.loggingDirectives?.trackingParams,
  };
};

const fetchContinuationData = async (token) => {
  if (!token) return null;

  const targetApiUrl = `${YOUTUBE_API_URL}?key=${INNERTUBE_API_KEY}`;

  try {
    const apiResponse = await fetch(targetApiUrl, {
      method: "POST",
      headers: {
        ...REQUEST_HEADERS,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        context: CLIENT_CONTEXT,
        continuation: token,
      }),
    });

    if (!apiResponse.ok) {
      console.warn(`[Continuation API Failed] Status: ${apiResponse.status}`);
      return null;
    }

    const json = await apiResponse.json();
    const endpoint = json.onResponseReceivedEndpoints?.[0];
    const continuationItems =
      endpoint?.appendContinuationItemsAction?.continuationItems;

    if (!continuationItems) return null;

    return {
      targetId: endpoint?.appendContinuationItemsAction?.targetId,
      items: parseRawItems(continuationItems),
    };
  } catch (e) {
    console.error("Error fetching continuation:", e);
    return null;
  }
};

async function generateThumbnails(videoId) {
  if (!videoId) return {};
  try {
    const url = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch thumbnail: ${res.status}`);
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return {
      medium: { url: `data:image/jpeg;base64,${base64}` }
    };
  } catch (err) {
    console.error("❌ Thumbnail fetch error:", err);
    return { medium: { url: "" } };
  }
}

function normalizeViewCount(viewText) {
  if (typeof viewText !== "string") return "0";

  if (viewText.includes("万")) {
    const num = parseFloat(viewText.replace(/[^\d.]/g, ""));
    return Math.round(num * 10000).toString();
  }
  if (viewText.includes("億")) {
    const num = parseFloat(viewText.replace(/[^\d.]/g, ""));
    return Math.round(num * 100000000).toString();
  }

  return viewText.replace(/[^\d]/g, "") || "0";
}

function formatPublishedAtJapanese(relativeText) {
  if (!relativeText) return "不明";

  const regex = /(\d+)\s*(second|minute|hour|day|week|month|year)s?\s*ago/i;
  const match = relativeText.match(regex);

  if (!match) {
    if (typeof relativeText === "string" && /前$/.test(relativeText)) {
      return relativeText;
    }
    return "不明";
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "second":
      return value < 60 ? "たった今" : `${value}秒前`;
    case "minute":
      return value === 1 ? "1分前" : `${value}分前`;
    case "hour":
      return value === 1 ? "1時間前" : `${value}時間前`;
    case "day":
      return value === 1 ? "1日前" : `${value}日前`;
    case "week":
      return value === 1 ? "1週間前" : `${value}週間前`;
    case "month":
      return value === 1 ? "1ヶ月前" : `${value}ヶ月前`;
    case "year":
      return value === 1 ? "1年前" : `${value}年前`;
    default:
      return "不明";
  }
}

app.get("/api/video2/:id", async (req, res) => {
  let rawVideoId = req.params.id;
  try {
    rawVideoId = decodeURIComponent(rawVideoId);
  } catch (e) {
  }
  
  let videoId = rawVideoId;

  let continuationToken = req.query.token;
  let depth = null;

  const checkParam = (key, val) => {
    if (key === "token") continuationToken = val;
    if (key === "depth") depth = val;
  };

  if (videoId.includes("====")) {
    const parts = videoId.split("====");
    videoId = parts[0];
    const paramsString = parts[1];
    if (paramsString) {
      const pairs = paramsString.split("==p==");
      pairs.forEach((pair) => {
        const [key, val] = pair.split("==i==");
        checkParam(key, val);
      });
    }
  } else if (videoId.includes("&")) {
    const parts = videoId.split("&");
    videoId = parts[0];
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (part.includes("==i==")) {
        const [key, val] = part.split("==i==");
        checkParam(key, val);
      } else if (part.includes("=")) {
        const [key, val] = part.split("=");
        checkParam(key, val);
      }
    }
  } else if (videoId.includes("==p==")) {
    const parts = videoId.split("==p==");
    videoId = parts[0];
    for (let i = 1; i < parts.length; i++) {
      if (parts[i].includes("==i==")) {
        const [key, val] = parts[i].split("==i==");
        checkParam(key, val);
      }
    }
  }

  if (!videoId) {
    return res.status(400).json({ error: "Missing video ID parameter" });
  }

  try {
    if (continuationToken) {
      const result = await fetchContinuationData(continuationToken);

      const relatedVideosCompat =
        result?.items
          ?.map((item) => {
            if (item.type === "continuation") return null;

            let rvId = item.videoId;
            if (rvId && rvId.length !== 11 && rvId.startsWith("RD")) {
              rvId = videoId;
            }

            return {
              type: item.playlistId ? "playlist" : "video",
              videoId: rvId,
              title: item.title,
              channelName: item.channel?.name || "",
              viewCountText: item.stats?.views || "",
              publishedTimeText: item.stats?.publishedTime || "",
              duration: item.badge?.text || null,
              badge: null,
              thumbnails: item.thumbnails?.static || [],
              thumbnail: item.thumbnails?.static?.[0]?.url || null,
              channelAvatar: item.channel?.avatar || "",
              playlistId: item.playlistId,
            };
          })
          ?.filter(Boolean) || [];

      const nextToken =
        result?.items?.find((i) => i.type === "continuation")?.token || null;

      try {
        await Promise.all(
          relatedVideosCompat.map(async (rv) => {
            let b64 = null;
            if (rv.thumbnail) {
              b64 = await fetchImageAsBase64(rv.thumbnail);
            }
            
            if (!b64 && rv.videoId) {
              const fallbackUrl = `https://i.ytimg.com/vi_webp/${rv.videoId}/default.webp`;
              b64 = await fetchImageAsBase64(fallbackUrl);
            }

            if (b64) {
              if (Array.isArray(rv.thumbnails) && rv.thumbnails.length > 0) {
                rv.thumbnails[0].url = b64;
              } else {
                rv.thumbnails = [{ url: b64 }];
              }
              rv.thumbnail = b64;
            }
          })
        );
      } catch (e) {
        console.warn(
          "Thumbnail base64 conversion (continuation) failed",
          e?.message || e
        );
      }

      return res.json({
        id: videoId,
        title: "",
        "Related-videos": {
          relatedCount: relatedVideosCompat.length,
          nextContinuationToken: nextToken,
          relatedVideos: relatedVideosCompat,
        },
      });
    }

    const targetUrl = `${YOUTUBE_BASE_URL}${videoId}`;
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: REQUEST_HEADERS,
    });

    if (!response.ok) {
      return res.json({
        id: videoId,
        unavailable: true,
        reason: `Service unavailable (Status ${response.status})`,
        "Related-videos": { relatedVideos: [] },
      });
    }

    const html = await response.text();
    const regex = /var ytInitialData\s*=\s*({.*?});/s;
    const match = html.match(regex);

    if (!match || !match[1]) {
      return res.json({
        id: videoId,
        unavailable: true,
        reason: "Failed to extract data",
        "Related-videos": { relatedVideos: [] },
      });
    }

    try {
      const rawData = JSON.parse(match[1]);
      const twoColumnResults =
        rawData.contents?.twoColumnWatchNextResults?.results?.results;
      const secondarySection =
        rawData.contents?.twoColumnWatchNextResults?.secondaryResults
          ?.secondaryResults;

      let relatedVideos = [];
      let nextContinuationToken = null;

      if (secondarySection) {
        const rawResults = secondarySection.results;
        let parsedResults = parseRawItems(rawResults);

        if (depth == "2") {
          const continuationItem = parsedResults.find(
            (item) => item.type === "continuation"
          );
          if (continuationItem && continuationItem.token) {
            const extraData = await fetchContinuationData(
              continuationItem.token
            );
            if (extraData && extraData.items.length > 0) {
              const resultsWithoutContinuation = parsedResults.filter(
                (item) => item.type !== "continuation"
              );
              parsedResults = [
                ...resultsWithoutContinuation,
                ...extraData.items,
              ];
            }
          }
        }

        relatedVideos = parsedResults
          .map((item) => {
            if (item.type === "continuation") {
              nextContinuationToken = item.token;
              return null;
            }

            let rvId = item.videoId;
            if (rvId && rvId.length !== 11 && rvId.startsWith("RD")) {
              rvId = videoId;
            }

            return {
              type: item.playlistId ? "playlist" : "video",
              videoId: rvId,
              title: item.title,
              channelName: item.channel?.name || "",
              viewCountText: item.stats?.views || "",
              publishedTimeText: item.stats?.publishedTime || "",
              duration: item.badge?.text || null,
              badge: null,
              thumbnails: item.thumbnails?.static || [],
              thumbnail: item.thumbnails?.static?.[0]?.url || null,
              channelAvatar: item.channel?.avatar || "",
              playlistId: item.playlistId,
              overlayIcon: item.badge?.icon,
            };
          })
          .filter(Boolean);

        try {
          await Promise.all(
            relatedVideos.map(async (rv) => {
              let b64 = null;
              if (rv.thumbnail) {
                b64 = await fetchImageAsBase64(rv.thumbnail);
              }

              if (!b64 && rv.videoId) {
                const fallbackUrl = `https://i.ytimg.com/vi_webp/${rv.videoId}/default.webp`;
                b64 = await fetchImageAsBase64(fallbackUrl);
              }

              if (b64) {
                if (Array.isArray(rv.thumbnails) && rv.thumbnails.length > 0) {
                  rv.thumbnails[0].url = b64;
                } else {
                  rv.thumbnails = [{ url: b64 }];
                }
                rv.thumbnail = b64;
              }
            })
          );
        } catch (e) {
          console.warn(
            "Thumbnail base64 conversion (initial) failed",
            e?.message || e
          );
        }
      }

      const primaryInfoRenderer = twoColumnResults?.contents?.find(
        (c) => c.videoPrimaryInfoRenderer
      )?.videoPrimaryInfoRenderer;

      const secondaryInfoRenderer = twoColumnResults?.contents?.find(
        (c) => c.videoSecondaryInfoRenderer
      )?.videoSecondaryInfoRenderer;

      if (!primaryInfoRenderer || !secondaryInfoRenderer) {
        return res.json({
          id: videoId,
          unavailable: true,
          reason: "Video details not found",
          "Related-videos": { relatedVideos: [] },
        });
      }

      const title = getTextFromRuns(primaryInfoRenderer?.title?.runs) || "";
      const shortViews =
        primaryInfoRenderer?.viewCount?.videoViewCountRenderer?.shortViewCount
          ?.simpleText || "";
      const originalViews =
        primaryInfoRenderer?.viewCount?.videoViewCountRenderer?.viewCount
          ?.simpleText || "";
      const viewCountStr = shortViews || originalViews || "";

      const relativeDate =
        primaryInfoRenderer?.relativeDateText?.simpleText || "";
      const fullDate = primaryInfoRenderer?.dateText?.simpleText || "";

      const likeButtonTitle =
        safeGet(() => {
          const topLevelButtons =
            primaryInfoRenderer?.videoActions?.menuRenderer?.topLevelButtons;
          return topLevelButtons?.find(
            (b) => b.segmentedLikeDislikeButtonViewModel
          )?.segmentedLikeDislikeButtonViewModel?.likeButtonViewModel
            ?.likeButtonViewModel?.toggleButtonViewModel?.toggleButtonViewModel
            ?.defaultButtonViewModel?.buttonViewModel?.title;
        }) || "";

      const ownerRenderer = secondaryInfoRenderer?.owner?.videoOwnerRenderer;
      const channelId =
        ownerRenderer?.title?.runs?.[0]?.navigationEndpoint?.browseEndpoint
          ?.browseId || "";
      const channelName = getTextFromRuns(ownerRenderer?.title?.runs) || "";
      const subCount = ownerRenderer?.subscriberCountText?.simpleText || "";
      const authorThumb = ownerRenderer?.thumbnail?.thumbnails?.[0]?.url || "";

      const collabHeadline = safeGet(
        () =>
          ownerRenderer?.navigationEndpoint?.showDialogCommand
            ?.panelLoadingStrategy?.inlineContent?.dialogViewModel?.header
            ?.dialogHeaderViewModel?.headline?.content
      );
      const collaboratorsList =
        safeGet(() => {
          const rawItems =
            ownerRenderer?.navigationEndpoint?.showDialogCommand
              ?.panelLoadingStrategy?.inlineContent?.dialogViewModel
              ?.customContent?.listViewModel?.listItems;
          return Array.isArray(rawItems)
            ? rawItems.map((item) => ({
                name: item?.listItemViewModel?.title?.content || "",
                subtitle: item?.listItemViewModel?.subtitle?.content || "",
                channelId:
                  item?.listItemViewModel?.leadingAccessory?.avatarViewModel
                    ?.endpoint?.innertubeCommand?.browseEndpoint?.browseId ||
                  "",
                thumbnail:
                  item?.listItemViewModel?.leadingAccessory?.avatarViewModel
                    ?.image?.sources?.[0]?.url || "",
              }))
            : [];
        }) || [];

      const descRaw =
        secondaryInfoRenderer?.attributedDescription?.content || "";

      const nonEmptyLines = descRaw
        .split(/\r?\n/)
        .filter((line) => line.trim() !== "");

      const descriptionObj = {
        text: descRaw,
        formatted: descRaw.replace(/\n/g, "<br>"),
        run0: nonEmptyLines[0] || "",
        run1: nonEmptyLines[1] || "",
        run2: nonEmptyLines[2] || "",
        run3: nonEmptyLines[3] || "",
      };

      const mainThumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      const mainThumbnailB64 = (await fetchImageAsBase64(mainThumbnailUrl)) || mainThumbnailUrl;

      const isCollaborator = collaboratorsList.length > 0 || !!collabHeadline;

      let displayAuthorName = channelName;
      let displayAuthorThumbnail = authorThumb;
      let displayAuthorSubscribers = subCount;

      if (isCollaborator && collaboratorsList.length > 0) {
        displayAuthorName = collaboratorsList[0].name;
        displayAuthorThumbnail = collaboratorsList[0].thumbnail;
        displayAuthorSubscribers = "コラボレーター";
      }

      let commentData = { totalCommentCount: null, comments: [] };
      try {
        const commentSection = await youtube.getComments(videoId);
        const commentThreads = commentSection.contents || [];
        commentData.totalCommentCount = commentSection.header?.count?.text
          || commentSection.header?.comments_count?.text
          || null;
        commentData.comments = commentThreads.map((thread) => {
          const c = thread.comment;
          return {
            author: c.author?.name || "匿名",
            authorIcon: c.author?.thumbnails?.[0]?.url || null,
            text: c.content?.toString() || "",
            date: c.published_time || "", 
            likes: c.like_count || 0,
          };
        });
      } catch (e) {
        console.warn("Comment fetch failed", e);
      }

      res.json({
        id: videoId,
        title: title,
        views: viewCountStr,
        relativeDate: relativeDate,
        likes: likeButtonTitle,
        thumbnail: mainThumbnailB64,
        author: {
          id: channelId,
          name: displayAuthorName,
          subscribers: displayAuthorSubscribers,
          thumbnail: displayAuthorThumbnail,
          collaborator: isCollaborator,
          collaborators: collaboratorsList,
        },
        description: descriptionObj,
        "Related-videos": {
          relatedCount: relatedVideos.length,
          nextContinuationToken: nextContinuationToken,
          relatedVideos: relatedVideos,
        },
        comments: commentData,

        extended_stats: {
          views_original: originalViews,
          views_short: shortViews,
          date_simple: fullDate,
          date_relative_label:
            primaryInfoRenderer?.relativeDateText?.accessibility
              ?.accessibilityData?.label || "",
        },
        extended_badges: ownerRenderer?.badges || [],
        extended_superTitle:
          getTextFromRuns(primaryInfoRenderer?.superTitleLink?.runs) || "",
        trackingParams: twoColumnResults?.trackingParams || null,
      });
    } catch (parseError) {
      console.error(`[JSON Parse Error] ID: ${videoId}`, parseError);
      res.status(500).json({
        error: "Failed to parse internal data",
        detail: parseError.message,
      });
    }
  } catch (error) {
    console.error(`[Server Error] ID: ${videoId}`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/search", async (req, res) => {
  await youtubeReady;

  if (!youtube) {
    return res.status(503).json({ error: "YouTube API failed to initialize." });
  }

  const keyword = req.query.q;
  const pageToken = req.query.pageToken;

  if (!keyword && !pageToken) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  try {
    let result;
    if (pageToken) {
      result = await youtube.getSearchContinuation(pageToken);
    } else {
      result = await youtube.search(keyword, {
        type: "video,channel",
        limit: 20,
        params: {
          gl: "JP",
          hl: "ja",
        },
      });
    }

    const videos = await Promise.all(
      (result.results || [])
        .filter(item => ["Video", "Channel"].includes(item.type))
        .map(async item => {
          if (item.type === "Video") {
            const videoId = item.video_id || item.id;
            return {
              type: "video",
              id: videoId,
              title: item.title?.text || item.title?.runs?.[0]?.text || "無題",
              duration: item.duration?.text || "不明",
              publishedAt: formatPublishedAtJapanese(item.published?.text || ""),
              channel: item.author?.name || "不明なチャンネル",
              channelId: item.author?.id || "",
              channelIcon: item.author?.thumbnails?.[0]?.url || "",
              thumbnails: await generateThumbnails(videoId),
              viewCount: normalizeViewCount(item.view_count?.text || ""),
            };
          } else if (item.type === "Channel") {
            return {
              type: "channel",
              id: item.channel_id || item.id,
              name: item.author?.name || "不明なチャンネル",
              icon: item.author?.thumbnails?.[0]?.url || "",
              subscriberCount: item.video_count?.text || "不明",
            };
          }
        })
    );

    res.json({
      results: videos,
      nextPageToken: result.continuation || null,
    });
  } catch (e) {
    console.error("❌ Search error:", e);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get('/api/channel', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { id, page = '1', sort } = req.query; 
    if (!id) return res.status(400).json({ error: "Missing channel id" });

    const channel = await youtube.getChannel(id);
    let videosFeed = await channel.getVideos();
    videosFeed = await applyChannelFilter(videosFeed, sort);

    let videosToReturn = videosFeed.videos || [];
    const targetPage = parseInt(page);
    
    if (targetPage > 1) {
        for (let i = 1; i < targetPage; i++) {
            if (videosFeed.has_continuation) {
                videosFeed = await videosFeed.getContinuation();
                videosToReturn = videosFeed.videos || [];
            } else {
                videosToReturn = [];
                break;
            }
        }
    }
    
    const title = channel.metadata?.title || channel.header?.title?.text || channel.header?.author?.name || null;
    let avatar = channel.metadata?.avatar || channel.header?.avatar || channel.header?.author?.thumbnails || null;
    if (Array.isArray(avatar) && avatar.length > 0) avatar = avatar[0].url;
    else if (typeof avatar === 'object' && avatar?.url) avatar = avatar.url;

    let banner = channel.metadata?.banner || channel.header?.banner || null;
    if (Array.isArray(banner) && banner.length > 0) banner = banner[0].url;
    else if (typeof banner === 'object' && banner?.url) banner = banner.url;
    else if (typeof banner !== 'string') banner = null; 

    res.status(200).json({
      channel: {
        id: channel.id, 
        name: title, 
        description: channel.metadata?.description || null,
        avatar: avatar, 
        banner: banner,
        subscriberCount: channel.metadata?.subscriber_count?.pretty || '非公開', 
        videoCount: channel.metadata?.videos_count?.text ?? channel.metadata?.videos_count ?? '0'
      },
      page: targetPage, 
      videos: videosToReturn,
      nextPageToken: videosFeed.has_continuation ? String(targetPage + 1) : undefined
    });
  } catch (err) { 
      res.status(500).json({ error: err.message }); 
  }
});

app.get('/api/channel-shorts', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing channel id" });
    const channel = await youtube.getChannel(id);
    const shortsFeed = await channel.getShorts();
    let shorts = [];
    if (shortsFeed.videos) {
        shorts = shortsFeed.videos;
    } else if (shortsFeed.contents && Array.isArray(shortsFeed.contents)) {
        const tabContent = shortsFeed.contents[0];
        if (tabContent && tabContent.contents) shorts = tabContent.contents;
    }
    res.status(200).json(shorts);
  } catch (err) { 
      res.status(500).json({ error: err.message }); 
  }
});

app.get('/api/channel-live', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing channel id" });
    const channel = await youtube.getChannel(id);
    const liveFeed = await channel.getLiveStreams();
    res.status(200).json({ videos: liveFeed.videos || [] });
  } catch (err) {
      res.status(200).json({ videos: [] });
  }
});

app.get('/api/channel-community', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing channel id" });
    const channel = await youtube.getChannel(id);
    const community = await channel.getCommunity();
    const posts = community.posts?.map(post => ({
        id: post.id,
        text: post.content?.text || "",
        publishedTime: post.published.text,
        likeCount: post.vote_count?.text || "0",
        author: { name: post.author.name, avatar: post.author.thumbnails[0]?.url },
        attachment: post.attachment ? {
            type: post.attachment.type,
            images: post.attachment.images?.map(i => i.url),
            choices: post.attachment.choices?.map(c => c.text.text),
            videoId: post.attachment.video?.id
        } : null
    })) || [];
    res.status(200).json({ posts });
  } catch (err) {
      res.status(200).json({ posts: [] });
  }
});

app.get('/api/channel-playlists', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing channel id" });
    const channel = await youtube.getChannel(id);
    const playlistsFeed = await channel.getPlaylists();
    let playlists = playlistsFeed.playlists || playlistsFeed.items || [];
    if (playlists.length === 0 && playlistsFeed.contents && Array.isArray(playlistsFeed.contents)) {
        const tabContent = playlistsFeed.contents[0];
        if (tabContent && tabContent.contents) playlists = tabContent.contents;
    }
    res.status(200).json({ playlists });
  } catch (err) { 
      res.status(500).json({ error: err.message }); 
  }
});

app.get('/api/playlist', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { id } = req.query;
    const playlist = await youtube.getPlaylist(id);
    if (!playlist.info?.id) return res.status(404).json({ error: "Playlist not found"});
    res.status(200).json(playlist);
  } catch (err) { 
      res.status(500).json({ error: err.message }); 
  }
});

app.get('/api/fvideo', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const homeFeed = await youtube.getHomeFeed();
    res.status(200).json({ videos: homeFeed.videos || homeFeed.items || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------------
// 🌟 ここから下が今回追加した youtubei.js の新機能群 🌟
// -------------------------------------------------------------------

// 1. 急上昇（トレンド）の取得
app.get('/api/trending', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const trending = await youtube.getTrending();
    res.status(200).json({
      videos: trending.videos || [],
      categories: trending.categories || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. 探索・ガイド（Explore）の取得
app.get('/api/explore', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const explore = await youtube.getExplore();
    res.status(200).json(explore);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. ハッシュタグ検索（例: /api/hashtag?tag=マイクラ）
app.get('/api/hashtag', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { tag } = req.query;
    if (!tag) return res.status(400).json({ error: "Missing tag query" });
    
    const hashtagFeed = await youtube.getHashtag(tag);
    res.status(200).json({
      header: hashtagFeed.header,
      videos: hashtagFeed.videos || []
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. 動画の字幕（文字起こし）取得
app.get('/api/transcript', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing video id" });

    const info = await youtube.getInfo(id);
    const transcriptInfo = await info.getTranscript();
    
    const segments = transcriptInfo?.transcript?.content?.body?.initial_segments?.map(seg => ({
      text: seg.snippet?.text,
      startTime: seg.start_ms,
      endTime: seg.end_ms
    })) || [];

    res.status(200).json({ segments });
  } catch (err) {
    res.status(500).json({ error: "Transcript not available or " + err.message });
  }
});

// 5. URLの解決 (URLから動画IDやチャンネルIDなどを特定)
app.get('/api/resolve', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Missing url" });

    const result = await youtube.resolveURL(url);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- YouTube Music 機能群 (非常に安定しています) ---

// 6. Music 検索
app.get('/api/music/search', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { q, filter } = req.query; 
    if (!q) return res.status(400).json({ error: "Missing query" });

    const searchResult = await youtube.music.search(q, { type: filter });
    res.status(200).json(searchResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Music 楽曲の詳細（ストリーミング情報など）
app.get('/api/music/track', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing track id" });

    const trackInfo = await youtube.music.getInfo(id);
    res.status(200).json(trackInfo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Music 歌詞の取得
app.get('/api/music/lyrics', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing track id" });

    const lyrics = await youtube.music.getLyrics(id);
    res.status(200).json({
       text: lyrics?.text || "No lyrics available",
       footer: lyrics?.footer
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Music アーティスト情報の取得
app.get('/api/music/artist', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing artist id" });

    const artist = await youtube.music.getArtist(id);
    res.status(200).json(artist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Music プレイリスト・アルバムの取得
app.get('/api/music/playlist', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing playlist/album id" });

    const playlist = await youtube.music.getPlaylist(id);
    res.status(200).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Music 「次に再生（Up Next / ラジオ）」の取得
app.get('/api/music/upnext', async (req, res) => {
  try {
    const youtube = await createYoutube();
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing track id" });

    const upNext = await youtube.music.getUpNext(id);
    res.status(200).json(upNext);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// サーバー起動 (ポート番号は元の3012を使用)
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));
