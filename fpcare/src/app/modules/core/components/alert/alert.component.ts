import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'fpcare-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() type = "warning";
  public dismissable = true;

  onClose() {
    // console.log('on close');
  }

}
