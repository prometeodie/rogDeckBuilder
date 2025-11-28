import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss'],
  standalone: true
})
export class ImageViewerComponent  implements OnInit {
  @Input() img!: string;
  @Output() closeViewer = new EventEmitter<void>();


  ngOnInit() {}

  close(){
    this.closeViewer.emit();
  }

}
