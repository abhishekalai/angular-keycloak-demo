import { Injectable } from '@angular/core';
import { AuthConfig, NullValidationHandler, OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';

export interface IAccessTokenContents {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string[];
  sub: string;
  typ: string;
  azp: string;
  nonce: string;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: RealmAccess;
  resource_access: Resourceaccess;
  scope: string;
  email_verified: boolean;
  preferred_username: string;
}

interface Resourceaccess {
  'master-realm': RealmAccess;
  account: RealmAccess;
}

interface RealmAccess {
  roles: string[];
}


@Injectable()
export class AuthConfigService {

    private _decodedAccessToken: any;
    private _decodedIDToken: any;
    get decodedAccessToken() { return this._decodedAccessToken; }
    get decodedIDToken() { return this._decodedIDToken; }

    constructor(
      private readonly oauthService: OAuthService,
      private readonly authConfig: AuthConfig
    ) {}

    async initAuth(): Promise<void> {
      return new Promise((resolve, reject) => {
        // setup oauthService
        this.oauthService.configure(this.authConfig);
        this.oauthService.setStorage(localStorage);
        this.oauthService.tokenValidationHandler = new NullValidationHandler();

        // subscribe to token events
        this.oauthService.events
          .pipe(filter((e: any) => {
            return e.type === 'token_received';
          }))
          .subscribe(() => this.handleNewToken());

        // continue initializing app or redirect to login-page

        this.oauthService.loadDiscoveryDocumentAndLogin().then(isLoggedIn => {
          if (isLoggedIn) {
            this.oauthService.setupAutomaticSilentRefresh();
            resolve();
          } else {
            this.oauthService.initImplicitFlow();
            reject();
          }
        });

      });
    }

    private handleNewToken() {
      this._decodedAccessToken = this.oauthService.getAccessToken();
      this._decodedIDToken = this.oauthService.getIdToken();
      this.oauthService.processIdToken(this._decodedIDToken, this._decodedAccessToken).then(_ => {});
    }

    public getAccessTokenContents(): IAccessTokenContents {
      const token = this.oauthService.getAccessToken();
      return JSON.parse(window.atob(token.split('.')[1]));
    }
}
