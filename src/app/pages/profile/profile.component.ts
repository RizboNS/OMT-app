import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  id!: string;
  user!: User;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initUserId();
    this.initUser();
  }
  initUserId() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }
  initUser() {
    this.userService.getUser(this.id).subscribe((data: User) => {
      this.user = data;
    });
  }
}
