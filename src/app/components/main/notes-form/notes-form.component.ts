import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ParamMap } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { NoteModel } from 'src/app/shared/note.model';
import { NoteService } from 'src/app/shared/note.service';

@Component({
  selector: 'app-notes-form',
  templateUrl: './notes-form.component.html',
  styleUrls: ['./notes-form.component.scss'],
})
export class NotesFormComponent implements OnInit, OnDestroy {
  noteForm!: FormGroup;
  subSaveNote?: Subscription;
  updateNoteId?: string;
  subDeleteNote?: Subscription;
  public note?: NoteModel;

  constructor(
    private noteService: NoteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.noteForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      body: new FormControl('', [Validators.required, Validators.minLength(2)]),
      status: new FormControl(''),
    });

    // UPDATE:
    this.route.paramMap.subscribe({
      next: (params: ParamMap) => {
        let noteId = params.get('id');
        if (noteId) {
          this.noteService.getNote(noteId).subscribe({
            next: (data) => {
              this.noteForm.patchValue(data);
              this.updateNoteId = data?.id;
            },
            error: (e) => {
              console.log(e);
            },
          });
        }
      },
    });
  }

  get title() {
    return this.noteForm.get('title');
  }
  get body() {
    return this.noteForm.get('body');
  }
  get status() {
    return this.noteForm.get('status');
  }

  get id() {
    return this.noteForm.get('id');
  }

  saveNote() {
    if (!this.noteForm.invalid) {
      const noteToSave = this.noteForm.value;

      if (this.updateNoteId) {
        noteToSave.id = this.updateNoteId;
        this.noteService.editNote(noteToSave).subscribe({
          complete: () => {
            this.router.navigate(['']);
          },
        });
      } else {
        this.subSaveNote = this.noteService.addNote(noteToSave).subscribe({
          next: (docRef) => {
            console.log('Saving note...');
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            console.log('Note saved complete!');
            this.noteForm.reset();
            this.goBack();
          },
        });
      }
    }
  }

  goBack() {
    this.router.navigate(['']);
  }

  onDelete(id?: string): void {
    if (id && confirm(`Do you wanna delete note id: ${id}?`)) {
      this.noteService
        .getNote(id)
        .pipe(
          switchMap((data) => {
            this.noteForm.patchValue(data);
            this.updateNoteId = data?.id;
            return this.noteService.deleteNote(data?.id);
          })
        )
        .subscribe({
          next: () => {
            console.log(
              `Deleting note with id ${id} then redirecting to notes...`
            );
          },

          error: (e) => {
            console.log(e);
          },
          complete: () => {
            this.goBack();
          },
        });
    }
  }

  ngOnDestroy(): void {
    if (this.subSaveNote) {
      this.subSaveNote.unsubscribe();
    }

    if (this.subDeleteNote) {
      this.subDeleteNote.unsubscribe();
    }
  }
}
