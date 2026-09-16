import { Component, OnChanges } from '@angular/core';

@Component({
  standalone: false,
  selector: 'fpcare-demo-page',
  templateUrl: './demo-page.component.html',
  styleUrls: ['./demo-page.component.scss']
})
export class DemoPageComponent implements OnChanges {

  ngOnChanges(ev) {
    console.log('DemoPage, ngOnChanges', ev);
  }

}
