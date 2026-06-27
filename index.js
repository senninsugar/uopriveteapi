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

// チャンネル詳細情報を網羅的に取得するAPIエンドポイント
app.get('/api/channel/:id', async (req, res) => {
  await youtubeReady;

  const channelId = req.params.id;

  if (!youtube) {
    return res.status(500).json({ error: 'YouTube client is not initialized.' });
  }

  try {
    // 1. チャンネルの基本情報を取得
    const channel = await youtube.getChannel(channelId);

    // 2. チャンネルの「動画」タブから最新の通常動画を取得
    let videosData = [];
    try {
      const videosTab = await channel.getVideos();
      if (videosTab && videosTab.videos) {
        videosData = videosTab.videos.map(video => ({
          id: video.id,
          title: video.title?.text,
          description: video.description_snippet?.text,
          thumbnail: video.thumbnails,
          duration: video.duration?.text,
          views: video.view_count?.text,
          published: video.published?.text
        }));
      }
    } catch (e) {
      console.warn(`[Warning] Could not fetch videos tab for ${channelId}:`, e.message);
    }

    // 3. チャンネルの「ショート」タブから最新のショート動画を取得
    let shortsData = [];
    try {
      const shortsTab = await channel.getShorts();
      if (shortsTab && shortsTab.videos) {
        shortsData = shortsTab.videos.map(short => ({
          id: short.id,
          title: short.title?.text,
          thumbnail: short.thumbnails,
          views: short.view_count?.text
        }));
      }
    } catch (e) {
      console.warn(`[Warning] Could not fetch shorts tab for ${channelId}:`, e.message);
    }

    // 4. チャンネルの「再生リスト」タブから公開再生リストを取得
    let playlistsData = [];
    try {
      const playlistsTab = await channel.getPlaylists();
      if (playlistsTab && playlistsTab.playlists) {
        playlistsData = playlistsTab.playlists.map(playlist => ({
          id: playlist.id,
          title: playlist.title?.text,
          video_count: playlist.video_count?.text,
          thumbnail: playlist.thumbnails,
          author: playlist.author?.name
        }));
      }
    } catch (e) {
      console.warn(`[Warning] Could not fetch playlists tab for ${channelId}:`, e.message);
    }

    // 5. チャンネルの「コミュニティ」タブから最近の投稿を取得
    let communityData = [];
    try {
      const communityTab = await channel.getCommunity();
      if (communityTab && communityTab.posts) {
        communityData = communityTab.posts.map(post => ({
          id: post.id,
          text: post.content?.text,
          published: post.published?.text,
          likes: post.vote_count || post.like_count?.text,
          reply_count: post.reply_count?.text
        }));
      }
    } catch (e) {
      console.warn(`[Warning] Could not fetch community tab for ${channelId}:`, e.message);
    }

    // 6. すべてのデータを統合してレスポンス用オブジェクトを作成
    const detailedInfo = {
      id: channel.header?.author?.id || channelId,
      name: channel.header?.author?.name,
      handle: channel.header?.author?.handle?.text,
      avatar: channel.header?.author?.thumbnails,
      banner: channel.header?.banner?.thumbnails,
      subscribers: channel.header?.subscriber_count?.text,
      videos_count: channel.header?.videos_count?.text,
      bio: channel.metadata?.description,
      is_verified: channel.header?.author?.is_verified,
      
      // 追加した各タブのデータ
      latest_videos: videosData,
      latest_shorts: shortsData,
      playlists: playlistsData,
      community_posts: communityData
    };

    // 成功レスポンスを返す
    res.json({
      success: true,
      data: detailedInfo
    });

  } catch (error) {
    console.error(`Error fetching channel ${channelId}:`, error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comprehensive channel information',
      details: error.message
    });
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

// サーバーの起動処理
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
