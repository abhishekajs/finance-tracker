import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../../core/services/category.service';
import {
  Category,
  DEFAULT_CATEGORY_ICONS,
  DEFAULT_CATEGORY_COLORS,
} from '../../../core/models/category.models';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode = false;
  availableIcons = DEFAULT_CATEGORY_ICONS;
  availableColors = DEFAULT_CATEGORY_COLORS;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category
  ) {
    this.isEditMode = !!data;
    this.categoryForm = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.minLength(2)]],
      color: [data?.color || '#3f51b5', Validators.required],
      icon: [data?.icon || 'category', Validators.required],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.value;

      if (this.isEditMode) {
        this.categoryService.updateCategory(this.data.id, formData).subscribe({
          next: () => {
            this.snackBar.open('Category updated successfully', 'Close', {
              duration: 3000,
            });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Failed to update category', 'Close', {
              duration: 3000,
            });
          },
        });
      } else {
        this.categoryService.createCategory(formData).subscribe({
          next: () => {
            this.snackBar.open('Category created successfully', 'Close', {
              duration: 3000,
            });
            this.dialogRef.close(true);
          },
          error: () => {
            this.snackBar.open('Failed to create category', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    }
  }

  selectColor(color: string) {
    this.categoryForm.patchValue({ color });
  }

  selectIcon(icon: string) {
    this.categoryForm.patchValue({ icon });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
