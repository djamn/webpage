import {Component} from '@angular/core';
import {isControlInvalid} from "../../utility/form-utils";

@Component({
  selector: 'changelog-component',
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.css'
})
export class ChangelogComponent {
  loading: boolean = true;

  changelog = [
    {
      date: '2024-09-15',
      version: '1.0.0',
      changes: [
        'Added new user profile page with advanced editing features sxdfddlsabfndksj dsfndjsnfvdsr',
        'Improved performance on the dashboard',
        'Fixed bug with date picker on the forms page'
      ]
    },
    {
      date: '2024-09-10',
      version: '1.0.0',
      changes: [
        'Updated the landing page design',
        'Integrated payment gateway for premium users',
        'Fixed issue with notification system'
      ]
    },
    {
      date: '2024-09-01',
      version: '1.0.0',
      changes: [
        'Released initial version of the application',
      ]
    }
  ];
  protected readonly isControlInvalid = isControlInvalid;
}
