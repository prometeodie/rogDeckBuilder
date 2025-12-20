import { Component, inject, OnInit } from '@angular/core';
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

async uploadDeck() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.style.display = 'none';

  document.body.appendChild(input);

  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) {
      document.body.removeChild(input);
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text);

        // validación mínima
        if (!parsed || !parsed.id || !parsed.cards) {
          throw new Error('Archivo de mazo inválido');
        }

        await this.decksService.saveImportedDeck(parsed);
        await this.loadDecks();

        console.log('Mazo importado correctamente');
      } catch (err) {
        console.error('Error al importar el mazo', err);
      } finally {
        document.body.removeChild(input);
      }
    };

    reader.onerror = () => {
      console.error('Error leyendo el archivo');
      document.body.removeChild(input);
    };

    reader.readAsText(file);
  };

  input.click();
}



}
