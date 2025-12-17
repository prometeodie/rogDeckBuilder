import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UserIdentityData } from 'src/app/interfaces/user.interface';
import { User } from 'src/app/services/user';
import { RogLogoComponent } from "../rog-logo/rog-logo.component";
import { ExportCard } from 'src/app/interfaces/export.card.interface';

@Component({
  selector: 'deck-export',
  templateUrl: './deck-export-component.component.html',
  styleUrls: ['./deck-export-component.component.scss'],
  standalone: true,
  imports: [CommonModule, RogLogoComponent]
})
export class DeckExportComponentComponent  implements OnInit, OnChanges {
  @Input() mainDeck: ExportCard[] = [];
  @Input() sideDeck: ExportCard[] = [];

  private userService = inject(User)
  public user!: UserIdentityData;
  public today = new Date();

  ngOnInit() {
    this.userService.getUserIdentity().then(user => {
    this.user = user;
  });
  }

   ngOnChanges(changes: SimpleChanges) {
    if (changes['mainDeck']?.currentValue) {
      this.mainDeck = [...this.mainDeck].sort((a, b) => b.qty - a.qty);
    }

    if (changes['sideDeck']?.currentValue) {
      this.sideDeck = [...this.sideDeck].sort((a, b) => b.qty - a.qty);
    }
  }
}
