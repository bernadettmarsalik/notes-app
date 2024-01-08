import { Injectable } from '@angular/core';
import { NoteModel } from './note.model';
import {
  DocumentData,
  Firestore,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  docData,
  getDoc,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, from, map, tap } from 'rxjs';
import { collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private readonly notesCollectionRef = collection(this.firestore, 'notes');

  constructor(private firestore: Firestore) {}

  // SAVE
  addNote(note: NoteModel): Observable<DocumentData> {
    return from(addDoc(this.notesCollectionRef, note));
  }

  // GET NOTES
  // getNotes(): Observable<NoteModel[]> {
  //   return from(getDocs(this.notesCollectionRef)).pipe(
  //     map((snapshot) => {
  //       const resultList = snapshot.docs.map((doc) => {
  //         const noteData: NoteModel = doc.data() as NoteModel;
  //         noteData.id = doc.id;
  //         return noteData;
  //       });
  //       return resultList;
  //     })
  //   );
  // }

  getNotes() {
    return collectionData(this.notesCollectionRef, {
      idField: 'id',
    }) as Observable<NoteModel[]>;
  }

  // GET ONE NOTE
  // getNote(id: string) {
  //   const noteDoc = doc(this.firestore, `notes/${id}`);
  //   return from(getDoc(noteDoc)).pipe(
  //     map((doc) => {
  //       const noteData: NoteModel = doc.data() as NoteModel;
  //       noteData.id = doc.id;
  //       return noteData;
  //     })
  //   );
  // }

  getNote(id: string): Observable<NoteModel> {
    const noteDoc = doc(this.firestore, `notes/${id}`);
    return docData(noteDoc, { idField: 'id' }) as Observable<NoteModel>;
  }

  // DELETE
  // deleteNote(noteId: string): Observable<void> {
  //   const noteDoc = doc(this.firestore, `notes/${noteId}`);
  //   return from(deleteDoc(noteDoc));
  // }

  deleteNote(noteId: string): Observable<void> {
    const noteDoc = doc(this.firestore, `notes/${noteId}`);
    return from(deleteDoc(noteDoc));
  }

  // EDIT
  editNote(note: NoteModel): Observable<void> {
    const noteDoc = doc(this.firestore, `notes/${note.id}`);
    return from(setDoc(noteDoc, note));
  }

  // SEARCH
  searchNotes(query: string): Observable<NoteModel[]> {
    const normalizedQuery = query.toLowerCase().trim();

    const terms: string[] = normalizedQuery.split(' ');

    return this.getNotes().pipe(
      map((notes) => {
        return notes.filter((note) => {
          return terms.some((term) => {
            return (
              (note.title && note.title.toLowerCase().includes(term)) ||
              (note.body && note.body.toLowerCase().includes(term))
            );
          });
        });
      })
    );
  }
}
