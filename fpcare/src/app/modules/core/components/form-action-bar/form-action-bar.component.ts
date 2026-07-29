import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: false,
  selector: 'common-form-action-bar',
  templateUrl: './form-action-bar.component.html',
  styleUrls: ['./form-action-bar.component.scss'],
})
export class FpcareFormActionBarComponent {
  @Input() submitLabel = 'Continue';
  @Input() canContinue = true;
  @Input() defaultColor = true;
  @Input() isLoading = false;

  @Output() btnClick = new EventEmitter<void>();

  onClick(): void {
    this.btnClick.emit();
  }
}
