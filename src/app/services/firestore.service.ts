import {Injectable} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(readonly firestore: AngularFirestore) {
  }

  async incrementNumber(collectionName: string, docId: string, counterValue: number): Promise<void> {
    const newCounterValue = counterValue + 1;
    console.log(newCounterValue)
    await this.firestore.collection(collectionName).doc(docId).update({
      counter: newCounterValue
    })
  }

  async getNumber(collectionName: string, docId: string, fieldName: string) {
    const docSnapshot = await firstValueFrom(this.firestore.collection(collectionName).doc(docId).get())

    if (docSnapshot && docSnapshot.exists) {
      const docData = docSnapshot.data()
      // @ts-ignore
      return docData ? docData[fieldName] || -1 : -1;
    }
    return -1;
  }

  // getCollection(collectionName: string): Observable<any[]> {
  //   const collectionRef = collection(this.firestore, collectionName);
  //   return collectionData(collectionRef);
  // }
}
