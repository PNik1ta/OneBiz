import { Component, Input, OnInit } from '@angular/core';
import { IUser } from '../../core/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { API_IMG_URL } from '../../core/constants/api-url';
import { IUpdateUserDto } from '../../core/dto/user/update-user.dto';
import { FileService } from '../../core/services/file.service';
import { UsersService } from '../../core/services/users.service';
import { IBusiness } from '../../core/interfaces/business.interface';
import { BusinessService } from '../../core/services/business.service';
import { BusinessesComponent } from "../../admin/business/business.component";
import { ButtonComponent } from '../button/button.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateBusinessComponent } from '../create-business/create-business.component';
import { ServiceService } from '../../core/services/service.service';
import { IService } from '../../core/interfaces/service.interface';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { CreateServiceComponent } from '../create-service/create-service.component';

@Component({
  selector: 'app-business-info',
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    BusinessesComponent,
    ButtonComponent,
    MatDialogModule,
    ServiceCardComponent
  ],
  templateUrl: './business-info.component.html',
  styleUrl: './business-info.component.scss'
})
export class BusinessInfoComponent implements OnInit {
  @Input() user: IUser | null = null
  business: IBusiness | null = null
  services: IService[] = []

  API_IMG_URL = API_IMG_URL;

  isEditingUsername = false;
  updatedUsername: string = '';

  constructor(
    private userService: UsersService,
    private fileService: FileService,
    private businessService: BusinessService,
    private serviceService: ServiceService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.businessService.getUserBusiness().subscribe((res) => {
      this.business = res.data ?? null;

      if (this.business) {
        this.serviceService.getServiceByBusinessId(this.business.id!).subscribe((res) => {
          this.services = res.data ?? []
        })

      }
    })
  }

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
        });
      });
    };

    input.click();
  }

  startEditingUsername(): void {
    this.updatedUsername = this.user?.username || '';
    this.isEditingUsername = true;
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

  onCreateBusiness() {
    const dialogRef = this.dialog.open(CreateBusinessComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.businessService.getUserBusiness().subscribe((res) => {
        this.business = res.data ?? null;
      })
    });
  }

  onCreateService() {
    const dialogRef = this.dialog.open(CreateServiceComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(() => {
      if (this.business) {
        this.serviceService.getServiceByBusinessId(this.business.id!).subscribe((res) => {
          this.services = res.data ?? [];
        })
      }
    });
  }
}
