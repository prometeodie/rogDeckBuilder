import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonCardContent, IonButton, IonIcon, IonImg
} from '@ionic/angular/standalone';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DecksCardsService } from 'src/app/services/decks-cards';
import { Card } from 'src/app/interfaces/card.interface';
import { DeckCard } from 'src/app/interfaces/deck-card.interface';
import { addIcons } from 'ionicons';
import { addOutline, removeOutline } from 'ionicons/icons';
import { RomanPipe } from 'src/app/pipes/roman-pipe';
import { limitedCards } from 'src/cards/limited.cards';
import { CardsLoaderService } from 'src/app/services/cards-loader-service';

@Component({
  selector: 'card',
  standalone: true,
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
  imports: [
    CommonModule,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonImg,
    RomanPipe
  ]
})
export class CardsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() initialCount = 0;
  @Input() deckId?: string;
  @Input() cardData!: Card;
  @Input() mainAmount: number = 0;
  @Input() sideAmount: number = 0;
  @Input() mode: 'main' | 'side' = 'main';

  @Output() ImgView = new EventEmitter<string>();
  @Output() amountChange = new EventEmitter<{
    id: string;
    amount: number;
    mode: 'main' | 'side';
  }>();

  public count = 0;
  public imgLoaded = false;
  public maxLegendsCardsAmount:number = 6;

  private saveSubject = new Subject<number>();
  private sub?: Subscription;
  private deckService = inject(DecksCardsService);
  private cardsService = inject(CardsLoaderService);

  private rarityLimits: Record<string, number> = {
    common: 4,
    rare: 3,
    epic: 2,
    legendary: 1,
    unlimited: 0
  };

  public selloPorFaccion: Record<string, string> = {
    jupiter: 'SELLO-JUPITER.png',
    marte: 'SELLO-MARTE.png',
    pluton: 'SELLO-PLUTON.png',
    saturno: 'SELLO-SATURNO.png',
    tierra: 'SELLO-TIERRA.png',
    neptuno: 'SELLO-NEPTUNO.png',
    mercurio: 'SELLO-MERCURIO.png'
  };

  constructor() {
    addIcons({ 'remove': removeOutline, 'add': addOutline });
  }

  ngOnInit(): void {
    this.count = this.initialCount;

    this.sub = this.saveSubject
      .pipe(debounceTime(300))
      .subscribe(async (amount) => {
        await this.attemptSave(amount);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialCount']?.currentValue !== undefined) {
      this.count = changes['initialCount'].currentValue;
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // 🔥 LÍMITE REAL DE LA CARTA
  private getCardLimit(): number {

    const rule = limitedCards.find(l => l.id === this.cardData.id);
    if (rule) return rule.copyLimit;

    if (this.cardData.copyLimit && this.cardData.copyLimit > 0) {
      return this.cardData.copyLimit;
    }

    return this.rarityLimits[this.cardData.rarity ?? 'common'] ?? 4;
  }

async increase(): Promise<void> {
  if (!this.deckId) return;

  const isUnlimited = this.cardData.isSeal || this.cardData.isToken;
  const cards = this.cardsService.allCards();

  const cardsMap = new Map(cards.map(card => [card.id, card]));

  const deck = await this.deckService.getDeckById(this.deckId);
  if (!deck) return;

  // =============================
  // 🔥 VALIDACIÓN POR CARTA
  // =============================
  if (!isUnlimited) {

    const limit = this.getCardLimit();
    const rule = limitedCards.find(l => l.id === this.cardData.id);

    const mainCount = await this.deckService.getCardAmount(this.deckId, this.cardData.id);
    const sideCount = await this.deckService.countCardInSideDeck(this.deckId, this.cardData.id);

    const currentTotal = mainCount + sideCount;

    if (limit > 0 && currentTotal >= limit) {

      if (rule) {
        const singularPlural = limit === 1 ? 'copia' : 'copias';

        this.deckService.showToast(
          `El límite de esta carta es ${limit} ${singularPlural} por reglamento.`,
          'info',
          'center'
        );
      }

      return;
    }
  }

  // =============================
  // 🔥 CAP DEL MAZO (PRIORIDAD ALTA)
  // =============================
  const totalNow = this.mode === 'main'
    ? await this.deckService.getTotalCardsCountInMain(this.deckId)
    : await this.deckService.getTotalCardsCountInSide(this.deckId);

  const cap = this.mode === 'main' ? 40 : 15;

  if (totalNow >= cap) {
    this.deckService.showToast(
      this.mode === 'main'
        ? 'El mazo principal ya está completo.'
        : 'El Side Deck ya está completo.',
      'warning',
      'center'
    );
    return;
  }

  // =============================
  // 🔥 VALIDACIÓN LEGENDARIAS
  // =============================
  const legendaryCount = deck.cards.reduce((acc, c) => {
    const card = cardsMap.get(c.id);
    return card?.rarity === 'legendary'
      ? acc + (c.amount ?? 0)
      : acc;
  }, 0);

  const isLegendary = this.cardData.rarity === 'legendary';
  const nextLegendaryCount = isLegendary ? legendaryCount + 1 : legendaryCount;

  if (nextLegendaryCount > this.maxLegendsCardsAmount) {
    this.deckService.showToast(
      `No podés tener más de ${this.maxLegendsCardsAmount} cartas legendarias en el mazo.`,
      'info',
      'center'
    );
    return;
  }

  // =============================
  // ✅ INCREMENTO
  // =============================
  this.count++;
  this.saveSubject.next(this.count);
}

  decrease(): void {
    if (this.count > 0) {
      this.count--;
      this.saveSubject.next(this.count);
    }
  }

private async attemptSave(amount: number): Promise<void> {

  if (!this.deckId) return;

  const deck = await this.deckService.getDeckById(this.deckId);

  let prevSaved = 0;

  if (deck) {
    const source = this.mode === 'main'
      ? (deck.cards ?? [])
      : (deck.sideDeck?.cards ?? []);

    const found = source.find(c => c.id === this.cardData.id);
    prevSaved = found ? (found.amount ?? 0) : 0;
  }

  // =============================
  // 🔥 VALIDACIÓN GLOBAL + CLAMP
  // =============================
  const isUnlimited = this.cardData.isSeal || this.cardData.isToken;

  let adjustedAmount = amount;

  if (!isUnlimited) {

    const limit = this.getCardLimit();
    const rule = limitedCards.find(l => l.id === this.cardData.id);

    const mainCount = await this.deckService.getCardAmount(this.deckId, this.cardData.id);
    const sideCount = await this.deckService.countCardInSideDeck(this.deckId, this.cardData.id);

    const currentTotal = mainCount + sideCount;

    // 🔥 total sin lo que ya está en este slot
    const totalWithoutCurrent = currentTotal - prevSaved;

    // 🔥 total final deseado
    const totalAfter = totalWithoutCurrent + amount;

    // 🔥 CLAMP (NO BLOQUEA)
    if (limit > 0 && totalAfter > limit) {

      adjustedAmount = Math.max(0, limit - totalWithoutCurrent);

      const singularPlural = limit === 1 ? 'copia' : 'copias';

      this.deckService.showToast(
        `Máximo ${limit} ${singularPlural} entre Main y Side Deck.`,
        'warning',
        'center'
      );
    }
  }

  // =============================
  // 🔹 GUARDAR
  // =============================
  const deckCard: DeckCard = {
    id: this.cardData.id,
    faction: this.cardData.faction,
    amount: adjustedAmount
  };

  const finalAmount = await this.deckService.upsertCardInDeck(
    this.deckId,
    deckCard,
    this.mode
  );

  // =============================
  // 🔄 SINCRONIZACIÓN UI
  // =============================
  if (finalAmount !== this.count) {
    this.count = finalAmount;

    if (finalAmount < amount) {
      this.deckService.showToast(
        this.mode === 'main'
          ? 'Se ajustó la cantidad por límite de copias.'
          : 'Se ajustó la cantidad por límite de copias.',
        'warning',
        'center'
      );
    }
  }

  // =============================
  // 🔔 TOASTS EXTRA
  // =============================
  const added = finalAmount > prevSaved;

  if (added) {
    if (this.cardData.banned) {
      this.deckService.showToast(
        'Atención: agregaste una carta BANEADA.',
        'error',
        'top'
      );
    }

    if ((this.cardData as any).isToken) {
      this.deckService.showToast(
        'Agregaste un TOKEN al mazo.',
        'info',
        'top'
      );
    }
  }

  // =============================
  // 📤 EMIT
  // =============================
  this.amountChange.emit({
    id: this.cardData.id,
    amount: finalAmount,
    mode: this.mode
  });
}

  getOtherDeckAmount(): number {
  return this.mode === 'side'
    ? this.mainAmount
    : this.sideAmount;
}

getOtherDeckLabel(): string {
  return this.mode === 'side'
    ? 'MD'
    : 'SD';
}

  getSelloImg(): string {
    const fac = this.cardData.faction?.toLowerCase();
    const file = this.selloPorFaccion[fac] ?? 'SELLO-TIERRA.png';
    return `../../../assets/SELLOS/${file}`;
  }

  showImg(): void {
    this.ImgView.emit(this.cardData.img);
  }

  onImgLoad(): void {
    this.imgLoaded = true;
  }
}
