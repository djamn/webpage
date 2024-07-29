import {Component, OnInit} from '@angular/core';
import {ConfigService} from "../../services/config.service";

@Component({
  selector: 'footer-component',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  config: any;
  currentYear: number = new Date().getFullYear();

  constructor(private configService: ConfigService) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig();
  }
}
