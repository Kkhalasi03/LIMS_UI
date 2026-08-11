import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavBarComponent } from './sidenav-bar/sidenav-bar.component';
import { GlobalErrorComponent } from "./Module/account/global-error/global-error.component";
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlobalErrorComponent],
  template: '<router-outlet><app-global-error>',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'LIMS';
  username: string | null = null;// know the user

  ngAfterViewInit() {
    // Retrieve the username from localStorage or sessionStorage
    console.log('Is SessionStorage accessible:', sessionStorage ? true : false);
    const savedLoginData = sessionStorage.getItem('loginData');
    console.log('Raw loginData from localStorage:', savedLoginData);
    if (savedLoginData) {
      const parsedData = JSON.parse(savedLoginData);  // Parse JSON
      this.username = parsedData.UserName;  // Extract UserName
      console.log('Retrieved username:', this.username);
    } else {
      console.log('No user data found in localStorage');
    }
 }
}
