/**
 * 회사/팀 근무지 기준 위치 (GPS 없이 표시용)
 * label만 바꾸면 홈·목록 문구가 함께 바뀝니다.
 */
export const OFFICE_LOCATION = {
  label: '논현역',
  area: '논현·신사',
}

export function getLocationNearLabel() {
  return `${OFFICE_LOCATION.label} 근처`
}

export function getHomeHeroTitle() {
  return '오늘 뭐 먹지?'
}

export function getHomeHeroSubtitle() {
  return '오늘 점심 고민은\nLunchPicker에게 맡겨보세요.'
}

export function getHomeHeroLocationNote() {
  return `등록된 맛집 기준 · ${OFFICE_LOCATION.area}`
}

export function getRecentRestaurantsDesc() {
  return `${getLocationNearLabel()} 새로 추가된 맛집이에요`
}

export function getRestaurantsListDesc(count) {
  return `${getLocationNearLabel()} 맛집 ${count}곳`
}
