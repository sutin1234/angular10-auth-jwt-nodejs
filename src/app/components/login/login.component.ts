import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  users: any;
  isLogin = false;
  constructor(private auth: AuthService, private router: Router) {
    this.users = { username: '', password: '' };
  }

  ngOnInit(): void {
  }
  // tslint:disable-next-line: typedef
  onSubmit() {
    if (this.users?.username && this.users?.password) {
      this.auth.login(this.users).subscribe(success => {
        if (success) {
          this.router.navigate(['/home']);
        }
      });
    }
  }
  onClear(): void {
    this.users = {};
  }

}
