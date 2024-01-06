import { Injectable } from '@angular/core';
import { NoteModel } from './note.model';
import { data } from './notes';
import {
  DocumentData,
  Firestore,
  addDoc,
  collection,
  doc,
  getDocs,
  writeBatch,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private readonly notesCollectionRef = collection(this.firestore, 'notes');

  constructor(private firestore: Firestore) {}

  // //*Drop, intitialize, and upload firebase db
  public async initializeDb(): Promise<void> {
    await this.dropCollection('notes');
    await this.uploadCollection('notes', data);
  }

  private async dropCollection(collectionName: string): Promise<void> {
    console.log(`Dropping collection ${collectionName}`);

    const c = collection(this.firestore, collectionName);
    const snapshot = await getDocs(c);

    const batch = writeBatch(this.firestore);
    for (let doc of snapshot.docs) {
      batch.delete(doc.ref);
    }
    await batch.commit();

    console.log(`Done!`);
  }

  private async uploadCollection(collectionName: string, data: NoteModel[]) {
    console.log(`Uploading collection ${collectionName}`);

    const collectionRef = collection(this.firestore, collectionName);
    const batch = writeBatch(this.firestore);
    data.forEach((data) => {
      const ref = doc(collectionRef);
      batch.set(ref, data);
    });
    await batch.commit();

    console.log(`Done!`);
  }

  // SAVE
  addNote(note: NoteModel): Observable<DocumentData> {
    return from(addDoc(this.notesCollectionRef, note));
  }

  // GETCARS
  getNotes(): Observable<NoteModel[]> {
    return from(getDocs(this.notesCollectionRef)).pipe(
      map((snapshot) => {
        const resultList = snapshot.docs.map((doc) => {
          const noteData: NoteModel = doc.data() as NoteModel;
          noteData.id = doc.id;
          return noteData;
        });
        return resultList;
      })
    );
  }
}