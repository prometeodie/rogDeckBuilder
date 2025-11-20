import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon
} from '@ionic/angular/standalone';

import { Deck } from 'src/app/interfaces/deck.interface';

import { addIcons } from 'ionicons';
import {
  trashOutline,
  createOutline,
  downloadOutline
} from 'ionicons/icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'decks',
  standalone: true,
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
  imports: [
    CommonModule,
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    RouterModule
  ]
})
export class DecksComponent {

  decks: Deck[] = [
  { id: 1, name: 'Mazo 1', cardsNumber: 40, sdNumber: 15, cards: [], sd: [] },
  { id: 2, name: 'Mazo 2', cardsNumber: 50, sdNumber: 15, cards: [], sd: [] },
  { id: 3, name: 'Mazo 3', cardsNumber: 45, sdNumber: 10, cards: [], sd: [] },
  { id: 4, name: 'Mazo 4', cardsNumber: 60, sdNumber: 15, cards: [], sd: [] },
  { id: 5, name: 'Mazo 5', cardsNumber: 55, sdNumber: 12, cards: [], sd: [] },
  { id: 6, name: 'Mazo 6', cardsNumber: 43, sdNumber: 15, cards: [], sd: [] },
  { id: 7, name: 'Mazo 7', cardsNumber: 48, sdNumber: 15, cards: [], sd: [] },
  { id: 8, name: 'Mazo 8', cardsNumber: 50, sdNumber: 10, cards: [], sd: [] },
  { id: 9, name: 'Mazo 9', cardsNumber: 40, sdNumber: 15, cards: [], sd: [] },
  { id: 10, name: 'Mazo 10', cardsNumber: 52, sdNumber: 15, cards: [], sd: [] },
  { id: 11, name: 'Mazo 11', cardsNumber: 47, sdNumber: 12, cards: [], sd: [] },
  { id: 12, name: 'Mazo 12', cardsNumber: 44, sdNumber: 15, cards: [], sd: [] },
  { id: 13, name: 'Mazo 13', cardsNumber: 60, sdNumber: 15, cards: [], sd: [] },
  { id: 14, name: 'Mazo 14', cardsNumber: 49, sdNumber: 10, cards: [], sd: [] },
  { id: 15, name: 'Mazo 15', cardsNumber: 41, sdNumber: 15, cards: [], sd: [] }
];

  constructor() {
    addIcons({
      'trash-outline': trashOutline,
      'create-outline': createOutline,
      'download-outline': downloadOutline
    });
  }

  deleteDeck(id: number) {
    console.log('Eliminar mazo', id);
  }

  editDeck(id: number) {
    console.log('Editar mazo', id);
  }

  downloadDeck(id: number) {
    console.log('Descargar mazo', id);
  }
}
