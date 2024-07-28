import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {ConfigService} from "./app/services/config.service";
import {firstValueFrom} from "rxjs";

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

export function initApp(configService: ConfigService) {
  return (): Promise<any> => {
    return firstValueFrom(configService.loadConfig());
  };
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
