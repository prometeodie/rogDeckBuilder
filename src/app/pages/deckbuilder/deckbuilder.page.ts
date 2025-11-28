import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
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
import { DeckCard } from 'src/app/interfaces/deck-card.interface';

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

  testCards: Card[] = [
    {
      id: '1',
      name: 'Guardián del Abismo',
      faction: 'pluton',
      rarity: 'common',
      img: 'https://riseofgods.store/wp-content/uploads/2024/06/ESTRUCTURA-4-Canon-de-Zagh-733x1024.png',
      factionCost: 2,
      cost: 3,
      banned: false,
      isSeal: false
    },
    {
      id: '2',
      name: 'Martillo Celeste',
      faction: 'jupiter',
      rarity: 'rare',
      img: 'https://riseofgods.store/wp-content/uploads/2024/06/Sello-Jupiter.png',
      factionCost: 1,
      cost: 2,
      banned: false,
      isSeal: true
    },
    {
      id: '3',
      name: 'Centinela Carmesí',
      faction: 'marte',
      rarity: 'epic',
      img: 'https://riseofgods.store/wp-content/uploads/2024/06/ESTRUCTURA-4-Canon-de-Zagh-733x1024.png',
      factionCost: 3,
      cost: 5,
      banned: false,
      isSeal: false
    },
    {
      id: '4',
      name: 'Sello del Oleaje Eterno',
      faction: 'neptuno',
      rarity: 'legendary',
      img: 'https://riseofgods.store/wp-content/uploads/2024/06/Sello-Jupiter.png',
      factionCost: 2,
      cost: 4,
      banned: false,
      isSeal: true
    },
    {
      id: '5',
      name: 'Protector de Gaia',
      faction: 'tierra',
      rarity: 'common',
      img: 'https://riseofgods.store/wp-content/uploads/2024/06/ESTRUCTURA-4-Canon-de-Zagh-733x1024.png',
      factionCost: 1,
      cost: 1,
      banned: false,
      isSeal: false
    }
  ];

  private route = inject(ActivatedRoute);
  private deckService = inject(DecksCardsService);

  public searchOpen = false;
  public viewImg = false;
  public imgSelected = '';

  public editingTitle = false;
  public deckName = '';
  public savedAmounts: { [id: string]: number | undefined } = {};
  public selectedCards: { id: string; name: string; amount: number }[] = [];

  public currentDeck!: Deck;

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

        // crear mapa con cantidades guardadas por id
        this.savedAmounts = {};
        for (const c of deck.cards) {
          this.savedAmounts[c.id] = c.amount ?? 0;
        }

        // llenar sidebar
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
    if (!this.currentDeck || !this.currentDeck.cards) {
      this.selectedCards = [];
      return;
    }

    this.selectedCards = this.currentDeck.cards
      .map((c: DeckCard) => {
        const full = this.testCards.find(t => t.id === c.id);
        return {
          id: c.id,
          name: full?.name ?? 'Sin nombre',
          amount: c.amount ?? 0
        };
      })
      .filter(item => item.amount > 0);
  }

  // llamado desde child cuando cambia la cantidad (debounced save)
  async refreshDeck(): Promise<void> {
    const id = this.deckId();
    if (!id) return;

    const updated = await this.deckService.getDeckById(id);
    if (!updated) return;

    this.currentDeck = updated;
    // actualizar savedAmounts
    this.savedAmounts = {};
    for (const c of this.currentDeck.cards) {
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
    });

    await this.refreshDeck();
  }
}
