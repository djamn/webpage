import {Component, OnInit} from '@angular/core';
import {ConfigService} from "../../services/config.service";
import Build from "../../../build";
import {faInstagram, faLinkedin, faYoutube} from "@fortawesome/free-brands-svg-icons";

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

  protected readonly build = Build;
  protected readonly faLinkedin = faLinkedin;
  protected readonly faYoutube = faYoutube;
  protected readonly faInstagram = faInstagram;
}
