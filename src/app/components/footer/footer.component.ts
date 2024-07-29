import {Component, Input, OnInit} from '@angular/core';
import {ConfigService} from "../../services/config.service";

@Component({
  selector: 'footer-component',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  @Input()
  footerDataPrivacy: string = 'Data Privacy'
  @Input()
  footerImprint: string = 'Imprint'
  @Input()
  footerCopyrightInformation: string = '© 2024 JaLeHD, All Rights Reserved.'
  @Input()
  rootClassName: string = ''
  config: any;
  currentYear: number = new Date().getFullYear();

  constructor(private configService: ConfigService) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig();
  }
}
