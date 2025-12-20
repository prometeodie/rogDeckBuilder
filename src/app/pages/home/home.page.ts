import { ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon,  IonFab, IonFabButton, IonFabList } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';

import { UserIdentityComponent } from 'src/app/components/user-identity/user-identity.component';
import { UserIdentityData } from 'src/app/interfaces/user.interface';
import { User } from 'src/app/services/user';

import { DecksComponent } from 'src/app/components/decks/decks.component';
import { Deck } from 'src/app/interfaces/deck.interface';
import { DecksCardsService } from 'src/app/services/decks-cards';
import { addIcons } from 'ionicons';
import { addOutline, cloudUploadOutline, createOutline } from 'ionicons/icons';
import { RogLogoComponent } from "src/app/components/rog-logo/rog-logo.component";
import { NewUploadDeckBtnComponent } from "src/app/components/new-upload-deck-btn/new-upload-deck-btn.component";
import { AnimationComponent } from 'src/app/components/animation/animation.component';

@Component({
  selector: 'home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
    CommonModule,
    FormsModule,
    RouterModule,
    UserIdentityComponent,
    DecksComponent,
    RogLogoComponent,
    NewUploadDeckBtnComponent,
    AnimationComponent
]
})
export class HomePage implements OnInit {

  private userService = inject(User);
  private decksService = inject(DecksCardsService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);


  public showUserModal: boolean = false;
  public identity: UserIdentityData | null = null;
  public decks: Deck[] = [];
  public showSplash: boolean = false;

  constructor() {
      addIcons({
        'create-outline': createOutline,
        'cloud-upload-outline': cloudUploadOutline,
        'add-outline': addOutline
      });
    }

  async ngOnInit() {
    this.showSplash = true;
    this.identity = await this.userService.getUserIdentity();

    if (!this.identity) {
      this.showUserModal = true;
    }

    await this.loadDecks();
  }

  ngAfterViewInit() {
  setTimeout(() => {
    this.showSplash = false;
  }, 4000);
}

  async ionViewWillEnter() {
    await this.loadDecks();
  }

  async loadDecks() {
    this.decks = await this.decksService.getDecks();
  }

  async getIdentity() {
    this.identity = await this.userService.getUserIdentity();
  }

  async onIdentitySaved() {
    this.showUserModal = false;
    this.getIdentity();
  }

  async editIdentity() {
    this.showUserModal = true;
    this.getIdentity();
  }

  async createNewDeck() {
  const newDeck = await this.decksService.addDeck();
  this.router.navigate(['/deckbuilder', newDeck.id]);
}

private zone = inject(NgZone);

async uploadDeck() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed || !parsed.cards || !parsed.name) {
        throw new Error('Archivo de mazo inválido');
      }

      await this.decksService.saveImportedDeck(parsed);

      // 🔴 clave: volver a asignar referencia
      this.decks = [...await this.decksService.getDecks()];

      // 🔴 forzar actualización visual
      this.cdr.detectChanges();

    } catch (error) {
      console.error('Error al importar el mazo', error);
    }
  };

  input.click();
}

}
