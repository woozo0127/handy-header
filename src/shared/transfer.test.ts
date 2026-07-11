import { describe, expect, it } from 'vitest'
import type { Profile } from './types'
import { parseProfileFile, serializeProfile, uniqueProfileName } from './transfer'

function sampleProfile(): Profile {
  return {
    id: 'profile-1',
    name: 'Staging',
    headerRules: [
      { id: 'h-1', enabled: true, direction: 'request', name: 'X-Foo', value: 'bar' },
      { id: 'h-2', enabled: false, direction: 'response', name: 'X-Baz', value: 'qux' },
    ],
    redirectRules: [
      { id: 'r-1', enabled: true, match: 'https://api.example.com/*', target: 'http://localhost:8080/*' },
    ],
  }
}

describe('serializeProfile', () => {
  it('type/version을 포함하고 id는 제외하고 직렬화한다', () => {
    const parsed = JSON.parse(serializeProfile(sampleProfile()))
    expect(parsed.type).toBe('handy-header-profile')
    expect(parsed.version).toBe(1)
    expect(parsed.profile.name).toBe('Staging')
    expect(parsed.profile.headerRules).toEqual([
      { enabled: true, direction: 'request', name: 'X-Foo', value: 'bar' },
      { enabled: false, direction: 'response', name: 'X-Baz', value: 'qux' },
    ])
    expect(parsed.profile.redirectRules).toEqual([
      { enabled: true, match: 'https://api.example.com/*', target: 'http://localhost:8080/*' },
    ])
  })
})

describe('parseProfileFile', () => {
  it('serialize한 파일을 다시 읽으면 이름과 규칙 내용이 보존된다', () => {
    const restored = parseProfileFile(serializeProfile(sampleProfile()))
    expect(restored.name).toBe('Staging')
    expect(restored.headerRules.map(({ id: _id, ...rule }) => rule)).toEqual([
      { enabled: true, direction: 'request', name: 'X-Foo', value: 'bar' },
      { enabled: false, direction: 'response', name: 'X-Baz', value: 'qux' },
    ])
    expect(restored.redirectRules.map(({ id: _id, ...rule }) => rule)).toEqual([
      { enabled: true, match: 'https://api.example.com/*', target: 'http://localhost:8080/*' },
    ])
  })

  it('프로필과 모든 규칙에 새 id를 부여한다', () => {
    const text = serializeProfile(sampleProfile())
    const first = parseProfileFile(text)
    const second = parseProfileFile(text)
    expect(first.id).not.toBe(second.id)
    expect(first.headerRules[0].id).not.toBe(second.headerRules[0].id)
    expect(first.redirectRules[0].id).not.toBe(second.redirectRules[0].id)
    expect(first.id).toBeTruthy()
  })

  it('파일에 있는 알 수 없는 필드는 규칙에 복사하지 않는다', () => {
    const data = JSON.parse(serializeProfile(sampleProfile()))
    data.profile.headerRules[0].evil = 'x'
    const restored = parseProfileFile(JSON.stringify(data))
    expect(restored.headerRules[0]).not.toHaveProperty('evil')
  })

  it('빈 이름은 Imported profile로 대체한다', () => {
    const data = JSON.parse(serializeProfile(sampleProfile()))
    data.profile.name = '  '
    expect(parseProfileFile(JSON.stringify(data)).name).toBe('Imported profile')
  })

  it('JSON이 아니면 Invalid JSON file 에러를 던진다', () => {
    expect(() => parseProfileFile('not json')).toThrow('Invalid JSON file')
  })

  it('type이 다르면 Not a HandyHeader profile file 에러를 던진다', () => {
    expect(() => parseProfileFile(JSON.stringify({ type: 'other', version: 1 }))).toThrow(
      'Not a HandyHeader profile file',
    )
    expect(() => parseProfileFile(JSON.stringify(['array']))).toThrow('Not a HandyHeader profile file')
  })

  it('version이 다르면 Unsupported file version 에러를 던진다', () => {
    const data = JSON.parse(serializeProfile(sampleProfile()))
    data.version = 2
    expect(() => parseProfileFile(JSON.stringify(data))).toThrow('Unsupported file version')
  })

  it('규칙 필드 형식이 잘못되면 Malformed profile data 에러를 던진다', () => {
    const base = () => JSON.parse(serializeProfile(sampleProfile()))

    const noProfile = base()
    delete noProfile.profile
    expect(() => parseProfileFile(JSON.stringify(noProfile))).toThrow('Malformed profile data')

    const badDirection = base()
    badDirection.profile.headerRules[0].direction = 'both'
    expect(() => parseProfileFile(JSON.stringify(badDirection))).toThrow('Malformed profile data')

    const missingValue = base()
    delete missingValue.profile.headerRules[0].value
    expect(() => parseProfileFile(JSON.stringify(missingValue))).toThrow('Malformed profile data')

    const notArray = base()
    notArray.profile.redirectRules = 'nope'
    expect(() => parseProfileFile(JSON.stringify(notArray))).toThrow('Malformed profile data')
  })
})

describe('uniqueProfileName', () => {
  it('충돌이 없으면 이름을 그대로 반환한다', () => {
    expect(uniqueProfileName('Staging', ['Profile 1'])).toBe('Staging')
  })

  it('충돌하면 (2) 접미사를 붙인다', () => {
    expect(uniqueProfileName('Staging', ['Staging'])).toBe('Staging (2)')
  })

  it('접미사 붙은 이름도 이미 있으면 숫자를 증가시킨다', () => {
    expect(uniqueProfileName('Staging', ['Staging', 'Staging (2)', 'Staging (3)'])).toBe('Staging (4)')
  })
})
