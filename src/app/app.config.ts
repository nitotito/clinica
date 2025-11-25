import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient,withInterceptors  } from '@angular/common/http';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(), 
    provideClientHydration(),
    provideHttpClient(withInterceptors([loadingInterceptor]))
  ]
};
