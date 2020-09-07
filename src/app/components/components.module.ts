import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material/material.module';
import { RefreshTokenComponent } from './refresh-token/refresh-token.component';



@NgModule({
  declarations: [HomeComponent, AboutComponent, ContactComponent, LoginComponent, RefreshTokenComponent],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class ComponentsModule { }
