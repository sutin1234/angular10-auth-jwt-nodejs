import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  randomNumber: Observable<number>;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.onRandom();
  }
  onLogout(): void {
    this.auth.logout().subscribe(success => {
      if (success) {
        this.router.navigate(['/login']);
      }
    });
  }
  onRandom(): void {
    this.randomNumber = this.auth.getRandomNumber();
  }
}
