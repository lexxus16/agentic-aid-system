// This file is intended for Firebase Admin SDK initialization for server-side operations.
// In a real Firebase project, you would configure this with your service account.
// For Firebase App Hosting, service account credentials might be automatically available.

// import admin from 'firebase-admin';
// import { ServiceAccount } from 'firebase-admin';

// const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

// if (!admin.apps.length) {
//   if (serviceAccountKey) {
//     try {
//       const parsedServiceAccount: ServiceAccount = JSON.parse(serviceAccountKey);
//       admin.initializeApp({
//         credential: admin.credential.cert(parsedServiceAccount),
//         // databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com` // Optional
//       });
//     } catch (error) {
//       console.error("Error parsing Firebase service account key:", error);
//     }
//   } else {
//     // Initialize without explicit credentials, relying on GOOGLE_APPLICATION_CREDENTIALS or App Hosting environment
//     admin.initializeApp();
//   }
// }

// export const db = admin.firestore();

// MOCK Firestore implementation for MVP as actual firebase-admin setup is complex for this context.
// Replace this with actual Firebase Admin SDK integration.

interface MockDocumentReference {
  id: string;
  update: (data: Partial<any>) => Promise<void>;
  delete: () => Promise<void>;
  get: () => Promise<MockDocumentSnapshot>;
}

interface MockDocumentSnapshot {
  exists: boolean;
  data: () => any | undefined;
  id: string;
}

interface MockCollectionReference {
  doc: (id?: string) => MockDocumentReference;
  add: (data: any) => Promise<MockDocumentReference>;
  get: () => Promise<MockQuerySnapshot>;
  orderBy: (field: string, direction?: 'asc' | 'desc') => MockCollectionReference; // Added orderBy
}

interface MockQuerySnapshot {
  empty: boolean;
  docs: MockDocumentSnapshot[];
}

const mockFirestoreData: { [collection: string]: { [id: string]: any } } = {
  incidents: {},
};

let idCounter = 0;

const generateId = () => `mock_${Date.now()}_${idCounter++}`;

export const db = {
  collection: (collectionPath: string): MockCollectionReference => {
    if (!mockFirestoreData[collectionPath]) {
      mockFirestoreData[collectionPath] = {};
    }
    return {
      doc: (id?: string): MockDocumentReference => {
        const docId = id || generateId();
        return {
          id: docId,
          update: async (data: Partial<any>) => {
            if (mockFirestoreData[collectionPath][docId]) {
              mockFirestoreData[collectionPath][docId] = { ...mockFirestoreData[collectionPath][docId], ...data };
            } else {
              // Handle case where doc doesn't exist? Firestore update typically fails.
            }
          },
          delete: async () => {
            delete mockFirestoreData[collectionPath][docId];
          },
          get: async (): Promise<MockDocumentSnapshot> => {
            const docData = mockFirestoreData[collectionPath][docId];
            return {
              exists: !!docData,
              data: () => docData,
              id: docId,
            };
          },
        };
      },
      add: async (data: any): Promise<MockDocumentReference> => {
        const newId = generateId();
        mockFirestoreData[collectionPath][newId] = { ...data, id: newId };
        return {
          id: newId,
          update: async (updateData: Partial<any>) => {
             mockFirestoreData[collectionPath][newId] = { ...mockFirestoreData[collectionPath][newId], ...updateData };
          },
          delete: async () => {
            delete mockFirestoreData[collectionPath][newId];
          },
          get: async (): Promise<MockDocumentSnapshot> => ({
            exists: true,
            data: () => mockFirestoreData[collectionPath][newId],
            id: newId
          }),
        };
      },
      get: async (): Promise<MockQuerySnapshot> => {
        const docs = Object.entries(mockFirestoreData[collectionPath]).map(([id, data]) => ({
          id,
          exists: true,
          data: () => data,
        }));
        return {
          empty: docs.length === 0,
          docs,
        };
      },
      orderBy: (field: string, direction: 'asc' | 'desc' = 'asc'): MockCollectionReference => {
        // Mock orderBy - for simplicity, it returns the same collection reference.
        // Actual sorting would be more complex to mock.
        // For 'extractedAt desc', we'll sort in the server action itself.
        return db.collection(collectionPath);
      }
    };
  },
};

// End of Mock Firestore
