import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NoteService } from 'src/app/shared/note.service';

@Component({
  selector: 'app-notes-form',
  templateUrl: './notes-form.component.html',
  styleUrls: ['./notes-form.component.scss'],
})
export class NotesFormComponent {
  noteForm!: FormGroup;
  subSaveNote?: Subscription;

  constructor(private noteService: NoteService, private router: Router) {}

  ngOnInit(): void {
    this.noteForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      body: new FormControl('', [Validators.required, Validators.minLength(2)]),
      status: new FormControl('', [Validators.required]),
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

  ngOnDestroy(): void {
    if (this.subSaveNote) {
      this.subSaveNote.unsubscribe();
    }
  }
}
