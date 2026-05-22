(function () {

    function generateUUID() {
        return (
            Date.now().toString(36) +
            Math.random().toString(36).substr(2, 9)
        );
    }

    const BASE_URL = document.currentScript.src.replace('/analytic.js', '')

    let visitorId =
        localStorage.getItem('webtrack-visitor_id');

    if (!visitorId) {
        visitorId = generateUUID();

        localStorage.setItem(
            'webtrack-visitor_id',
            visitorId
        );
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

    const entryTime = Date.now();

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
                visitorId,
                utm_source,
                utm_medium,
                utm_campaign,
                refParams
            })
        }
    );

    let activeStartTime =
        Date.now();

    let totalActiveTime = 0;

    const handleExit = () => {

        const exitTime = Date.now();

        totalActiveTime +=
            Date.now() - activeStartTime;

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
                    visitorId
                })
            }
        );
    };

    window.addEventListener(
        'beforeunload',
        handleExit
    );


})();