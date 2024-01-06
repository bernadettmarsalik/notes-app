import { NoteService } from 'src/app/shared/note.service';
import { Component, OnInit } from '@angular/core';
import { NoteModel } from 'src/app/shared/note.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notes-card',
  templateUrl: './notes-card.component.html',
  styleUrls: ['./notes-card.component.scss'],
})
export class NotesCardComponent implements OnInit {
  notes$: Observable<NoteModel[]> = new Observable();

  constructor(private noteService: NoteService, private router: Router) {}

  ngOnInit(): void {
    this.notes$ = this.noteService.getNotes();
  }

  onDelete(id: string): void {
    if (confirm(`Do you want to delete this note?`)) {
      this.noteService.deleteNote(id).subscribe({
        complete: () => {
          this.router.navigate(['notes-list']);
        },
      });
    }
  }
}
