import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
  downloadOutline,
  eyeOutline
} from 'ionicons/icons';
import { Router, RouterModule } from '@angular/router';
import { DecksCardsService } from 'src/app/services/decks-cards';

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

  @Input() decks: Deck[] = [];
  @Output() deckDeleted = new EventEmitter<void>();

  private deckService = inject(DecksCardsService);
  private router = inject(Router);

  constructor() {
    addIcons({
      'trash-outline': trashOutline,
      'create-outline': createOutline,
      'download-outline': downloadOutline,
      'eye-outline': eyeOutline
    });
  }

async deleteDeck(id: string) {
  const shouldDelete = confirm('¿Seguro que querés borrar este mazo?');
  if (!shouldDelete) return;

  await this.deckService.deleteDeck(id);

  this.deckDeleted.emit();
}



  downloadDeck(id: string) {
    console.log('Descargar mazo', id);
  }
}
