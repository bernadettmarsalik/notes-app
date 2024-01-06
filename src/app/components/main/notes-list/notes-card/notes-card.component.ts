import { NoteService } from 'src/app/shared/note.service';
import { NotesListComponent } from './../notes-list.component';
import { Component, OnInit } from '@angular/core';
import { NoteModel } from 'src/app/shared/note.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notes-card',
  templateUrl: './notes-card.component.html',
  styleUrls: ['./notes-card.component.scss'],
})
export class NotesCardComponent implements OnInit {
  notes$: Observable<NoteModel[]> = new Observable();

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.notes$ = this.noteService.getNotes();
  }
}
