import {Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = 'assets/config.json';
  private config: any;

  constructor(readonly http: HttpClient) {
  }

  loadConfig(): Observable<any> {
    return this.http.get<any>('assets/config.json').pipe(
      map(config => {
        this.config = config;
        return config;
      })
    );
  }

  setConfig(config: any): void {
    this.config = config;
  }

  getConfig(): any {
    return this.config;
  }
}
