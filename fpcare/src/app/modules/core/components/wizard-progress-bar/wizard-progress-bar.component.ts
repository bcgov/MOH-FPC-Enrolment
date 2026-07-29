import { Component, Input } from '@angular/core';
import { WizardProgressItem } from 'moh-common-lib-angular';

@Component({
  standalone: false,
  selector: 'common-wizard-progress-bar',
  templateUrl: './wizard-progress-bar.component.html',
})
export class FpcareWizardProgressBarComponent {
  @Input() progressSteps: WizardProgressItem[] = [];
}
