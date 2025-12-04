#!/usr/bin/env python3
"""
Proxyman Scripting: Kidsnote Tracking Filter

이 스크립트는 Proxyman에서 캡처한 패킷 중 트래킹 관련 요청만 필터링하고,
백엔드 서버로 전송합니다.

필터링 대상:
- Tiara (카카오 트래킹)
- 자체 광고 지표 (imp/click)
- 기타 커스텀 트래킹 URL
"""

import json
import requests
from datetime import datetime
from typing import Dict, Any, Optional


# 백엔드 API 엔드포인트
BACKEND_URL = "http://localhost:3001/api/packets"

# 필터링할 도메인/경로 패턴
TRACKING_PATTERNS = [
    # Tiara (카카오)
    "track.tiara.kakao.com",
    "pixel.tiara.kakao.com",

    # 자체 광고 지표 (실제 도메인으로 수정 필요)
    "/ad/imp",
    "/ad/click",
    "/tracking/impression",
    "/tracking/click",

    # Google Analytics (제거 예정이지만 일단 포함)
    "google-analytics.com",
    "analytics.google.com",
]


def should_capture(request: Dict[str, Any]) -> bool:
    """
    요청이 트래킹 패킷인지 확인

    Args:
        request: Proxyman request 객체

    Returns:
        bool: 캡처 대상이면 True
    """
    url = request.get("url", "")

    for pattern in TRACKING_PATTERNS:
        if pattern in url:
            return True

    return False


def parse_packet(request: Dict[str, Any], response: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    패킷 데이터를 파싱하여 구조화된 형태로 변환

    Args:
        request: Proxyman request 객체
        response: Proxyman response 객체 (optional)

    Returns:
        dict: 파싱된 패킷 데이터
    """
    url = request.get("url", "")
    method = request.get("method", "GET")
    headers = request.get("headers", {})
    body = request.get("body", "")

    # 트래킹 타입 식별
    tracking_type = identify_tracking_type(url)

    # 파라미터 파싱
    params = parse_parameters(url, body)

    packet = {
        "timestamp": datetime.now().isoformat(),
        "url": url,
        "method": method,
        "tracking_type": tracking_type,
        "headers": headers,
        "params": params,
        "raw_body": body,
    }

    # 응답 정보 추가 (있는 경우)
    if response:
        packet["response"] = {
            "status_code": response.get("statusCode", 0),
            "body": response.get("body", ""),
        }

    return packet


def identify_tracking_type(url: str) -> str:
    """
    URL을 기반으로 트래킹 타입 식별

    Args:
        url: 요청 URL

    Returns:
        str: 트래킹 타입 (tiara, ad_impression, ad_click, custom)
    """
    if "tiara.kakao.com" in url:
        return "tiara"
    elif "/ad/imp" in url or "/tracking/impression" in url:
        return "ad_impression"
    elif "/ad/click" in url or "/tracking/click" in url:
        return "ad_click"
    elif "google-analytics.com" in url or "analytics.google.com" in url:
        return "google_analytics"
    else:
        return "custom"


def parse_parameters(url: str, body: str) -> Dict[str, Any]:
    """
    URL 쿼리 파라미터와 body 파라미터 파싱

    Args:
        url: 요청 URL
        body: 요청 body

    Returns:
        dict: 파싱된 파라미터
    """
    params = {}

    # URL 쿼리 파라미터 파싱
    if "?" in url:
        query_string = url.split("?", 1)[1]
        for param in query_string.split("&"):
            if "=" in param:
                key, value = param.split("=", 1)
                params[key] = value

    # Body 파싱 (JSON 형식인 경우)
    if body:
        try:
            body_params = json.loads(body)
            params["body"] = body_params
        except json.JSONDecodeError:
            # JSON이 아닌 경우 그대로 저장
            params["body_raw"] = body

    return params


def send_to_backend(packet: Dict[str, Any]) -> bool:
    """
    파싱된 패킷을 백엔드 서버로 전송

    Args:
        packet: 파싱된 패킷 데이터

    Returns:
        bool: 전송 성공 여부
    """
    try:
        response = requests.post(
            BACKEND_URL,
            json=packet,
            timeout=5
        )
        return response.status_code == 200
    except Exception as e:
        print(f"Error sending packet to backend: {e}")
        return False


# Proxyman 스크립트 진입점
def onRequest(context, request):
    """
    Proxyman에서 요청을 캡처했을 때 호출되는 함수

    Args:
        context: Proxyman context
        request: 요청 객체
    """
    # 트래킹 패킷인지 확인
    if not should_capture(request):
        return

    # 패킷 파싱
    packet = parse_packet(request)

    # 백엔드로 전송
    success = send_to_backend(packet)

    if success:
        print(f"[✓] Captured: {packet['tracking_type']} - {packet['url']}")
    else:
        print(f"[✗] Failed to send: {packet['url']}")


def onResponse(context, request, response):
    """
    Proxyman에서 응답을 받았을 때 호출되는 함수

    Args:
        context: Proxyman context
        request: 요청 객체
        response: 응답 객체
    """
    # 트래킹 패킷인지 확인
    if not should_capture(request):
        return

    # 응답 정보 포함하여 패킷 파싱
    packet = parse_packet(request, response)

    # 백엔드로 전송
    success = send_to_backend(packet)

    if success:
        print(f"[✓] Captured (with response): {packet['tracking_type']} - {packet['url']}")
    else:
        print(f"[✗] Failed to send: {packet['url']}")


if __name__ == "__main__":
    # 스크립트 단독 실행 시 테스트
    print("Proxyman Tracking Filter Script")
    print("Patterns:", TRACKING_PATTERNS)
