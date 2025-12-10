import { IonHeader, IonSegment, IonSegmentButton, IonLabel, IonToolbar, IonContent, IonTitle, IonIcon } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Deck } from '../../interfaces/deck.interface';
import { DecksCardsService } from 'src/app/services/decks-cards';
import { testCards } from 'src/app/cards-testing';
import { arrowBackOutline, barChartOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { CardListComponent } from 'src/app/components/card-list/card-list.component';
import { EstadisticsComponent } from 'src/app/components/estadistics/estadistics.component';
import { DeckCardsComponent } from 'src/app/components/deck-cards/deck-cards.component';

@Component({
  selector: 'deck-viewer',
  templateUrl: './deck-viewer.component.html',
  styleUrls: ['./deck-viewer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonSegment, IonSegmentButton, IonLabel, IonToolbar,
    IonContent, IonTitle, IonIcon, RouterModule,
    CardListComponent, EstadisticsComponent, DeckCardsComponent
  ],
})
export class DeckViewerComponent implements OnInit {

  public deck = signal<Deck | null>(null);
  public loading = signal(true);
  private cards = testCards;

  public currentView = signal<'view1' | 'view2' | 'view3'>('view1');

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

  private route = inject(ActivatedRoute);
  private decksService = inject(DecksCardsService);

  constructor() {
    addIcons({ 'arrow-back-outline': arrowBackOutline, 'bar-chart-outline': barChartOutline });
  }

  ngOnInit(): void {
    this.loadDeck();
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
