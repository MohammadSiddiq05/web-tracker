(function () {
  console.log("Analytics Script Loaded");

  function generateUUID() {
    return (
      Date.now().toString(36) + Math.random().toString(36).substring(2, 11)
    );
  }

  // =========================
  // SESSION MANAGEMENT
  // =========================

  const SESSION_DURATION = 50 * 60 * 1000; // 50 minutes
  const now = Date.now();

  let visitorId = localStorage.getItem("webtrack_visitor_id");
  let sessionTime = localStorage.getItem("webtrack_session_time");

  if (
    !visitorId ||
    !sessionTime ||
    now - Number(sessionTime) > SESSION_DURATION
  ) {
    localStorage.removeItem("webtrack_visitor_id");
    localStorage.removeItem("webtrack_session_time");

    visitorId = generateUUID();

    localStorage.setItem("webtrack_visitor_id", visitorId);

    localStorage.setItem("webtrack_session_time", String(now));

    console.log("New Session Created");
  } else {
    console.log("Existing Session");
  }

  // =========================
  // SCRIPT ATTRIBUTES
  // =========================

  const script = document.querySelector("script[data-website-id]");

  if (!script) {
    console.error("Tracking script tag not found");
    return;
  }

  const websiteId = script.getAttribute("data-website-id");

  const domain = script.getAttribute("data-domain");

  if (!websiteId || !domain) {
    console.error("Missing websiteId or domain");
    return;
  }

  // =========================
  // PAGE INFO
  // =========================

  const entryTime = Math.floor(Date.now() / 1000);

  const urlParams = new URLSearchParams(window.location.search);

  const refFromUrl = urlParams.get("ref") || urlParams.get("referrer") || "";

  const referrer = refFromUrl || document.referrer || "Direct";

  const utm_source = urlParams.get("utm_source") || "";

  const utm_medium = urlParams.get("utm_medium") || "";

  const utm_campaign = urlParams.get("utm_campaign") || "";

  const refParams = Object.fromEntries(urlParams.entries());

  // =========================
  // ENTRY TRACKING
  // =========================

  console.log("Sending Entry Request");

  fetch("https://web-tracker-smoky.vercel.app/api/track", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      type: "entry",
      websiteId,
      domain,
      entryTime,
      referrer,
      url: window.location.href,
      visitorId,
      utm_source,
      utm_medium,
      utm_campaign,
      refParams,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Entry Tracking Success:", data);
    })
    .catch((err) => {
      console.error("Entry Tracking Error:", err);
    });

  // =========================
  // ACTIVE TIME TRACKING
  // =========================

  let activeStartTime = Math.floor(Date.now() / 1000);

  let totalActiveTime = 0;

  const handleExit = () => {
    const exitTime = Math.floor(Date.now() / 1000);

    totalActiveTime += exitTime - activeStartTime;

    console.log("Sending Exit Request");

    fetch("https://web-tracker-smoky.vercel.app/api/track", {
      method: "POST",

      keepalive: true,

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        type: "exit",
        websiteId,
        domain,
        exitTime,
        totalActiveTime,
        visitorId,
        exitUrl: window.location.href,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Exit Tracking Success:", data);
      })
      .catch((err) => {
        console.error("Exit Tracking Error:", err);
      });
  };

  window.addEventListener("beforeunload", handleExit);

  const sendLivePing = async () => {
    try {
      const response = await fetch("https://web-tracker-smoky.vercel.app/api/live", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          visitorId,
          websiteId,
          last_seen: Date.now().toString(),
          url: window.location.href,
        }),
      });

      console.log(response);

      const data = await response.json();

      console.log("Live Ping Success:", data);
    } catch (error) {
      console.error("Live Ping Error:", error);
    }
  };

  // First Ping
  sendLivePing();

  // Ping Every 10 Seconds
  setInterval(sendLivePing, 10000);
})();
