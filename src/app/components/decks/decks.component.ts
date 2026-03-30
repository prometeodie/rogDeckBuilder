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
  duplicateOutline,
} from 'ionicons/icons';
import { Router, RouterModule } from '@angular/router';
import { DecksCardsService } from 'src/app/services/decks-cards';
import { ExportDeckImageService } from 'src/app/services/export-deck-image-service';
import { Card } from 'src/app/interfaces/card.interface';
import { NavController } from '@ionic/angular';
import { DeckExportComponentComponent } from '../deck-export-component/deck-export-component.component';
import { ExportCard } from 'src/app/interfaces/export.card.interface';
import { User } from 'src/app/services/user';
import { UserIdentityData } from 'src/app/interfaces/user.interface';
import Swal from 'sweetalert2';
import { CardsLoaderService } from 'src/app/services/cards-loader-service';
import { DECK_COLORS } from 'src/app/constant/decks.colors';

@Component({
  selector: 'decks',
  standalone: true,
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
  imports: [
    CommonModule,
    IonList,
    IonItem,
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
  private cardsLoader = inject(CardsLoaderService);
  private router = inject(Router);

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
      'eye-outline': eyeOutline,
      'duplicate-outline': duplicateOutline
    });
  }

goToDeck(deckId: string) {
  this.nav.navigateForward(`/deckbuilder/${deckId}`, {
    animated: false
  });
}
  public allCards: Card[] = [];
  public deckColor = this.deckService.deckColor;
  private cardMap: Record<string, Card> = {};

async ngOnInit() {
  await this.cardsLoader.loadAll();

  this.allCards = this.cardsLoader.allCards();

  // 🔥 MAPA PARA ACCESO O(1)
  this.cardMap = {};

for (const c of this.allCards) {
  this.cardMap[c.id] = c;
}
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

async downloadDeckImage(deckId: string): Promise<void> {
  this.showDownloadingToast('Generando imagen del mazo...');

  let canExport = false;

  try {
    await this.cardsLoader.loadAll();
    this.allCards = this.cardsLoader.allCards();

    const deck = await this.deckService.getDeckById(deckId);
    if (!deck) return;

    const result = this.deckService.checkLimitedCards(deck);

    if (result.modifiedCards.length > 0) {
      for (const card of result.modifiedCards) {
        await this.deckService.showConfirmAlert(
          `La carta "${card.cardName}" supera el máximo permitido (${card.copyLimit} copias).\n\nEl mazo debe corregirse antes de poder generar la imagen.`
        );
      }
      return;
    }
    canExport = true;
    this.showExport = true;

    const allCards: Card[] = this.allCards;

    this.mainDeck = deck.cards.map(c => {
      const card = allCards.find(x => x.id === c.id);
      return {
        id: c.id,
        title: card?.name ?? '???',
        img: card?.img ?? '',
        faction: card?.faction ?? '',
        qty: c.amount,
        banned: card?.banned ?? false
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
        banned: card?.banned ?? false
      };
    });

    this.cdr.detectChanges();

    await new Promise<void>(resolve => {
      requestAnimationFrame(() => {
        this.exportDeckImage
          .exportRenderedDeck(deck.name)
          .then(resolve);
      });
    });

  } finally {
    if (canExport) {
      this.showExport = false;
      this.cdr.detectChanges();
    }
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

async duplicateDeck(id: string) {

  const shouldDuplicate = window.confirm('¿Querés duplicar este mazo?');

  if (!shouldDuplicate) return;

  const newDeck = await this.deckService.duplicateDeck(id);

  if (newDeck) {
    this.deckService.showToast('Mazo duplicado', 'success');

    this.router.navigate(['/deckbuilder', newDeck.id]);
  }
}

getFactionDistribution(deck: Deck): {
  faction: string;
  percentage: number;
}[] {

  if (!deck?.cards?.length) return [];

  const total = deck.cards.reduce((acc, c) => acc + (c.amount ?? 0), 0);
  if (total === 0) return [];

  const factionMap: Record<string, number> = {};

  for (const c of deck.cards) {
    const cardData = this.cardMap[c.id];
    if (!cardData) continue;

    const faction = cardData.faction ?? 'neutral';

    factionMap[faction] = (factionMap[faction] || 0) + (c.amount ?? 0);
  }

  // 🔹 calcular porcentajes reales
  const raw = Object.entries(factionMap)
    .map(([faction, amount]) => ({
      faction,
      raw: (amount / total) * 100
    }))
    .sort((a, b) => b.raw - a.raw);

  // 🔹 floor inicial
  let sum = 0;
  const result = raw.map(r => {
    const value = Math.floor(r.raw);
    sum += value;
    return {
      faction: r.faction,
      percentage: value
    };
  });

  // 🔹 repartir lo que falta hasta 100
  let diff = 100 - sum;

  for (let i = 0; i < result.length && diff > 0; i++) {
    result[i].percentage += 1;
    diff--;
  }

  return result;
}
getFactionColor(faction: string): string {
  return DECK_COLORS[faction] ?? '#999';
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
