import { appParams } from "../lib/app-params";

const { appId } = appParams;

/**
 * @typedef {{
 *   id?: string;
 *   title?: string;
 *   role?: string;
 *   content?: string;
 *   file_url?: string | null;
 *   file_name?: string | null;
 *   conversation_id?: string;
 *   status?: string;
 *   founder_notes?: string;
 *   display_name?: string;
 *   preferred_language?: string;
 *   voice_enabled?: boolean;
 *   [key: string]: unknown;
 * }} Base44Record
 */

/**
 * @typedef {{
 *   list(sort?: string, limit?: number): Promise<Base44Record[]>;
 *   filter(query?: Record<string, unknown>, sort?: string, limit?: number): Promise<Base44Record[]>;
 *   create(data?: Record<string, unknown>): Promise<Base44Record>;
 *   update(id: string, patch?: Record<string, unknown>): Promise<Base44Record>;
 *   delete(id: string): Promise<{ id: string } | null>;
 *   deleteMany(query?: Record<string, unknown>): Promise<{ deleted?: number } | null>;
 *   bulkCreate(records: Record<string, unknown>[]): Promise<Base44Record[]>;
 * }} Base44EntityApi
 */

/**
 * @typedef {{
 *   InvokeLLM(params?: Record<string, unknown>): Promise<unknown>;
 *   UploadFile(params?: { file?: File | Blob | null } & Record<string, unknown>): Promise<{ file_url?: string | null }>;
 *   GenerateImage(params?: { prompt?: string } & Record<string, unknown>): Promise<{ url?: string | null }>;
 *   GenerateSpeech(params?: Record<string, unknown>): Promise<{ url?: string | null; audio_url?: string | null; mime_type?: string | null }>;
 *   ExtractDataFromUploadedFile(params?: Record<string, unknown>): Promise<Record<string, unknown> | null>;
 * }} Base44CoreIntegrationApi
 */

/**
 * @typedef {{
 *   me(): Promise<Base44Record | null>;
 *   updateMe(patch?: Record<string, unknown>): Promise<Base44Record | null>;
 *   loginViaEmailPassword(email: string, password: string): Promise<unknown>;
 *   register(data?: Record<string, unknown>): Promise<unknown>;
 *   verifyOtp(data?: Record<string, unknown>): Promise<unknown>;
 *   resendOtp(email: string): Promise<unknown>;
 *   setToken(token: string): Promise<unknown>;
 *   loginWithProvider(provider: string, redirectPath?: string): Promise<unknown>;
 *   resetPasswordRequest(email: string): Promise<unknown>;
 *   resetPassword(data?: Record<string, unknown>): Promise<unknown>;
 *   logout(redirectUrl?: string): Promise<unknown>;
 *   redirectToLogin(returnUrl?: string): Promise<unknown>;
 * }} Base44AuthApi
 */

/**
 * @typedef {{
 *   auth: Base44AuthApi;
 *   entities: Record<string, Base44EntityApi>;
 *   integrations: {
 *     Core: Base44CoreIntegrationApi;
 *     [key: string]: Base44CoreIntegrationApi;
 *   };
 * }} Base44Client
 */

function createStub() {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        return (...args) => {
          console.warn(
            `[Base44 deshabilitado] Se intentó usar "${String(
              prop
            )}" pero Base44 está desactivado.`,
            args
          );
          return Promise.resolve(null);
        };
      },
    }
  );
}

/**
 * @returns {Base44AuthApi}
 */
function createAuthStub() {
  return /** @type {Base44AuthApi} */ (new Proxy(
    {},
    {
      get(_target, prop) {
        return (...args) => {
          console.warn(
            `[Base44 deshabilitado] Se intentó usar "auth.${String(prop)}" pero Base44 está desactivado.`,
            args
          );
          return Promise.resolve(null);
        };
      },
    }
  ));
}

/**
 * @returns {Record<string, Base44EntityApi>}
 */
function createEntitiesStub() {
  return new Proxy(
    {},
    {
      get(_target, entityName) {
        return /** @type {Base44EntityApi} */ (new Proxy(
          {},
          {
            get(_entityTarget, methodName) {
              return (...args) => {
                console.warn(
                  `[Base44 deshabilitado] Se intentó usar "entities.${String(entityName)}.${String(methodName)}" pero Base44 está desactivado.`,
                  args
                );

                if (methodName === 'list' || methodName === 'filter' || methodName === 'bulkCreate') {
                  return Promise.resolve([]);
                }

                if (methodName === 'delete' || methodName === 'deleteMany') {
                  return Promise.resolve(null);
                }

                return Promise.resolve({});
              };
            },
          }
        ));
      },
    }
  );
}

/**
 * @returns {Base44CoreIntegrationApi}
 */
function createCoreIntegrationStub() {
  return /** @type {Base44CoreIntegrationApi} */ (new Proxy(
    {},
    {
      get(_target, prop) {
        return (...args) => {
          console.warn(
            `[Base44 deshabilitado] Se intentó usar "integrations.Core.${String(prop)}" pero Base44 está desactivado.`,
            args
          );

          if (prop === 'UploadFile') return Promise.resolve({ file_url: null });
          if (prop === 'GenerateImage') return Promise.resolve({ url: null });
          if (prop === 'GenerateSpeech') return Promise.resolve({ url: null, audio_url: null, mime_type: null });
          return Promise.resolve(null);
        };
      },
    }
  ));
}

if (!appId) {
  console.warn(
    "[Base44] No hay VITE_BASE44_APP_ID configurado. Vivi funcionará usando Firebase."
  );
}

/** @type {Base44Client} */
export const base44 = {
  auth: createAuthStub(),
  entities: createEntitiesStub(),
  integrations: {
    Core: createCoreIntegrationStub(),
  },
};
