import { NoteService } from 'src/app/shared/note.service';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NoteModel } from 'src/app/shared/note.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TruncatePipe } from 'src/app/shared/truncate.pipe';

@Component({
  selector: 'app-notes-card',
  templateUrl: './notes-card.component.html',
  styleUrls: ['./notes-card.component.scss'],
})
export class NotesCardComponent implements OnInit, OnChanges {
  @Input() note?: NoteModel;
  @Input() filteredNotes: NoteModel[] = [];
  notes$: Observable<NoteModel[]> = new Observable();
  public showAll: any = false;

  constructor(
    private noteService: NoteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.notes$ = this.noteService.getNotes();
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
          this.notes$ = this.noteService.getNotes();
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
