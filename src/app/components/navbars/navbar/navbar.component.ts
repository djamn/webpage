import {Component, Input} from '@angular/core'
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class Navbar {
  @Input()
  rootClassName: string = ''
  @Input()
  navbarLinkAbout: string = 'About'
  @Input()
  navbarLogoSrc: string = '/assets/logo_black-1500h.png'
  @Input()
  navbarButtonLogin: string = 'Login'
  @Input()
  navbarLinkBikeStations: string = 'Bike Stations'
  @Input()
  navbarButtonRegister: string = 'Register'
  selectedLang: string = 'de';
  selectedCityName: string = 'Vilnius'

  cities3 = [
    {id: 1, name: 'Vilnius', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
    {id: 2, name: 'Kaunas', avatar: '//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15'},
    {id: 3, name: 'Pavilnys', avatar: '//www.gravatar.com/avatar/6acb7abf486516ab7fb0a6efa372042b?d=retro&r=g&s=15'}
  ];

  constructor(public translate: TranslateService) {
  }
}
