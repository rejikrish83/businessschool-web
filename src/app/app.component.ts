import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';
import { filter, map, Observable } from 'rxjs'
import { startWith, take } from 'rxjs/operators';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  userName: String=''
  userid:string = ''
  authenticateFlag: boolean = false;
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  loading = false;
  

  onClick(): void {
    // Set loading to true to show the spinner
    this.loading = true;

    // Simulate an asynchronous operation (e.g., an HTTP request)
    setTimeout(() => {
      // After the operation is complete, set loading back to false
      this.loading = false;
    }, 2000); // Adjust the time as needed
  }

  title = 'businessschool-web';

 
  public isAuthenticated$!: Observable<boolean>;
  public name$!: Observable<string>;

  constructor(private _router: Router, private _oktaStateService: OktaAuthStateService, @Inject(OKTA_AUTH) private _oktaAuth: OktaAuth) { }
  
  public ngOnInit(): void {
    
    this.isAuthenticated$ = this._oktaStateService.authState$.pipe(
      filter((s: AuthState) => !!s),
      map((s: AuthState) => {
        this.userName = s.idToken?.claims.name ?? '';
        this.userid = s.idToken?.claims.preferred_username ?? '';
        console.log('ID Token Claims:', s.idToken?.claims);
        if (s.isAuthenticated){
          this.authenticateFlag = true
         
          return s.isAuthenticated;
        }else {
          this.authenticateFlag = false
          return false;
        }
        
      })
    );
    this._oktaStateService.authState$.forEach(item => {
      console.log(item);
      console.log(item.isAuthenticated);
      if (item.isAuthenticated){
        this._router.navigate(['/profile', { data: item.idToken?.claims.preferred_username}]);
      }
    });
    
  }
   
    
   


  public async signIn() : Promise<void> {
    await this._oktaAuth.signInWithRedirect();
  }

  public async signOut(): Promise<void> {
    this._router.navigate(['/profile',  { data: this.userid }]);
  }

  
}
