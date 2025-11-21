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

import { Deck } from 'src/app/interfaces/deck.interface';
import { DecksCardsService } from 'src/app/services/decks-cards';

addIcons({ searchOutline, arrowBackOutline });

@Component({
  selector: 'deckbuilder',
  templateUrl: './deckbuilder.page.html',
  styleUrls: ['./deckbuilder.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    CommonModule, FormsModule, IonIcon, IonSearchbar, IonButton, RouterModule,
    CardsComponent, IonInput
  ]
})
export class DeckbuilderPage implements OnInit, AfterViewInit {

  private route = inject(ActivatedRoute);
  private deckService = inject(DecksCardsService);

  public searchOpen = false;

  editingTitle = false;
  deckName: string = '';

  currentDeck!: Deck;

  deckId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id')))
  );

  ngAfterViewInit() {
    const nav = document.querySelector('.sticky-nav') as HTMLElement;
    document.documentElement.style.setProperty('--nav-height', nav.offsetHeight + 'px');
  }

  async ngOnInit() {
    const id = this.deckId();

    // =============================================
    // SI EDITA MAZO EXISTENTE
    // =============================================
    if (id) {
      const deck = await this.deckService.getDeckById(id);

      if (deck) {
        this.currentDeck = deck;
        this.deckName = deck.name; // cargar título
        return;
      }
    }
  }

  // ======================================================
  // SEARCH
  // ======================================================

  toggleSearch(event: Event) {
    event.stopPropagation();
    this.searchOpen = !this.searchOpen;
  }

  closeSearch() {
    if (this.searchOpen) this.searchOpen = false;
  }

  // ======================================================
  // TITLE EDIT
  // ======================================================

  enableEdit() {
    this.editingTitle = true;

    setTimeout(() => {
      const el = document.querySelector('.title-input input') as HTMLInputElement;
      if (el) el.select();
    }, 50);
  }

  async saveTitle() {
    this.editingTitle = false;

    // evita títulos vacíos
    if (!this.deckName.trim()) {
      this.deckName = 'New Deck';
    }

    // actualiza el Deck
    this.currentDeck.name = this.deckName;

    // 🔥 GUARDA REAL EN CAPACITOR STORAGE
    await this.deckService.updateDeck(this.currentDeck);
  }

}
