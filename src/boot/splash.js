import { SplashScreen } from '@capacitor/splash-screen';

export default async () => {
  console.log('not hiding');
  await SplashScreen.hide();
};
