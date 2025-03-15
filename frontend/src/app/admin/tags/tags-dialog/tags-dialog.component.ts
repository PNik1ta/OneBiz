import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MATERIAL_IMPORTS } from '../../../material.imports';
import { TagService } from '../../../core/services/tag.service';
import { IUpdateTagDto } from '../../../core/dto/tag/update-tag.dto';
import { ICreateTagDto } from '../../../core/dto/tag/create-tag.dto';

@Component({
  standalone: true,
  selector: 'app-tags-dialog',
  templateUrl: './tags-dialog.component.html',
  styleUrls: ['./tags-dialog.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class TagsDialogComponent {
  tagsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tagService: TagService,
    public dialogRef: MatDialogRef<TagsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tagsForm = this.fb.group({
      name: [data.tag?.name || '', Validators.required]
    });
  }

  // Метод сохранения пользователя
  saveTag(): void {
    if (this.tagsForm.invalid) return;

    const tagsData = this.tagsForm.value;
    this.saveOrUpdateTag(tagsData)
  }

  private saveOrUpdateTag(tagData: any): void {
    if (this.data.tag) {
      const dto: IUpdateTagDto = {
        name: tagData.name,
      }
      this.tagService.updateTag(dto, this.data.tag.id).subscribe(() => this.dialogRef.close(true));
    } else {
      const dto: ICreateTagDto = {
        name: tagData.name,
      }
      this.tagService.createTag(dto).subscribe(() => this.dialogRef.close(true));
    }
  }
}
