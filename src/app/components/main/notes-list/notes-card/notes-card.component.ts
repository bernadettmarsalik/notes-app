import { NoteService } from 'src/app/shared/note.service';
import { Component, Input, OnInit } from '@angular/core';
import { NoteModel } from 'src/app/shared/note.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-notes-card',
  templateUrl: './notes-card.component.html',
  styleUrls: ['./notes-card.component.scss'],
})
export class NotesCardComponent implements OnInit {
  @Input() note?: NoteModel;
  notes$: Observable<NoteModel[]> = new Observable();

  constructor(
    private noteService: NoteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.notes$ = this.noteService.getNotes();
  }

  onDelete(id?: string): void {
    if (id && confirm(`Do you wanna delete note id: ${id}?`)) {
      this.noteService.deleteNote(id).subscribe({
        complete: () => {
          this.router.navigate(['notes']);
        },
      });
    }
  }

  onEdit(id?: string) {
    if (id) {
      this.router.navigate(['edit', id], { relativeTo: this.route });
    }
  }
}
