const { RemixBrowser } = require("@remix-run/react");

const { startTransition, StrictMode } = require("react");

const { hydrateRoot } = require("react-dom/client");

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>
    );
  });
}

if (window.requestIdleCallback) {
  window.requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  window.setTimeout(hydrate, 1);
}

// if the browser supports SW (all modern browsers do it)
if ("serviceWorker" in navigator) {
  window.addEventListener(
    "load",
    () => {
      console.log("Service worker registered");
      // we will register it after the page complete the load
      navigator.serviceWorker.register("/sw.js");
    },
    function (err) {
      console.log("service worker failed", err);
    }
  );
} else {
  console.log("service worker not in navigator");
}