import { AfterViewInit, Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonSearchbar,
  IonButton,
  IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, searchOutline } from 'ionicons/icons';

import { CardsComponent } from "src/app/components/cards/cards.component";
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';

import { Deck } from 'src/app/interfaces/deck.interface';
import { DecksCardsService } from 'src/app/services/decks-cards';
import { Card } from 'src/app/interfaces/card.interface';
import { testCards } from 'src/app/cards-testing';

addIcons({ searchOutline, arrowBackOutline });

@Component({
  selector: 'deckbuilder',
  templateUrl: './deckbuilder.page.html',
  styleUrls: ['./deckbuilder.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, IonIcon, IonSearchbar, IonButton, RouterModule,
    CardsComponent, IonInput, ImageViewerComponent
  ]
})
export class DeckbuilderPage implements OnInit, AfterViewInit {

  public testCards: Card[] = testCards;
  public sellos =[{img:'SELLO-ALL.png', faction: 'all'},
                  {img:'SELLO-JUPITER.png',faction:'jupiter'},
                  {img:'SELLO-MARTE.png', faction:'marte'},
                  {img:'SELLO-PLUTON.png',faction:'pluton'},
                  {img:'SELLO-SATURNO.png',faction:'saturno'},
                  {img:'SELLO-TIERRA.png',faction:'tierra'},
                  {img:'SELLO-NEPTUNO.png',faction:'neptuno'}];

  private route = inject(ActivatedRoute);
  private deckService = inject(DecksCardsService);

  public searchOpen = false;
  public viewImg = false;
  public imgSelected = '';
  public counterAnimation = signal(false);
  public deckMode = signal<'main' | 'side'>('main');
  public selectedFaction: string = 'all';

  public editingTitle = false;
  public deckName = '';
  public savedAmounts: { [id: string]: number | undefined } = {};
  public selectedCards: { id: string; name: string; amount: number }[] = [];

  public currentDeck!: Deck;

  // ➕ contador total de cartas
  public totalSelected: number = 0;

  public deckId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id')))
  );

  ngAfterViewInit(): void {
    const nav = document.querySelector('.sticky-nav') as HTMLElement | null;
    if (nav) {
      document.documentElement.style.setProperty('--nav-height', nav.offsetHeight + 'px');
    }
  }

  async ngOnInit(): Promise<void> {
    const id = this.deckId();

    if (id) {
      const deck = await this.deckService.getDeckById(id);

      if (deck) {
        this.currentDeck = deck;
        this.deckName = deck.name;

        this.savedAmounts = {};
        for (const c of deck.cards) {
          this.savedAmounts[c.id] = c.amount ?? 0;
        }

        this.updateSelectedCardsList();
        return;
      }
    }
  }

  // =======================
  // SEARCH
  // =======================
  toggleSearch(event: Event): void {
    event.stopPropagation();
    this.searchOpen = !this.searchOpen;
  }

  closeSearch(): void {
    if (this.searchOpen) this.searchOpen = false;
  }

  // =======================
  // TITLE EDIT
  // =======================
  enableEdit(): void {
    this.editingTitle = true;

    setTimeout(() => {
      const el = document.querySelector('.title-input input') as HTMLInputElement | null;
      if (el) el.select();
    }, 50);
  }

  async saveTitle(): Promise<void> {
    this.editingTitle = false;

    if (!this.deckName.trim()) {
      this.deckName = 'New Deck';
    }

    if (this.currentDeck) {
      this.currentDeck.name = this.deckName;
      await this.deckService.updateDeck(this.currentDeck);
    }
  }

  // =======================
  // IMAGE VIEWER
  // =======================
  openImageViewer(imgUrl: string): void {
    this.imgSelected = imgUrl;
    this.viewImg = true;
  }

  toggleImageViewer(): void {
    this.viewImg = !this.viewImg;
    if (!this.viewImg) this.imgSelected = '';
  }

  // =======================
  // SIDEBAR / SELECTED CARDS
  // =======================
  private updateSelectedCardsList(): void {
  if (!this.currentDeck) {
    this.selectedCards = [];
    this.totalSelected = 0;
    return;
  }

  const mode = this.deckMode();
  const source = mode === 'main'
    ? this.currentDeck.cards
    : this.currentDeck.sideDeck.cards;

  this.selectedCards = source
    .map((c: any) => {
      const full = this.testCards.find(t => t.id === c.id);
      return {
        id: c.id,
        name: full?.name ?? 'Sin nombre',
        amount: c.amount ?? 0
      };
    })
    .filter(c => c.amount > 0);

  const oldTotal = this.totalSelected;
  this.totalSelected = this.selectedCards.reduce((a, c) => a + c.amount, 0);

  if (this.totalSelected !== oldTotal) {
    this.triggerCounterAnimation();
  }
}


private triggerCounterAnimation(): void {
  this.counterAnimation.set(true); // signal o boolean
  setTimeout(() => this.counterAnimation.set(false), 300);
}

async setDeckMode(mode: 'main' | 'side'): Promise<void> {
  this.deckMode.set(mode);

  const id = this.deckId();
  if (!id) return;

  // recargar deck entero
  const updated = await this.deckService.getDeckById(id);
  if (!updated) return;

  this.currentDeck = updated;

  // seleccionar origen segun modo
  const source = mode === 'main'
    ? updated.cards
    : updated.sideDeck.cards;

  // reconstruir savedAmounts para las <card>
  this.savedAmounts = {};
  for (const c of source) {
    this.savedAmounts[c.id] = c.amount ?? 0;
  }

  // refrescar sidebar
  this.updateSelectedCardsList();
}

 async refreshDeck(): Promise<void> {
  const id = this.deckId();
  if (!id) return;

  const updated = await this.deckService.getDeckById(id);
  if (!updated) return;

  this.currentDeck = updated;

  const mode = this.deckMode();

  const source = mode === 'main'
    ? updated.cards
    : updated.sideDeck.cards;

  this.savedAmounts = {};
  for (const c of source) {
    this.savedAmounts[c.id] = c.amount ?? 0;
  }

  this.updateSelectedCardsList();
}

async removeCard(cardId: string): Promise<void> {
  const id = this.deckId();
  if (!id) return;

  await this.deckService.upsertCardInDeck(id, {
    id: cardId,
    faction: '',
    amount: 0
  }, this.deckMode());

  await this.refreshDeck();
}

filterCardsByFaction(faction: string) {
 this.testCards = this.deckService.filteredCards(testCards, faction);
 this.selectedFaction = faction;
}
}
