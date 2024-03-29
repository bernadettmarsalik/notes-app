import { NoteService } from 'src/app/shared/note.service';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NoteModel } from 'src/app/shared/note.model';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-notes-card',
  templateUrl: './notes-card.component.html',
  styleUrls: ['./notes-card.component.scss'],
})
export class NotesCardComponent implements OnInit, OnChanges {
  @Input() note?: NoteModel;
  notes$: Observable<NoteModel[]> = new Observable();
  filteredNotes$: Observable<NoteModel[]> = new Observable();
  public showAll: any = false;

  constructor(
    private noteService: NoteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.filteredNotes$ = this.noteService.getNotes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['note'] && changes['note'].currentValue) {
      this.showAll = false;
    }
  }

  onDelete(id?: string): void {
    if (id && confirm(`Do you wanna delete note id: ${id}?`)) {
      this.noteService.deleteNote(id).subscribe({
        complete: () => {
          this.noteService.getNotes().subscribe((notes) => {
            this.notes$ = of(notes);
            this.filteredNotes$ = of(notes);
          });
        },
      });
    }
  }

  onEdit(id?: string) {
    if (id) {
      this.router.navigate([id], { relativeTo: this.route });
    }
  }

  triggerReadMore() {
    this.showAll = !this.showAll;
  }
}
