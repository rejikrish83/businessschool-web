import { Component, Input, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';


import { filter, map, Observable } from 'rxjs'
import { startWith, take } from 'rxjs/operators';

@Component({
  selector: 'app-small-header',
  templateUrl: './small-header.component.html',
  styleUrls: ['./small-header.component.scss']
})
export class SmallHeaderComponent {

  @Input() uName: any ='';
  userName: string = ''

  position: { value: TooltipPosition } = { value: 'above' }; // Set the initial position
  constructor(private _router: Router, private _oktaStateService: OktaAuthStateService, @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth) { }
  
  public async signOut(): Promise<void> {
    await this._oktaAuth.signOut();
  }

  public isAuthenticated$!: Observable<boolean>;
  public name$!: Observable<string>;

  
  authenticateFlag: boolean = false;
 
  public ngOnInit(): void {
    
    this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
      filter((s: AuthState) => !!s),
      map((s: AuthState) => {
        this.userName = s.idToken?.claims.name ?? '';
        console.log('ID Token Claims:', s.idToken?.claims);
        if (s.isAuthenticated){
          this.authenticateFlag = true
          this._router.navigate(['/profile']);
          return s.isAuthenticated;
        }else {
          this.authenticateFlag = false
          return false;
        }
        
      })
    );
    
   
    
    
  }
}
