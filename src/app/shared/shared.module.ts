import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HeaderBeforeSigninComponent } from './header-before-signin/header-before-signin.component';
import { HeaderAfterSigninComponent } from './header-after-signin/header-after-signin.component';
import { FooterComponent } from './footer/footer.component';
import { UserPageComponent } from './user-page/user-page.component';

@NgModule({
  declarations: [
    // These components are already declared in AppModule, so we don't redeclare them here
    HeaderBeforeSigninComponent,
    HeaderAfterSigninComponent,
    FooterComponent,
    UserPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderBeforeSigninComponent,
    HeaderAfterSigninComponent,
    FooterComponent,
    UserPageComponent
  ]
})
export class SharedModule { }