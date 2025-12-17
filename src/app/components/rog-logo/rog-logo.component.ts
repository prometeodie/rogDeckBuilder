import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'rog-logo',
  templateUrl: './rog-logo.component.html',
  styleUrls: ['./rog-logo.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class RogLogoComponent  implements OnInit {

  @Input() hasExtraLogoClasses!: boolean;

  constructor() { }

  ngOnInit() {}

}
