import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ParamMap } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
              this.updateNoteId = data.id;
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

  saveNote() {
    if (!this.noteForm.valid) {
      return;
    }
    const noteToSave = this.noteForm.value;
    console.log(noteToSave);
    this.subSaveNote = this.noteService.addNote(noteToSave).subscribe({
      next: (docRef) => {
        alert('Note saved!');
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('Done!');
        this.noteForm.reset();
        this.router.navigate(['']);
      },
    });
  }

  goBack() {
    this.router.navigate(['']);
  }
  onDelete(id?: string): void {
    if (id && confirm(`Do you want to delete note id: ${id}?`)) {
      this.noteService.deleteNote(id).subscribe({
        complete: () => {
          this.router.navigate(['notes']);
        },
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subSaveNote) {
      this.subSaveNote.unsubscribe();
    }
  }
}
