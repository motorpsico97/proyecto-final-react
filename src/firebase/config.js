import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC4QFd8WO7CVd-05Zfa3Q4Eh5JFYqzMN40",
    authDomain: "shoes-store-d711b.firebaseapp.com",
    projectId: "shoes-store-d711b",
    storageBucket: "shoes-store-d711b.firebasestorage.app",
    messagingSenderId: "989577136811",
    appId: "1:989577136811:web:78d91bcc35b04527ee45ee"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);