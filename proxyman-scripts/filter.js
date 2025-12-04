/**
 * Proxyman Scripting Tool: Kidsnote Tracking Filter
 *
 * 트래킹 패킷을 필터링하고 백엔드 서버로 전송
 */

// 백엔드 API 엔드포인트
const BACKEND_URL = "http://localhost:3001/api/packets";

// 필터링할 도메인/경로 패턴
const TRACKING_PATTERNS = [
    // Tiara (카카오)
    "stat.tiara.daum.net",
    "tr.ad.daum.net",

    // 자체 광고 지표
    "/imp?cpid",
    "/kidsnote_benefit/*/click?",

    // Google Analytics
    "google-analytics.com",
    "analytics.google.com",
];

/**
 * 요청이 트래킹 패킷인지 확인
 */
function shouldCapture(url) {
    for (const pattern of TRACKING_PATTERNS) {
        if (url.includes(pattern)) {
            return true;
        }
    }
    return false;
}

/**
 * 트래킹 타입 식별
 */
function identifyTrackingType(url) {
    if (url.includes("tiara.daum.net") || url.includes("tr.ad.daum.net")) {
        return "tiara";
    } else if (url.includes("/imp?cpid")) {
        return "ad_impression";
    } else if (url.includes("click?")) {
        return "ad_click";
    } else if (url.includes("google-analytics.com") || url.includes("analytics.google.com")) {
        return "google_analytics";
    } else {
        return "custom";
    }
}

/**
 * URL에서 파라미터 추출
 */
function parseParameters(url) {
    const params = {};
    try {
        const urlObj = new URL(url);
        urlObj.searchParams.forEach((value, key) => {
            params[key] = value;
        });
    } catch (e) {
        console.log("Failed to parse URL:", e);
    }
    return params;
}

/**
 * 패킷 데이터를 백엔드로 전송
 */
async function sendToBackend(packet) {
    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(packet),
        });

        if (response.ok) {
            console.log(`[✓] Sent to backend: ${packet.tracking_type} - ${packet.url}`);
            return true;
        } else {
            console.log(`[✗] Failed to send: ${response.status}`);
            return false;
        }
    } catch (error) {
        console.log(`[✗] Error sending to backend: ${error.message}`);
        return false;
    }
}

/**
 * Proxyman onRequest 함수
 * 요청이 발생할 때 호출됨
 */
async function onRequest(context, url, request) {
    // 트래킹 패킷인지 확인
    if (!shouldCapture(url)) {
        return request;
    }

    // 패킷 데이터 구성
    const packet = {
        timestamp: new Date().toISOString(),
        url: url,
        method: request.method || "GET",
        tracking_type: identifyTrackingType(url),
        headers: request.headers || {},
        params: parseParameters(url),
        raw_body: request.body || "",
    };

    // 백엔드로 전송
    await sendToBackend(packet);

    // 원본 요청 그대로 반환 (수정하지 않음)
    return request;
}

/**
 * Proxyman onResponse 함수
 * 응답을 받았을 때 호출됨
 */
async function onResponse(context, url, request, response) {
    // onRequest에서 이미 처리했으므로 응답은 그대로 반환
    return response;
}
