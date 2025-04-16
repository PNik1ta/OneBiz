import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { UsersService } from '../../core/services/users.service';
import { IUser } from '../../core/interfaces/user.interface';
import { API_IMG_URL } from '../../core/constants/api-url';

@Component({
  selector: 'app-user-info-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './user-info-dialog.component.html',
  styleUrl: './user-info-dialog.component.scss'
})
export class UserInfoDialogComponent implements OnInit {
  user: IUser | null = null;
  API_IMG_URL = API_IMG_URL;
  
  constructor(
    private userService: UsersService,
    public dialogRef: MatDialogRef<UserInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number
  ) {}

  ngOnInit(): void {
    this.userService.getUser(this.data).subscribe((res) => {
      this.user = res.data ?? null;

    })
  }
}
