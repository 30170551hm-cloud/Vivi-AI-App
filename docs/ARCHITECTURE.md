# Arquitectura de Vivi AI

## Visión General

Vivi AI es un asistente personal inteligente construido sobre una arquitectura modular completamente independiente de Base44, usando Firebase como backend y Vercel para despliegue.

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite 6 + Tailwind CSS |
| UI Components | shadcn/ui + Radix UI + lucide-react |
| Animaciones | framer-motion |
| Backend | Firebase (Auth, Firestore, Storage, Functions) |
| LLM | OpenAI / Gemini vía Cloud Functions |
| TTS | Cloud Functions + ElevenLabs fallback |
| Despliegue | Vercel (frontend) + Firebase (functions) |
| CI/CD | GitHub Actions |

## Capa de Abstracción Firebase

El archivo `src/lib/backendClient.js` es el núcleo de la independencia de Base44. Exporta un objeto `backend` que replica exactamente la API del SDK de Base44:

```
backend.auth.*           → Firebase Auth (loginViaEmailPassword, loginWithProvider, me, etc.)
backend.entities.*       → Firestore (list, filter, create, update, delete, bulkCreate)
backend.integrations.Core.* → Cloud Functions (InvokeLLM, UploadFile, GenerateSpeech, etc.)
```

### Bridge File

`src/api/base44Client.js` re-exporta `backend` como `base44`, permitiendo que cualquier import existente de `{ base44 } from '@/api/base44Client'` funcione sin cambios.

## Sistema Modular Vivi

### EventBus

Centro de comunicación entre módulos. Cada evento tiene un nombre constante en `src/vivi/events.js`.

```js
this.emit(EVENTS.VOICE_USER_SPEECH, text);
this.subscribe(EVENTS.CORE_REPLY, ({ text }) => { ... });
```

### ModuleBase

Todos los módulos heredan de `ModuleBase`:
- `init(registry)` — inicialización
- `destroy()` — limpieza
- `subscribe(event, handler)` — suscripción a eventos
- `emit(event, data)` — emisión de eventos
- `health()` — estado del módulo

### ModuleRegistry

Registro central que gestiona el ciclo de vida de todos los módulos:
- `register(module)` — registra un módulo
- `get(name)` — obtiene un módulo por nombre
- `initAll()` — inicializa todos los módulos
- `destroyAll()` — destruye todos los módulos

## Módulos Principales

| Módulo | Responsabilidad |
|---|---|
| ViviCore | Cerebro conversacional, routing de intents |
| ViviVoice | STT (Speech-to-Text) y TTS (Text-to-Speech) |
| ViviAvatar | Animación del avatar, lip sync |
| ViviMemory | Memoria persistente (Firestore) |
| ViviSettings | Preferencias de usuario |
| ViviVAD | Detección de actividad de voz (barge-in) |
| ViviFirebase | Conexión con Firestore |
| ViviLLMGateway | Gateway multi-proveedor LLM |
| ViviSecurity | Seguridad y permisos |
| ViviTOOR | Orquestador de herramientas |

## Flujo de Conversación

```
Usuario habla → ViviVoice (STT) → EventBus → ViviCore (procesa)
→ ViviCore (LLM vía backend.integrations) → EventBus → ViviVoice (TTS)
→ ViviAvatar (lip sync) → Usuario escucha
```

## Seguridad

- Firestore Rules en `firestore.rules` controlan acceso por `request.auth.uid`
- Cloud Functions verifican autenticación con `verifyIdToken`
- Secrets manejados vía Firebase Functions config (no en código)
- `.npmrc` con `min-release-age=7` para supply-chain security

## Escalabilidad

- Cada módulo es independiente — agregar nuevos no afecta existentes
- Cloud Functions escalan automáticamente
- Firestore escala automáticamente
- Vercel despliega automáticamente en cada push a `main`
