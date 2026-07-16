/**
 * Bridge file — re-exports the Firebase-backed backend as `base44`.
 * This allows all existing imports of `{ base44 } from '@/api/base44Client'`
 * to work without @base44/sdk, making the project fully portable.
 *
 * When running on Base44 (legacy), the real @base44/sdk is used instead.
 * When running standalone (GitHub/Vercel), the Firebase abstraction layer
 * in src/lib/backendClient is used.
 */

import { backend } from '@/lib/backendClient';

// Use Firebase abstraction layer (standalone mode)
export { backend as base44 } from '@/lib/backendClient';
export default { backend };
