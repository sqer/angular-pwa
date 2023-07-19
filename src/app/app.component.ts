import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pwa-notification-frontend';

  subscription: PushSubscription | undefined;

  constructor(private readonly swPush: SwPush) {

  }

  subscribeToNotifications(): void {
    this.swPush
      .requestSubscription({
        serverPublicKey: 'BNimwgn6C3Po9dQrX5KEj_4RQAqkIS3dHNSzrWDLOlmSdZ-DDjCU-jiBQCuGOsE2fCLvUitYmfpDqQlWBnDYUbU'
      })
      .then((sub) => this.subscription = sub)
      .then(() => {
        console.info('Subscribed to server');
        navigator.serviceWorker.getRegistration().then((reg) => {
          if (reg != null) {
            reg.showNotification('Push notification activated');
          }
        });
      })
      .catch((err) => console.error('Could not subscribe to notifications', err));
  }

}
