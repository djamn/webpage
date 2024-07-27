import {Component, Input} from '@angular/core';

@Component({
  selector: 'footer-component',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  @Input()
  footerDataPrivacy: string = 'Data Privacy'
  @Input()
  footerImprint: string = 'Imprint'
  @Input()
  imageAlt: string = 'logo'
  @Input()
  footerImageSrc: string = '/assets/logo_black-1500h.png'
  @Input()
  footerCopyrightInformation: string = '© 2024 JaLeHD, All Rights Reserved.'
  @Input()
  rootClassName: string = ''
}
