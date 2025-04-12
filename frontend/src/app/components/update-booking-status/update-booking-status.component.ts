import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { EBookingStatuses } from '../../core/enums/booking-statuses.enum';

@Component({
  selector: 'app-update-booking-status',
  imports: [CommonModule, MatDialogModule, FormsModule, MatSelectModule, MatButtonModule],
  templateUrl: './update-booking-status.component.html',
  styleUrl: './update-booking-status.component.scss'
})
export class UpdateBookingStatusComponent {
  statuses = Object.values(EBookingStatuses);
  selectedStatus: EBookingStatuses;

  constructor(
    public dialogRef: MatDialogRef<UpdateBookingStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentStatus: EBookingStatuses }
  ) {
    this.selectedStatus = data.currentStatus;
  }

  confirm() {
    this.dialogRef.close(this.selectedStatus);
  }
}
