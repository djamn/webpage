import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  async incrementNumber(collectionName: string, docId: string, fieldName: string): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${docId}`);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const currentNumber = docSnapshot.data()[fieldName] || 0;
      await updateDoc(docRef, { [fieldName]: currentNumber + 1 });
    } else {
      await updateDoc(docRef, { [fieldName]: 1 });
    }
  }

  async registerUser(userId: string, email: string, username: string): Promise<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    await setDoc(userRef, { uid: userId, email, username });
  }

  getCollection(collectionName: string): Observable<any[]> {
    const collectionRef = collection(this.firestore, collectionName);
    return collectionData(collectionRef);
  }

  addDocument(collectionName: string, data: any): Promise<void> {
    const collectionRef = collection(this.firestore, collectionName);
    const docRef = doc(collectionRef);
    return setDoc(docRef, data);
  }

  updateDocument(collectionName: string, docId: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${docId}`);
    return updateDoc(docRef, data);
  }

  deleteDocument(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${docId}`);
    return deleteDoc(docRef);
  }
}
