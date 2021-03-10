package com.incognito.wallet;

import android.app.Application;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import io.rumors.reactnativesettings.RNSettingsPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.nozbe.watermelondb.WatermelonDBPackage;

import java.util.List;

import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import com.facebook.react.modules.storage.ReactDatabaseSupplier;
import com.microsoft.codepush.react.CodePush;

import android.database.CursorWindow;
import java.lang.reflect.Field;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
          new ReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
              return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
              @SuppressWarnings("UnnecessaryLocalVariable")
              List<ReactPackage> packages = new PackageList(this).getPackages();
              // Packages that cannot be autolinked yet can be added manually here, for example:
              packages.add(new RNFirebaseAuthPackage());
              packages.add(new RNFirebaseDatabasePackage());
              packages.add(new RNFirebaseMessagingPackage());
              packages.add(new RNFirebaseNotificationsPackage());
              packages.add(new RNFirebaseCrashlyticsPackage());
              packages.add(new RNFirebaseAnalyticsPackage());
              packages.add(new GomobilePackage());
              packages.add(new WatermelonDBPackage());
              return packages;
            }

            @Override
            protected String getJSMainModuleName() {
              return "index";
            }

            @Override
            protected String getJSBundleFile() {
              return CodePush.getJSBundleFile();
            }
          };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    long size = 50L * 1024L * 1024L; // 50 MB
    com.facebook.react.modules.storage.ReactDatabaseSupplier.getInstance(getApplicationContext()).setMaximumSize(size);
    try {
      Field field = CursorWindow.class.getDeclaredField("sCursorWindowSize");
      field.setAccessible(true);
      field.set(null, 100 * 1024 * 1024); //the 50MB is the new size
    } catch (Exception e) {
      if (e != null) {
        e.printStackTrace();
      }
    }
  }
}
