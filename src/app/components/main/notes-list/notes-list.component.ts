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
}
