import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Specialty } from '../../models/specialty.model';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent {
  @Input() specialty: Specialty | null = null;
}
