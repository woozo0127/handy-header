import { describe, expect, it } from 'vitest'
import { badgeText } from './badge'

describe('badgeText', () => {
  it('에러가 있으면 ERR', () => {
    expect(badgeText({ enabled: true, ruleCount: 3, error: true })).toBe('ERR')
  })
  it('전역 OFF면 빈 배지', () => {
    expect(badgeText({ enabled: false, ruleCount: 3, error: false })).toBe('')
  })
  it('규칙 0개면 빈 배지', () => {
    expect(badgeText({ enabled: true, ruleCount: 0, error: false })).toBe('')
  })
  it('ON이고 규칙이 있으면 개수', () => {
    expect(badgeText({ enabled: true, ruleCount: 5, error: false })).toBe('5')
  })
})
