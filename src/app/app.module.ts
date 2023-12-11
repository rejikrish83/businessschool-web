import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { environment } from 'src/environments/environment';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { SmallHeaderComponent } from './small-header/small-header.component'; // Add this module
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { SmallFooterComponent } from './small-footer/small-footer.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { ApiService } from './apiService/api-service';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';


const oktaAuth = new OktaAuth({
  issuer: 'https://dev-41891240.okta.com/oauth2/default',
  clientId: '0oadnnucz42aQSm9g5d7',
  redirectUri: 'http://localhost:4200/login/callback'
});

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,SmallHeaderComponent, SmallFooterComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    OktaAuthModule.forRoot({ oktaAuth }),
    HttpClientModule,
    MatInputModule, 
    MatButtonModule, 
    BrowserAnimationsModule, 
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTooltipModule,
    MatCardModule,
    MatDividerModule,
    AppRoutingModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatMenuModule
  ],
  providers: [DatePipe,ApiService,{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }




