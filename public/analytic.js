(function () {

    function generateUUID() {
        return (
            Date.now().toString(36) +
            Math.random().toString(36).substr(2, 9)
        );
    }

    const BASE_URL = document.currentScript.src.replace('/analytic.js', '')


    const session_duration = 12 * 60 * 50 * 1000;
    const now = Date.now()
    let visitorId = localStorage.getItem('webtrack_visitor_id');
    let sessionTime = localStorage.getItem('webtrack_session_time');
    if (!visitorId || (now - sessionTime) > session_duration) {
        if (visitorId) {
            localStorage.removeItem('webtrack_visitor_id');
            localStorage.removeItem('webtrack session_time');
        }

        visitorId = generateUUID();
        localStorage.setItem('webtrack_visitor_id', visitorId)
        localStorage.setItem('webtrack_session_time', String(now))
    } else {
        console.log("Exisitng session")
    }


    const script =
        document.currentScript ||
        document.querySelector(
            'script[data-website-id]'
        );

    const websiteId =
        script.getAttribute('data-website-id');

    const domain =
        script.getAttribute('data-domain');

    const entryTime = Math.floor(Date.now() / 1000);

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const refFromUrl = urlParams.get('ref') || urlParams.get('referrer') || '';
    const referrer = refFromUrl || document.referrer || 'Direct';

    const utm_source =
        urlParams.get('utm_source') || '';

    const utm_medium =
        urlParams.get('utm_medium') || '';

    const utm_campaign =
        urlParams.get('utm_campaign') || '';

    const refParams =
        Object.fromEntries(
            urlParams.entries()
        );

    fetch(
        `${BASE_URL}/api/track`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json'
            },
            body: JSON.stringify({
                type: 'entry',
                websiteId,
                domain,
                entryTime,
                referrer,
                url: window.location.href,
                visitorId: visitorId,
                utm_source,
                utm_medium,
                utm_campaign,
                refParams
            })
        }
    );

    let activeStartTime =
        Math.floor(Date.now() / 1000)

    let totalActiveTime = 0;

    const handleExit = () => {

        const exitTime = Math.floor(Date.now() / 1000);

        totalActiveTime +=
            Math.floor(Date.now() / 1000) - activeStartTime;

        fetch(
            `${BASE_URL}/api/track`,
            {
                method: 'POST',
                keepalive: true,
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    type: 'exit',
                    websiteId,
                    domain,
                    exitTime,
                    totalActiveTime,
                    visitorId: visitorId,
                    exitUrl: window.location.href

                })
            }
        );
    };

    window.addEventListener(
        'beforeunload',
        handleExit
    );


    const sendLivePing = async () => {

        await fetch(
            "http://localhost:3000/api/live",
            {
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
            }
        );
    };

    setInterval(sendLivePing, 10000)

})();