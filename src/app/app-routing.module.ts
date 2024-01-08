import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { NotesFormComponent } from './components/main/notes-form/notes-form.component';
import { NotesListComponent } from './components/main/notes-list/notes-list.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: NotesListComponent },
      { path: 'new', component: NotesFormComponent },
      { path: ':id', component: NotesFormComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
