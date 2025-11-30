// src/app/components/cards/cards.component.ts
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
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
  @Input() mode: 'main' | 'side' = 'main';
  @Output() ImgView = new EventEmitter<string>();
  @Output() amountChange = new EventEmitter<{
    id: string;
    amount: number;
    mode: 'main' | 'side';
  }>();

  public count = 0;
  private saveSubject = new Subject<number>();
  private sub?: Subscription;

  private rarityLimits: Record<string, number> = {
    common: 4,
    rare: 3,
    epic: 2,
    legendary: 1
  };

  public selloPorFaccion: Record<string, string> = {
  jupiter: 'SELLO-JUPITER.png',
  marte: 'SELLO-MARTE.png',
  pluton: 'SELLO-PLUTON.png',
  saturno: 'SELLO-SATURNO.png',
  tierra: 'SELLO-TIERRA.png',
  neptuno: 'SELLO-NEPTUNO.png'
};

getSelloImg(): string {
  const fac = this.cardData.faction?.toLowerCase();
  const file = this.selloPorFaccion[fac] ?? 'SELLO-TIERRA.png';
  return `../../../assets/SELLOS/${file}`;
}


  constructor(private deckService: DecksCardsService) {
    addIcons({ 'remove': removeOutline, 'add': addOutline });
  }

  ngOnInit(): void {
    this.count = this.initialCount;

    // debounced save: cuando emite, intentamos persistir y usamos lo que el servicio retorna
    this.sub = this.saveSubject
      .pipe(debounceTime(300))
      .subscribe(async (amount) => {
        await this.attemptSave(amount);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialCount'] && changes['initialCount'].currentValue !== undefined) {
      this.count = changes['initialCount'].currentValue;
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** Incremento local optimista; validaciones rápidas antes de incrementar */
  async increase(): Promise<void> {
    if (!this.deckId) return;

    // límite por rareza (local)
    const maxRarity = this.rarityLimits[this.cardData.rarity ?? 'common'] ?? 4;
    if (this.count >= maxRarity) return;

    // chequeo rápido del tope del deck/side (para evitar increments inútiles)
    const mode = this.mode;
    const totalNow = mode === 'main'
      ? await this.deckService.getTotalCardsCountInMain(this.deckId)
      : await this.deckService.getTotalCardsCountInSide(this.deckId);

    const cap = mode === 'main' ? 40 : 15;
    if (totalNow >= cap) {
      // ya está lleno
      this.presentAlert(mode === 'main' ? 'El mazo principal ya está completo.' : 'El Side Deck ya está completo.');
      return;
    }

    // todo ok -> incremento optimista local y programo guardado
    this.count++;
    this.saveSubject.next(this.count);
  }

  decrease(): void {
    if (this.count > 0) {
      this.count--;
      this.saveSubject.next(this.count);
    }
  }

  /** intenta persistir y ajusta `this.count` al valor real guardado (retornado por el servicio) */
  private async attemptSave(amount: number): Promise<void> {
    if (!this.deckId) return;

    const deckCard: DeckCard = {
      id: this.cardData.id,
      faction: this.cardData.faction,
      amount: amount
    };

    // servicio ahora devuelve la cantidad final guardada para esa carta
    const savedAmount = await this.deckService.upsertCardInDeck(this.deckId, deckCard, this.mode);

    // si el servicio recortó o modificó la cantidad, sincronizamos
    if (savedAmount !== this.count) {
      // actualizar contador local al valor REAL
      this.count = savedAmount;

      // notificar al usuario si hubo recorte (por tope)
      if (savedAmount < amount) {
        const capMsg = this.mode === 'main'
          ? 'Se alcanzó el límite del mazo principal. Cantidad ajustada.'
          : 'Se alcanzó el límite del Side Deck. Cantidad ajustada.';
        this.presentAlert(capMsg);
      }
    }

    // notifico al padre (UI: sidebar, totales, etc) con la cantidad real
    this.amountChange.emit({
      id: this.cardData.id,
      amount: this.count,
      mode: this.mode
    });
  }

  showImg(): void {
    this.ImgView.emit(this.cardData.img);
  }

  async presentAlert(message: string) {
    const alert = document.createElement('ion-alert');
    alert.header = 'Aviso';
    alert.message = message;
    alert.buttons = ['OK'];
    document.body.appendChild(alert);
    await alert.present();
  }

}
