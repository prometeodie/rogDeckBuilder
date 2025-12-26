import { DeckExportService } from './../../services/deck-export-service';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
  pencilOutline,
  imageOutline,
} from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { DecksCardsService } from 'src/app/services/decks-cards';
import { ExportDeckImageService } from 'src/app/services/export-deck-image-service';
import { Card } from 'src/app/interfaces/card.interface';
import { Cards } from 'src/app/cards-testing';
import { NavController } from '@ionic/angular';
import { DeckExportComponentComponent } from '../deck-export-component/deck-export-component.component';
import { ExportCard } from 'src/app/interfaces/export.card.interface';
import { User } from 'src/app/services/user';
import { UserIdentityData } from 'src/app/interfaces/user.interface';
import Swal from 'sweetalert2';

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
    RouterModule,
    DeckExportComponentComponent
  ]
})
export class DecksComponent {

  @Input() decks: Deck[] = [];
  @Output() deckDeleted = new EventEmitter<void>();

  private deckService = inject(DecksCardsService);
  private exportDeckImage = inject(ExportDeckImageService);
  private deckExportService = inject(DeckExportService);
  private userService = inject(User);
  private nav:NavController  = inject(NavController);
  private cdr = inject(ChangeDetectorRef);

  public mainDeck!:ExportCard[];
  public sideDeck!:ExportCard[];
  public showExport:boolean = false;
  public user!:UserIdentityData | null;

  constructor() {
    addIcons({
      'trash-outline': trashOutline,
      'create-outline': createOutline,
      'pencil-outline': pencilOutline,
      'download-outline': downloadOutline,
      'image-outline': imageOutline,
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

async ngOnInit() {
  this.allCards = Cards;
}

async getUser(): Promise<UserIdentityData | null> {
  return this.userService.getUserData();
}

async deleteDeck(id: string) {
  const shouldDelete = confirm('¿Seguro que querés borrar este mazo?');
  if (!shouldDelete) return;

  await this.deckService.deleteDeck(id);

  this.deckDeleted.emit();
}

async downloadDeckImage(deckId: string) {
  this.showDownloadingToast('Generando imagen del mazo...');

  try {
    this.showExport = true;

    const deck = await this.deckService.getDeckById(deckId);
    if (!deck) return;

    const allCards: Card[] = this.allCards;

    this.mainDeck = deck.cards.map(c => {
      const card = allCards.find(x => x.id === c.id);
      return {
        id: c.id,
        title: card?.name ?? '???',
        img: card?.img ?? '',
        faction: card?.faction ?? '',
        qty: c.amount,
        banned: card?.banned
      };
    });

    this.sideDeck = deck.sideDeck.cards.map(c => {
      const card = allCards.find(x => x.id === c.id);
      return {
        id: c.id,
        title: card?.name ?? '???',
        img: card?.img ?? '',
        faction: card?.faction ?? '',
        qty: c.amount,
        banned: card?.banned
      };
    });

    this.cdr.detectChanges();

    await new Promise<void>(resolve => {
      requestAnimationFrame(() => {
        this.exportDeckImage.exportRenderedDeck(deck.name).then(() => {
          resolve();
        });
      });
    });

  } finally {
    this.showExport = false;
    this.cdr.detectChanges();
    this.closeToast();
  }
}


getDeckBackground(deck: Deck): string {
  return deck.color
    ? `linear-gradient(135deg, #1f1f1f 0%, ${deck.color} 100%)`
    : '#1f1f1f';
}

async downloadDeck(id: string) {
  this.user = await this.getUser();
  const deck = await this.deckService.getDeckById(id);

  if (!deck) {
    console.error('Deck no encontrado');
    return;
  }

  this.deckExportService.downloadDeck(deck, this.user?.nickname!);
}


private showDownloadingToast(message: string = 'Descargando...'): void {
  Swal.fire({
    toast: true,
    position: 'bottom',
    icon: 'info',
    title: message,
    showConfirmButton: false,
    background: '#2980b9',
    color: '#fff',
    didOpen: () => {
      Swal.showLoading();
    }
  });
}

private closeToast(): void {
  Swal.close();
}


}
