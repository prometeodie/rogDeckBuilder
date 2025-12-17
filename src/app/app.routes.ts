import { DeckExportComponentComponent } from './components/deck-export-component/deck-export-component.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then(m => m.HomePage)
  },

  {
    path: 'deckbuilder',
    loadComponent: () =>
      import('./pages/deckbuilder/deckbuilder.page').then(m => m.DeckbuilderPage)
  },

  {
    path: 'deckbuilder/:id',
    loadComponent: () =>
      import('./pages/deckbuilder/deckbuilder.page').then(m => m.DeckbuilderPage)
  },

  {
    path: 'deckviewer/:id',
    loadComponent: () =>
      import('./pages/deck-viewer/deck-viewer.component').then(m => m.DeckViewerComponent)
  }
];
