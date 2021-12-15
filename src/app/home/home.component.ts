import { Component, OnInit } from '@angular/core';
import { ParsedIdToken } from 'angular-oauth2-oidc';
import { AuthConfigService, IAccessTokenContents } from '../auth-config.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  token!: IAccessTokenContents;

  constructor(
    private _authConfigService: AuthConfigService
  ) { }

  async ngOnInit() {
    this.token = this._authConfigService.getAccessTokenContents();
    console.log('--------', this.token);
  }

}
