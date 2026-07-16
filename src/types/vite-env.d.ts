/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE44_APP_ID?: string
  readonly VITE_BASE44_APP_BASE_URL?: string
  readonly VITE_BASE44_FUNCTIONS_VERSION?: string
  readonly VITE_GEMINI_API_KEY?: string
  readonly VITE_GEMINI_MODEL?: string
  readonly VITE_VIVI_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ViviRequestLogEntry {
  url?: string
  method?: string
  type?: string
  status?: number
  timestamp?: string | number
  error?: string
  [key: string]: unknown
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionResultList {
  readonly length: number
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onstart: ((this: SpeechRecognition, ev: Event) => unknown) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown) | null
  onend: ((this: SpeechRecognition, ev: Event) => unknown) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => unknown) | null
  start(): void
  stop(): void
  abort(): void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

interface Window {
  __viviRequestLogInstalled?: boolean
  __viviRequestLog?: ViviRequestLogEntry[]
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
  webkitAudioContext?: typeof AudioContext
}

declare module '@base44/sdk/dist/utils/axios-client' {
  export function createAxiosClient(config: {
    baseURL: string
    headers?: Record<string, string | null | undefined>
    token?: string | null
    interceptResponses?: boolean
  }): {
    get(path: string): Promise<unknown>
  }
}
