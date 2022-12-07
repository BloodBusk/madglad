const Start_URL = "/";
const Cache_Version = "v1";

self.addEventListener("install", (event) => {
  event.waitUntil(addResourceToCache([Start_URL]));
});

//activate is usually used to do stuff in the new version as to not disturb the older version
self.addEventListener("activate", (event) => {
  //starts downloading resources as soon as the fetch request is made
  event.waitUntil(enableNavigationPreload());
  event.waitUntil(deleteOldCaches());
});

self.addEventListener("fetch", (event) => {
  // We only want to handle GET requests
  if (event.request.method !== "GET") {
    return;
  }

  if (!(event.request.url.indexOf("http") === 0)) {
    return;
  }
  // event.respondWith(
  //   cacheFirst({
  //     request: event.request,
  //     preloadResponsePromise: event.preloadResponse,
  //     fallbackUrl: Start_URL,
  //   })
  // );

  event.respondWith(
    networkFirst({
      request: event.request,
    })
  );
});

const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};

const addResourceToCache = async (resources) => {
  const cache = await caches.open(Cache_Version);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  console.log("Put in cache");
  const cache = await caches.open(Cache_Version);
  await cache.put(request, response);
};

const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = [Cache_Version];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  //get resources from cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }
  //try and use and cache the preloaded response, this is used to ensure download starts immediately on navigation to a page.
  //sometimes it can delay and can result in errors and this ensures that it doesnt.
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info("using preload response", preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  //get resources from network
  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    //fallback response
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

const networkFirst = async ({
  request,
  preloadResponsePromise,
  fallbackUrl,
}) => {
  //get resources from network
  try {
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    //get resources from cache
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};