import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonIcon} from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { UserIdentityComponent } from 'src/app/components/user-identity/user-identity.component';
import { UserIdentityData } from 'src/app/interfaces/user.interface';
import { User } from 'src/app/services/user';
import { DecksComponent } from 'src/app/components/decks/decks.component';

@Component({
  selector: 'home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [ IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, CommonModule, FormsModule, RouterModule, UserIdentityComponent, CommonModule, DecksComponent, IonIcon]
})
export class HomePage implements OnInit {

  private userService = inject(User);

  public showUserModal: boolean = false;
  public identity: UserIdentityData | null = null;

  async ngOnInit() {
    this.identity = await this.userService.getUserIdentity();
    if (!this.identity) {
      this.showUserModal = true;
    }
  }

  async getIdentity(){
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
}
