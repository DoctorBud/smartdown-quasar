import { Platform } from 'quasar';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

export default async () => {
  await SplashScreen.hide();

  window.addEventListener('statusTap', () => {
    console.log('StatusBar tapped');
  });

  if (Platform.is.capacitor) {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.hide();
  }
};
