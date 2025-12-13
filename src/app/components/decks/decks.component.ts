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
  eyeOutline,
} from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { DecksCardsService } from 'src/app/services/decks-cards';
import { ExportDeckImageService } from 'src/app/services/export-deck-image-service';
import { Card } from 'src/app/interfaces/card.interface';
import { testCards } from 'src/app/cards-testing';
import { NavController } from '@ionic/angular';

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
  private exportDeckImage = inject(ExportDeckImageService);
  private nav:NavController  = inject(NavController);

  constructor() {
    addIcons({
      'trash-outline': trashOutline,
      'create-outline': createOutline,
      'download-outline': downloadOutline,
      'eye-outline': eyeOutline
    });
  }

goToDeck(deckId: string) {
  this.nav.navigateForward(`/deckbuilder/${deckId}`, {
    animated: false
  });
}
  public allCards: Card[] = [];
  public deckColor = this.deckService.deckColor;

ngOnInit() {
  this.allCards = testCards;
}

async deleteDeck(id: string) {
  const shouldDelete = confirm('¿Seguro que querés borrar este mazo?');
  if (!shouldDelete) return;

  await this.deckService.deleteDeck(id);

  this.deckDeleted.emit();
}

async downloadDeckImage(deckId: string) {
  const deck = await this.deckService.getDeckById(deckId);
  if (!deck) return;

  const allCards: Card[] = this.allCards; // tu lista completa del TCG

  const mainDeck = deck.cards.map(c => {
    const card = allCards.find(x => x.id === c.id);
    return {
      id: c.id,
      title: card?.name ?? '???',
      img: card?.img ?? '',
      faction: card?.faction ?? '',
      qty: c.amount
    };
  });

  const sideDeck = deck.sideDeck.cards.map(c => {
    const card = allCards.find(x => x.id === c.id);
    return {
      id: c.id,
      title: card?.name ?? '???',
      img: card?.img ?? '',
      faction: card?.faction ?? '',
      qty: c.amount
    };
  });

  this.exportDeckImage.exportDeck(mainDeck, sideDeck);
}

getDeckBackground(deck: Deck): string {
  return deck.color
    ? `linear-gradient(135deg, #1f1f1f 0%, ${deck.color} 100%)`
    : '#1f1f1f';
}

}
