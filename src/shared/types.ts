export type HeaderDirection = 'request' | 'response'

export type HeaderRule = {
  id: string
  enabled: boolean
  direction: HeaderDirection
  name: string
  value: string
}

export type RedirectRule = {
  id: string
  enabled: boolean
  match: string   // 예: https://api.prod.example.com/*
  target: string  // 예: http://localhost:8080/*
}

export type Profile = {
  id: string
  name: string
  headerRules: HeaderRule[]
  redirectRules: RedirectRule[]
}

export type AppState = {
  version: 1
  globalEnabled: boolean
  activeProfileId: string
  profiles: Profile[]
}
