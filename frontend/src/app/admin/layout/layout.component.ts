import { Component } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.imports';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: MATERIAL_IMPORTS, // ✅ Используем список модулей
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {}
