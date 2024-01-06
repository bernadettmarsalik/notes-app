import { Component } from '@angular/core';
import { NoteService } from 'src/app/shared/note.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  public resetInProgress: boolean = false;

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {}

  public async resetDatabase(): Promise<void> {
    this.resetInProgress = true;
    await this.noteService.initializeDb();
    this.resetInProgress = false;
  }
}
