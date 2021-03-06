import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-kc';

  constructor(private oauthService: OAuthService) {}

  logout() {
    this.oauthService.logOut();
  }
}
