import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../../core/services/category.service';
import {
  Category,
  SeedCategoriesResponse,
} from '../../../core/models/category.models';
import { CategoryFormComponent } from '../category-form/category-form.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns: string[] = [
    'icon',
    'name',
    'color',
    'transactions',
    'actions',
  ];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: categories => {
        this.categories = categories;
      },
      error: () => {
        this.snackBar.open('Failed to load categories', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  openCategoryForm(category?: Category) {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '400px',
      data: category,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  deleteCategory(category: Category) {
    if (confirm(`Delete category "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.snackBar.open('Category deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadCategories();
        },
        error: () => {
          this.snackBar.open('Failed to delete category', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }

  seedCategories() {
    this.categoryService.seedDefaultCategories().subscribe({
      next: (result: SeedCategoriesResponse) => {
        this.snackBar.open(result.message, 'Close', { duration: 3000 });
        this.loadCategories();
      },
      error: () => {
        this.snackBar.open('Failed to seed categories', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
