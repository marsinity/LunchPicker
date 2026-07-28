/**
 * 외부 지도 링크 헬퍼
 * 식당 이름으로 네이버 지도 검색을 엽니다.
 */
export function getNaverMapSearchUrl(restaurant) {
  const query = [restaurant?.mapQuery, restaurant?.name].find(
    (value) => value?.trim(),
  )
  if (!query) return null
  return `https://map.naver.com/p/search/${encodeURIComponent(query.trim())}`
}

export function openNaverMap(restaurant) {
  const url = getNaverMapSearchUrl(restaurant)
  if (!url) return false

  window.open(url, '_blank', 'noopener,noreferrer')
  return true
}
