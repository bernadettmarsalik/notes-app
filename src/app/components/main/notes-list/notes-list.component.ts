import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NoteModel } from 'src/app/shared/note.model';
import { NoteService } from 'src/app/shared/note.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
})
export class NotesListComponent implements OnInit {
  constructor(private noteService: NoteService) {}

  notes$: Observable<NoteModel[]> = new Observable();
  filteredNotes$: Observable<NoteModel[]> = new Observable();

  ngOnInit(): void {
    this.loadNotes();
  }

  public loadNotes() {
    this.noteService.getNotes().subscribe((notes) => {
      this.notes$ = of(notes);
      this.filteredNotes$ = of(notes);
    });
  }

  // SEARCH BAR
  filter(query: string) {
    this.noteService.searchNotes(query).subscribe((filteredNotes) => {
      this.filteredNotes$ = of(filteredNotes);
    });
  }

  // DELETE NOTE AND UPDATE LIST
  onDelete(id?: string): void {
    if (id && confirm(`Do you want to delete note id: ${id}?`)) {
      this.noteService.deleteNote(id).subscribe({
        next: () => {
          this.loadNotes();
        },
        complete: () => {
          this.loadNotes();
        },
        error: (e) => {
          console.log(e);
        },
      });
    }
  }
}
