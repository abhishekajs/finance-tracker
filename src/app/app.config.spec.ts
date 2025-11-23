import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

export const testConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    provideHttpClient(),
    provideAnimationsAsync(),
    importProvidersFrom(MatSnackBarModule, NoopAnimationsModule),
  ],
};
