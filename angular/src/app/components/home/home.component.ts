import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  userList: any;

  userArr$: any;
  apiUrl = 'http://localhost:8000/';
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/']);
    });
  }
  getUsers() {
    this.http.get(this.apiUrl + 'users').subscribe((res: any) => {
      this.userList = res;
    });
  }
}
