import { Injectable } from '@angular/core';
import {collection, collectionData, deleteDoc, doc, Firestore, setDoc, updateDoc} from "@angular/fire/firestore";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(private firestore: Firestore) { }

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
