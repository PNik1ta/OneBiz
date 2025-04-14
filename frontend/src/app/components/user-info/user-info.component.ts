import { Component, Input } from '@angular/core';
import { IUser } from '../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { API_IMG_URL } from '../../core/constants/api-url';
import { FileService } from '../../core/services/file.service';
import { UsersService } from '../../core/services/users.service';
import { IUpdateUserDto } from '../../core/dto/user/update-user.dto';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-info',
  imports: [CommonModule, MatIconModule, FormsModule, MatInputModule, MatButtonModule],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss'
})
export class UserInfoComponent {
  @Input() user: IUser | null = null;
  API_IMG_URL = API_IMG_URL;

  isEditingUsername = false;
  updatedUsername: string = '';

  isEditingPhone = false;
  updatedPhone: string = '';

  constructor(
    private userService: UsersService,
    private fileService: FileService
  ) {}

  onAvatarClick(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      this.fileService.uploadFile(file).subscribe(res => {
        const url = res[0].url;

        const dto: IUpdateUserDto = {
          avatar_url: url,
        };

        this.userService.updateUser(dto).subscribe(() => {

          if (this.user) {
            this.user.avatar_url = url;
          }

          this.userService.emitUserUpdated();
        });
      });
    };

    input.click();
  }

  startEditingUsername(): void {
    this.updatedUsername = this.user?.username || '';
    this.isEditingUsername = true;
  }

  startEditingPhone(): void {
    this.updatedPhone = this.user?.phone || '';
    this.isEditingPhone = true;
  }

  saveUsername(): void {
    const dto: IUpdateUserDto = {
      username: this.updatedUsername,
    };

    this.userService.updateUser(dto).subscribe(() => {
      if (this.user) {
        this.user.username = this.updatedUsername;
      }
      this.isEditingUsername = false;
    });
  }

  savePhone(): void {
    const dto: IUpdateUserDto = {
      phone: this.updatedPhone,
    };

    this.userService.updateUser(dto).subscribe(() => {
      if (this.user) {
        this.user.phone = this.updatedPhone;
      }
      this.isEditingPhone = false;
    });
  }
}
