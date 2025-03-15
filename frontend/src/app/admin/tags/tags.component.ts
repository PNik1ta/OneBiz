import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MATERIAL_IMPORTS } from '../../material.imports';
import { ITag } from '../../core/interfaces/tag.interface';
import { TagService } from '../../core/services/tag.service';
import { TagsDialogComponent } from './tags-dialog/tags-dialog.component';

@Component({
  standalone: true,
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  imports: [MATERIAL_IMPORTS]
})
export class TagsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<ITag>([]);

  constructor(private tagsService: TagService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    this.tagsService.getTags().subscribe(tags => {
      this.dataSource.data = tags.data ?? [];
    });
  }

  addTag(): void {
    const dialogRef = this.dialog.open(TagsDialogComponent, {
      width: '400px',
      data: { tag: null },
      height: 'auto',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadTags();
    });
  }

  editTag(tag: ITag): void {
    const dialogRef = this.dialog.open(TagsDialogComponent, {
      width: '400px',
      data: { tag },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadTags();
    });
  }

  deleteTag(id: number): void {
    if (confirm('Удалить тег?')) {
      this.tagsService.deleteTag(id).subscribe(() => this.loadTags());
    }
  }
}
