import { IonHeader, IonSegment, IonSegmentButton, IonToolbar, IonContent, IonTitle, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Deck } from '../../interfaces/deck.interface';
import { DecksCardsService } from 'src/app/services/decks-cards';
import { Cards } from 'src/app/cards-testing';
import { arrowBackOutline, barChartOutline, listOutline, tabletPortraitOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CardListComponent } from 'src/app/components/card-list/card-list.component';
import { EstadisticsComponent } from 'src/app/components/estadistics/estadistics.component';
import { DeckCardsComponent } from 'src/app/components/deck-cards/deck-cards.component';
import { ViewWillEnter } from '@ionic/angular/standalone';
import { Card } from 'src/app/interfaces/card.interface';


@Component({
  selector: 'deck-viewer',
  templateUrl: './deck-viewer.component.html',
  styleUrls: ['./deck-viewer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonSegment, IonSegmentButton, IonToolbar,
    IonContent, IonTitle, IonIcon, RouterModule,
    CardListComponent, EstadisticsComponent, DeckCardsComponent
  ],
})
export class DeckViewerComponent implements ViewWillEnter {

  public deck = signal<Deck | null>(null);
  public loading = signal(true);
  private cards = Cards;

  public currentView = signal<'view1' | 'view2' | 'view3'>('view1');
  public selectedCards:Card[] =[];

  public expandedMain = computed(() => {
    const d = this.deck();
    if (!d || !d.cards) return [];
    return d.cards.map(card => ({
      ...card,
      data: this.cards.find(c => c.id === card.id) || null
    }));
  });

  public expandedSide = computed(() => {
    const d = this.deck();
    if (!d || !d.sideDeck) return [];
    return d.sideDeck.cards.map(card => ({
      ...card,
      data: this.cards.find(c => c.id === card.id) || null
    }));
  });

  public totalMainCards = computed(() => {
  const d = this.deck();
  if (!d || !d.cards) return 0;

  return d.cards.reduce((acc, c) => acc + c.amount, 0);
});

public totalSideCards = computed(() => {
  const d = this.deck();
  if (!d || !d.sideDeck) return 0;

  return d.sideDeck.cards.reduce((acc, c) => acc + c.amount, 0);
});


  private route = inject(ActivatedRoute);
  private decksService = inject(DecksCardsService);

  constructor() {
    addIcons({ 'arrow-back-outline': arrowBackOutline,
               'bar-chart-outline': barChartOutline,
               'list-outline': listOutline,
               'tablet-portrait-outline':tabletPortraitOutline });
  }

  async ionViewWillEnter() {
  await this.loadDeck();   // vuelve a cargar SIEMPRE al entrar
}

  onSegmentChange(ev: any) {
    this.currentView.set(ev.detail.value);
  }

  private async loadDeck() {
    this.loading.set(true);

    const deckId = this.route.snapshot.paramMap.get('id');
    if (!deckId) {
      this.deck.set(null);
      this.loading.set(false);
      return;
    }

    const found = await this.decksService.getDeckById(deckId);

    this.deck.set(found ?? null);
    this.loading.set(false);
  }

}
