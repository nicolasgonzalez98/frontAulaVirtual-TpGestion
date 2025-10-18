import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private loading = false;
  private loaded = false;
  private callbacks: (() => void)[] = [];

  load(callback: () => void): void {
    if (this.loaded) {
      callback();
      return;
    }

    this.callbacks.push(callback);

    if (this.loading) return;
    this.loading = true;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places&region=AR&language=es`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      this.loaded = true;
      this.loading = false;
      this.callbacks.forEach(cb => cb());
      this.callbacks = [];
    };

    script.onerror = () => {
      console.error('❌ Error al cargar Google Maps API.');
      this.loading = false;
    };

    document.head.appendChild(script);
  }
}
