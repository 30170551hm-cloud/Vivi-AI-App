// MOCK_firebase.mjs — MOCK explícito, NO el paquete real 'firebase'.
// Cubre únicamente 'firebase/app' y 'firebase/functions', que son los que
// alcanza la cadena real getVivi() → ViviCodeAnalyzer → githubProvider.js
// → firebase.js. No prueba que Firebase funcione de verdad.
export function initializeApp() { return { name: 'mock-app' }; }
export function getFunctions() { return { name: 'mock-functions' }; }
export function httpsCallable() {
  return async () => {
    throw new Error('Cloud Function unavailable in the test harness');
  };
}
export function getAuth() { return { currentUser: null }; }
export function setPersistence() { return Promise.resolve(); }
export const browserLocalPersistence = 'mock-persistence';
export function getFirestore() { return { name: 'mock-firestore' }; }
export function getStorage() { return { name: 'mock-storage' }; }
export function collection(db, name) { return { db, name }; }
export function doc(parent, collectionName, id = 'mock-id') {
  return { parent, collectionName, id };
}
export function addDoc() { return Promise.resolve({ id: 'mock-id' }); }
export function updateDoc() { return Promise.resolve(); }
export function deleteDoc() { return Promise.resolve(); }
export function getDocs() { return Promise.resolve({ docs: [] }); }
export function query(...constraints) { return { constraints }; }
export function where(...args) { return { type: 'where', args }; }
export function orderBy(...args) { return { type: 'orderBy', args }; }
export function limit(...args) { return { type: 'limit', args }; }
export function writeBatch() {
  return {
    delete() {},
    set() {},
    commit: () => Promise.resolve(),
  };
}
export function serverTimestamp() { return 'mock-timestamp'; }
export function ref(storage, path) { return { storage, path }; }
export function uploadBytes() { return Promise.resolve(); }
export function getDownloadURL() { return Promise.resolve('https://mock.invalid/file'); }
