#!/bin/bash

# 테스트용 더미 패킷 전송 스크립트
# 실시간 대시보드 업데이트 확인용

echo "🚀 Tracking Viewer 테스트 시작..."
echo "백엔드: http://localhost:3001"
echo "대시보드: http://localhost:3000"
echo ""

# 백엔드 Health Check
echo "1. 백엔드 서버 확인..."
if curl -sf http://localhost:3001/health > /dev/null; then
  echo "✅ 백엔드 서버 정상"
else
  echo "❌ 백엔드 서버가 실행 중이지 않습니다."
  echo "   cd backend && npm run dev"
  exit 1
fi

echo ""
echo "2. 테스트 패킷 전송 시작 (10초 간격)..."
echo "   Ctrl+C로 중지"
echo ""

count=1

send_packet() {
  local type=$1
  local url=$2
  local event=$3

  timestamp=$(date -u +%Y-%m-%dT%H:%M:%S.000Z)

  echo "[$count] $type - $event"

  curl -s -X POST http://localhost:3001/api/packets \
    -H "Content-Type: application/json" \
    -d "{
      \"timestamp\": \"$timestamp\",
      \"url\": \"$url\",
      \"method\": \"POST\",
      \"tracking_type\": \"$type\",
      \"params\": {
        \"event\": \"$event\",
        \"test_id\": $count
      }
    }" | grep -q "id" && echo "  ✓ 전송 성공" || echo "  ✗ 전송 실패"

  ((count++))
}

# 테스트 패킷 무한 전송
while true; do
  send_packet "tiara" "https://track.tiara.kakao.com/event" "screen_view"
  sleep 3

  send_packet "ad_impression" "https://ad.kidsnote.com/imp?id=123" "banner_shown"
  sleep 3

  send_packet "ad_click" "https://ad.kidsnote.com/click?id=123" "banner_clicked"
  sleep 3

  send_packet "custom" "https://api.kidsnote.com/tracking/custom" "user_action"
  sleep 3

  echo ""
done
