import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal,
} from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const DEMO_VAPID_PUBLIC_KEY =
  'BNimwgn6C3Po9dQrX5KEj_4RQAqkIS3dHNSzrWDLOlmSdZ-DDjCU-jiBQCuGOsE2fCLvUitYmfpDqQlWBnDYUbU';

@Component({
  selector: 'app-root',
  imports: [JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly title = signal('Angular PWA Showcase');
  readonly serviceWorkerEnabled = signal(this.swPush.isEnabled);
  readonly isOnline = signal(navigator.onLine);
  readonly isBusy = signal(false);
  readonly subscription = signal<PushSubscription | null>(null);
  readonly status = signal(
    this.swPush.isEnabled
      ? 'Service worker ready. You can enable the notification demo.'
      : 'Run the production build to activate the service worker.',
  );
  readonly notificationPermission = signal<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied',
  );

  constructor(private readonly swPush: SwPush) {
    this.swPush.subscription
      .pipe(takeUntilDestroyed())
      .subscribe((subscription) => this.subscription.set(subscription));
  }

  @HostListener('window:online')
  onOnline(): void {
    this.isOnline.set(true);
  }

  @HostListener('window:offline')
  onOffline(): void {
    this.isOnline.set(false);
  }

  async subscribeToNotifications(): Promise<void> {
    if (!this.swPush.isEnabled) {
      this.status.set('Service workers are disabled. Use npm run build:prod, then npm run preview:pwa.');
      return;
    }

    this.isBusy.set(true);
    try {
      const subscription = await this.swPush.requestSubscription({
        serverPublicKey: DEMO_VAPID_PUBLIC_KEY,
      });
      this.subscription.set(subscription);
      this.notificationPermission.set(Notification.permission);

      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Angular PWA is ready', {
        body: 'Notifications and offline caching are enabled for this demo.',
        icon: 'assets/icons/icon-192x192.png',
        badge: 'assets/icons/icon-96x96.png',
      });
      this.status.set('Notification permission granted and a push subscription was created.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown browser error';
      this.status.set(`Notification setup was not completed: ${message}`);
    } finally {
      this.isBusy.set(false);
    }
  }
}
