import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"
import { config } from "@/app/services/config"; 

// Create mock versions of Firebase services
const createMockFirebase = () => {
  const mockApp = {} 
  const mockDb = {} 
  const mockStorage = {} 
  const mockAuth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      // Immediately call with null user
      setTimeout(() => callback(null), 0)
      // Return unsubscribe function
      return () => {}
    },
  } 

  return { app: mockApp, db: mockDb, storage: mockStorage, auth: mockAuth }
}

// Only initialize Firebase if we're not using mock implementation
let app, db, storage, auth

if (config.useMockImplementation) {
  // Use mock Firebase services
  const mockServices = createMockFirebase()
  app = mockServices.app
  db = mockServices.db
  storage = mockServices.storage
  auth = mockServices.auth
} else {
  // Initialize real Firebase
  try {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, 
    }

    app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
    db = getFirestore(app)
    storage = getStorage(app)
    auth = getAuth(app)
    
    console.log("Firebase initialized successfully")


  } catch (error) {
    console.error("Firebase initialization error:", error)
    // Fallback to mock if Firebase initialization fails
    const mockServices = createMockFirebase()
    app = mockServices.app
    db = mockServices.db
    storage = mockServices.storage
    auth = mockServices.auth
  }
}

export { app, db, storage, auth }
