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
import { ButtonComponent } from '../button/button.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateBusinessComponent } from '../create-business/create-business.component';
import { ServiceService } from '../../core/services/service.service';
import { IService } from '../../core/interfaces/service.interface';
import { ServiceCardComponent } from '../service-card/service-card.component';
import { CreateServiceComponent } from '../create-service/create-service.component';
import { CityService } from '../../core/services/city.service';
import { ICity } from '../../core/interfaces/city.interface';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { BookingService } from '../../core/services/booking.service';
import { PostService } from '../../core/services/post.service';


@Component({
  selector: 'app-business-info',
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ButtonComponent,
    MatDialogModule,
    ServiceCardComponent,
    NgxChartsModule,
  ],
  templateUrl: './business-info.component.html',
  styleUrl: './business-info.component.scss'
})
export class BusinessInfoComponent implements OnInit {
  @Input() user: IUser | null = null
  business: IBusiness | null = null
  services: IService[] = []
  cities: ICity[] = []
  revenueChart: any[] = []
  bookingChart: any[] = []
  likesChart: any[] = []

  colorScheme = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#0580b570', '#3949AB70', '#FFFFFF', '#FFFFFF']
  };

  API_IMG_URL = API_IMG_URL;

  isEditingUsername = false;
  updatedUsername: string = '';

  isEditingPhone = false;
  updatedPhone: string = '';
  cityName: string = '';

  constructor(
    private userService: UsersService,
    private fileService: FileService,
    private businessService: BusinessService,
    private serviceService: ServiceService,
    private cityService: CityService,
    private dialog: MatDialog,
    private bookingService: BookingService,
    private postService: PostService,
  ) { }

  ngOnInit(): void {

    this.businessService.getUserBusiness().subscribe((res) => {
      this.business = res.data ?? null;

      if (this.business) {
        // Загружаем услуги
        this.serviceService.getServiceByBusinessId(this.business.id!).subscribe((res) => {
          this.services = res.data ?? [];
        });

        // Загружаем города и имя города бизнеса
        this.cityService.getCities().subscribe((res) => {
          this.cities = res.data ?? [];
          this.cityName = this.cities.find((el) => el.id === this.business?.city_id)?.name ?? '';
        });

        // Загружаем бронирования и считаем аналитику
        this.bookingService.getBookingsByBusinessId(this.business.id!).subscribe((res) => {
          const bookings = res.data ?? [];

          const revenueMap: { [date: string]: number } = {};
          const bookingCountMap: { [date: string]: number } = {};

          // Собираем данные по датам
          bookings.forEach((booking) => {
            const rawDate = booking?.datetime;
            if (!rawDate) return;

            const date = new Date(rawDate).toISOString().split('T')[0]; // Пример: 2025-04-07

            revenueMap[date] = (revenueMap[date] || 0) + (booking.amount || 0);
            bookingCountMap[date] = (bookingCountMap[date] || 0) + 1;
          });

          const formatDateString = (raw: string): string => {
            const date = new Date(raw);
            if (isNaN(date.getTime())) return 'Неверная дата';
            return `${date.getFullYear()}-${(date.getMonth() + 1)
              .toString()
              .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          };

          this.revenueChart = [
            {
              name: 'Прибыль',
              series: Object.entries(revenueMap).map(([dateString, value]) => ({
                name: formatDateString(dateString) + '', // строго строка!
                value: Number(value) || 0,
              })),
            },
          ];

          this.bookingChart = [
            {
              name: 'Заявки',
              series: Object.entries(bookingCountMap).map(([dateString, value]) => ({
                name: formatDateString(dateString) + '', // строго строка!
                value: Number(value) || 0,
              })),
            },
          ];


          console.log('REVENUE: ', this.revenueChart);
          console.log('BOOKING: ', this.bookingChart);
        });

        this.postService.getPostByBusinessId(this.business.id!).subscribe((res) => {
          const posts = res.data ?? [];
          console.log(posts);


          this.likesChart = posts.map((post: any) => ({
            name: post.title || 'Без названия',
            value: post.likes || 0, // или post.likesCount если поле другое
          }));

          console.log('LIKES CHART:', this.likesChart);
        });

      }


    });


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
