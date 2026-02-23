import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
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
  IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, searchOutline } from 'ionicons/icons';

import { CardsComponent } from "src/app/components/cards/cards.component";
import { ImageViewerComponent } from 'src/app/components/image-viewer/image-viewer.component';

import { Deck } from 'src/app/interfaces/deck.interface';
import { DecksCardsService } from 'src/app/services/decks-cards';
import { Card } from 'src/app/interfaces/card.interface';
import { SideBarComponent } from 'src/app/components/side-bar/side-bar.component';
import { SortableCard } from 'src/app/interfaces/sortable.card.interface';
import { AlertController } from '@ionic/angular';
import { CardsLoaderService, Faction } from 'src/app/services/cards-loader-service';

addIcons({ searchOutline, arrowBackOutline });

export type SortBy = 'name' | 'amount' | 'faction' | 'rarity';

@Component({
  selector: 'deckbuilder',
  templateUrl: './deckbuilder.page.html',
  styleUrls: ['./deckbuilder.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, IonIcon, IonSearchbar, RouterModule,
    CardsComponent, IonInput, ImageViewerComponent, SideBarComponent
  ]
})
export class DeckbuilderPage implements OnInit, AfterViewInit {

  @ViewChild(IonContent) ionContent!: IonContent;


  public allCards: Card[] = [];
  public currentCards: Card[] = [];
  public sellos: ReadonlyArray<{
  img: string;
  faction: Faction;
}> = [
  { img: 'SELLO-JUPITER.png', faction: 'jupiter' },
  { img: 'SELLO-MARTE.png',   faction: 'marte' },
  { img: 'SELLO-PLUTON.png',  faction: 'pluton' },
  { img: 'SELLO-SATURNO.png', faction: 'saturno' },
  { img: 'SELLO-TIERRA.png',  faction: 'tierra' },
  { img: 'SELLO-NEPTUNO.png', faction: 'neptuno' },
  { img: 'SELLO-MERCURIO.png', faction: 'mercurio' }
];


  private cardsLoader = inject(CardsLoaderService);
  private route = inject(ActivatedRoute);
  private deckService = inject(DecksCardsService);
  private alertCtrl = inject(AlertController);

  public deckColor = this.deckService.deckColor;
  public searchOpen = false;
  public viewImg = false;
  public imgSelected = '';
  public counterAnimation = signal(false);
  public deckMode = signal<'main' | 'side'>('main');
  public selectedFaction: Faction = 'jupiter';
  public selectedFactionTitle: string = 'jupiter';
  public searchTerm: string = '';
  public sortBy: SortBy = 'amount';


  public editingTitle = false;
  public deckName = '';
  public savedAmounts: { [id: string]: number | undefined } = {};
  public selectedCards: SortableCard[] = [];

  public currentDeck!: Deck;
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
async ionViewDidEnter() {
  const faction: Faction = 'jupiter';

  this.selectedFaction = faction;
  this.selectedFactionTitle = faction;

  const cards = await this.cardsLoader.loadFaction(faction);
  this.currentCards = cards;

  this.searchTerm = '';
  this.searchOpen = false;

  this.ionContent?.scrollToTop(300);
}



async ngOnInit(): Promise<void> {
  await this.cardsLoader.loadAll();
  this.allCards = this.cardsLoader.allCards();

  const id = this.deckId();
  if (!id) return;

  const deck = await this.deckService.getDeckById(id);
  if (!deck) return;

  this.currentDeck = deck;
  this.deckName = deck.name;

  await this.deckService.getDeckColor(id);

 this.rebuildSavedAmounts(this.currentDeck);

  this.updateSelectedCardsList();

  const result = this.deckService.checkLimitedCards(this.currentDeck);

 if (result.modifiedCards.length > 0) {
  this.currentDeck = result.deck;
  await this.deckService.updateDeck(this.currentDeck);
  this.updateSelectedCardsList();
  this.rebuildSavedAmounts(this.currentDeck);
  for (const card of result.modifiedCards) {
    await this.deckService.showConfirmAlert(
      `La carta "${card.cardName}" fue ajustada al máximo permitido (${card.copyLimit}).`
    );
  }
}
}

private rebuildSavedAmounts(deck: Deck) {
  this.savedAmounts = {};
  for (const c of deck.cards) {
    this.savedAmounts[c.id] = c.amount ?? 0;
  }
}


  toggleSearch(event: Event): void {
    event.stopPropagation();
    this.searchOpen = !this.searchOpen;
  }

  closeSearch(): void {
    if (this.searchOpen) this.searchOpen = false;
  }

  enableEdit(): void {
    this.editingTitle = true;

    setTimeout(() => {
      const el = document.querySelector('.title-input input') as HTMLInputElement | null;
      if (el) el.select();
    }, 50);
  }

  async saveTitle(): Promise<void> {
  this.editingTitle = false;

  const newName = this.deckName.trim() || 'New Deck';

  if (!this.currentDeck) return;

  // 🔹 Obtener todos los mazos
  const allDecks = await this.deckService.getDecks();

  // 🔹 Verificar duplicado (excluyendo el mazo actual)
  const nameExists = allDecks.some(
    d => d.name === newName && d.id !== this.currentDeck.id
  );

  if (nameExists) {
    // restaurar nombre anterior
    this.deckName = this.currentDeck.name;

    await this.showDuplicateNameAlert(newName);
    return;
  }

  // 🔹 Guardar si es válido
  this.deckName = newName;
  this.currentDeck.name = newName;

  await this.deckService.updateDeck(this.currentDeck);
}


  private async showDuplicateNameAlert(name: string) {
  const alert = await this.alertCtrl.create({
    header: 'Nombre duplicado',
    message: `Ya existe un mazo con el nombre ${name}. Elegí otro nombre.`,
    buttons: ['OK'],
    backdropDismiss: false,
  });

  await alert.present();
}


  openImageViewer(imgUrl: string): void {
    this.imgSelected = imgUrl;
    this.viewImg = true;
  }

  toggleImageViewer(): void {
    this.viewImg = !this.viewImg;
    if (!this.viewImg) this.imgSelected = '';
  }

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
        const card = this.allCards.find(t => t.id === c.id);
        return {
          id: c.id,
          name: card?.name ?? 'Sin nombre',
          amount: c.amount ?? 0,
          faction: card?.faction ?? 'neutral',
          banned: card?.banned ?? false
        };
      })
      .filter(c => c.amount > 0);

    const oldTotal = this.totalSelected;
    this.totalSelected = this.selectedCards.reduce((a, c) => a + c.amount, 0);

    if (this.totalSelected !== oldTotal) {
      this.triggerCounterAnimation();
    }

    if (this.sortBy) {
      this.applySorting(this.sortBy);
    }
  }

  private triggerCounterAnimation(): void {
    this.counterAnimation.set(true);
    setTimeout(() => this.counterAnimation.set(false), 300);
  }

  async setDeckMode(mode: 'main' | 'side'): Promise<void> {
    this.deckMode.set(mode);

    const id = this.deckId();
    if (!id) return;

    const updated = await this.deckService.getDeckById(id);
    if (!updated) return;

    this.currentDeck = updated;

    const source = mode === 'main'
      ? updated.cards
      : updated.sideDeck.cards;

    this.savedAmounts = {};
    for (const c of source) {
      this.savedAmounts[c.id] = c.amount ?? 0;
    }

    this.updateSelectedCardsList();

    if (this.sortBy) {
      this.applySorting(this.sortBy);
    }
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

    if (this.sortBy) {
      this.applySorting(this.sortBy);
    }
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

  private scrollToTop(): void {
    if (!this.ionContent) return;
    this.ionContent.scrollToTop(300);
  }

async filterCardsByFaction(faction: Faction) {
  await this.cardsLoader.loadFaction(faction);

  this.currentCards = this.deckService.filteredCards(
    this.allCards,
    faction
  );

  this.selectedFaction = faction;
  this.selectedFactionTitle = faction;

  this.scrollToTop();
}


 filterCards(searchTerm: string) {
  this.searchTerm = searchTerm.trim().toLowerCase();

 if (!this.searchTerm) {
  this.currentCards = this.deckService.filteredCards(
    this.allCards,
    this.selectedFaction
  );
  this.selectedFactionTitle = this.selectedFaction;
  return;
}

  const filtered = this.deckService.filterItems(
  this.allCards,
  this.searchTerm,
  ['name', 'faction', 'rarity', 'tags']
);


  this.currentCards = filtered;
  this.selectedFactionTitle = 'resultados de búsqueda';
}


  onSearchKeydown(ev: any) {
    const e: KeyboardEvent =
      ev?.detail?.event ||
      ev;

    if (!e) return;

    if (e.key === 'Enter') {
      this.searchOpen = false;

      const sb = document.querySelector('ion-searchbar') as HTMLIonSearchbarElement;
      sb?.blur();

      e.preventDefault();
      e.stopPropagation();
    }
  }



  applySorting(sortBy: SortBy): void {
    this.sortBy = sortBy;

    if (!this.selectedCards) return;

    this.selectedCards = this.deckService.sortCards(
  this.selectedCards,
  sortBy,
  (id) => this.getRarityValue(id));

  }

private getRarityValue(cardId: string): string {
  const card = this.allCards.find(c => c.id === cardId);
  return card?.rarity ?? '';
}

  getGradient(): string {
  const color = this.deckColor() ?? '#1f1f1f';
  return `linear-gradient(to top, ${color}, #1f1f1f)`;
}
}
