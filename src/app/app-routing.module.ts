import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { NotesFormComponent } from './components/main/notes-form/notes-form.component';
import { NotesListComponent } from './components/main/notes-list/notes-list.component';
import { NotesCardComponent } from './components/main/notes-list/notes-card/notes-card.component';
import { NotesDetailsComponent } from './components/main/notes-list/notes-details/notes-details.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'notes-form',
        component: NotesFormComponent,
      },
      {
        path: '',
        component: NotesListComponent,
        children: [
          { path: 'notes-card', component: NotesCardComponent },
          { path: 'notes-details/:id', component: NotesDetailsComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
