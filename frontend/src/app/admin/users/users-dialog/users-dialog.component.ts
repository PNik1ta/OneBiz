import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';
import { FileService } from '../../../core/services/file.service';
import { IFileResponse } from '../../../core/interfaces/file-response';
import { ICreateUserDto } from '../../../core/dto/user/create-user.dto';
import { IUpdateUserDto } from '../../../core/dto/user/update-user.dto';
import { MATERIAL_IMPORTS } from '../../../material.imports';
import { API_IMG_URL, API_URL } from '../../../core/constants/api-url';

@Component({
  standalone: true,
  selector: 'app-user-dialog',
  templateUrl: './users-dialog.component.html',
  styleUrls: ['./users-dialog.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class UserDialogComponent {
  userForm: FormGroup;
  selectedFile: File | null = null;
  avatarPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private fileService: FileService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      username: [data.user?.username || '', Validators.required],
      email: [data.user?.email || '', [Validators.required, Validators.email]],
      password: [data.user?.password_hash || '', Validators.required],
      role: [data.user?.role || 'USER', Validators.required],
      avatar_url: [data.user?.avatar_url || '']
    });

    // Если у пользователя уже есть аватар, показать превью
    if (data.user?.avatar_url) {
      this.avatarPreview = `${API_IMG_URL}/${data.user.avatar_url}`;
    }
  }

  // Метод для обработки выбора файла
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      // Генерируем превью
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Метод сохранения пользователя
  saveUser(): void {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;

    if (this.selectedFile) {
      // Если есть новый аватар, сначала загружаем его
      this.fileService.uploadFile(this.selectedFile).subscribe({
        next: (res: IFileResponse[]) => {
          if (res.length > 0) {
            userData.avatar_url = res[0].url; // Сохраняем URL загруженного файла
          }
          this.saveOrUpdateUser(userData);
        },
        error: (err) => {
          console.error('Ошибка загрузки файла:', err);
        }
      });
    } else {
      this.saveOrUpdateUser(userData);
    }
  }

  private saveOrUpdateUser(userData: any): void {
    if (this.data.user) {
      const dto: IUpdateUserDto = {
        username: userData.username,
        avatar_url: userData.avatar_url,
      }
      this.userService.updateUser(dto).subscribe(() => this.dialogRef.close(true));
    } else {
      const dto: ICreateUserDto = {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        avatar_url: userData.avatar_url,
        role: userData.role,
      }
      this.userService.createUser(dto).subscribe(() => this.dialogRef.close(true));
    }
  }
}
