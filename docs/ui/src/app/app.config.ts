import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  MAT_PAGINATOR_DEFAULT_OPTIONS,
  MatPaginatorDefaultOptions,
} from '@angular/material/paginator';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';

const DEFAULT_PAGINATOR_OPTIONS: MatPaginatorDefaultOptions = {
  pageSizeOptions: [10, 20, 50, 100],
  showFirstLastButtons: true,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(routes),
    provideToastr(),
    { provide: MAT_PAGINATOR_DEFAULT_OPTIONS, useValue: DEFAULT_PAGINATOR_OPTIONS },
  ],
};
