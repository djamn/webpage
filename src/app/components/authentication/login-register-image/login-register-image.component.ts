import {Component, OnInit} from '@angular/core';
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'login-register-image-component',
  templateUrl: './login-register-image.component.html',
  styleUrl: './login-register-image.component.css'
})
export class LoginRegisterImageComponent implements OnInit {
  config: any;

  constructor(readonly configService: ConfigService) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig();
  }
}
