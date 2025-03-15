import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IUser } from '../../core/interfaces/user.interface';
import { UsersService } from '../../core/services/users.service';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { UserDialogComponent } from './users-dialog/users-dialog.component';

@Component({
  standalone: true,
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'email', 'role', 'created_at', 'actions'];
  dataSource = new MatTableDataSource<IUser>([]);

  constructor(private userService: UsersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.dataSource.data = users.data ?? [];
    });
  }

  addUser(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user: null },
      height: 'auto',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

  editUser(user: IUser): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: { user },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

  deleteUser(id: number): void {
    if (confirm('Удалить пользователя?')) {
      this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }
}
