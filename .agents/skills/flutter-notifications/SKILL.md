---
name: flutter-notifications
description: Comprehensive guide and implementation runbook for Flutter notifications. Covers flutter_local_notifications 22+, Android 13+ permissions, Java 8/17 desugaring, Firebase Cloud Messaging (FCM) v1, cross-platform iOS APNs mapping, role-based notification dispatch (driver vs gatekeeper), and system tray vs in-app UI patterns.
---

# Flutter Notifications: Complete Implementation & Architecture Runbook

This skill is the definitive reference for implementing system notifications, Firebase Cloud Messaging (FCM), and role-based notification routing in Flutter applications.

---

## 1. Core Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                      FLUTTER NOTIFICATION STACK                        │
├───────────────────────────────────┬────────────────────────────────────┤
│   Native System Notifications     │    Firebase Cloud Messaging (FCM)  │
│   (flutter_local_notifications)   │    (Cloud Push & Token Dispatch)   │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Native status bar & drawer      │ • Unified FCM token for iOS/Android│
│ • Android 13+ POST_NOTIFICATIONS  │ • Apple APNs translation via .p8   │
│ • Core Library Desugaring (JDK)   │ • FCM HTTP v1 Backend Payload      │
│ • High-priority alert channels    │ • Topic & Token-based multicasting │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 2. System Notifications Setup (`flutter_local_notifications` 22+)

### A. Android Manifest Configuration (`android/app/src/main/AndroidManifest.xml`)
Add the following permissions inside the `<manifest>` tag:

```xml
<!-- Required for Android 13+ (API level 33+) runtime push notifications -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<!-- Required for vibration with notification alerts -->
<uses-permission android:name="android.permission.VIBRATE" />
```

### B. Android Gradle Desugaring Requirement (`android/app/build.gradle.kts`)
`flutter_local_notifications` requires Java 8+ / Java 17 core library desugaring on Android. Without this, Gradle will fail with `checkDebugAarMetadata`.

```kotlin
android {
    compileOptions {
        isCoreLibraryDesugaringEnabled = true
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.4")
}
```

### C. `flutter_local_notifications` 22+ Syntax (Named Parameters)
> [!IMPORTANT]
> In `flutter_local_notifications` v22+, both `initialize()` and `show()` strictly use **named parameters**. Passing positional arguments causes compile-time errors.

```dart
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class SystemNotificationService {
  static final SystemNotificationService _instance = SystemNotificationService._internal();
  factory SystemNotificationService() => _instance;
  SystemNotificationService._internal();

  final FlutterLocalNotificationsPlugin _notificationsPlugin = FlutterLocalNotificationsPlugin();
  bool _isInitialized = false;

  Future<void> init() async {
    if (_isInitialized) return;

    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const darwinSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: darwinSettings,
      macOS: darwinSettings,
    );

    // Named parameter: settings
    await _notificationsPlugin.initialize(
      settings: initSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        debugPrint('🔔 [Notification Tapped] Payload: ${response.payload}');
      },
    );

    // Request runtime permission on Android 13+
    if (!kIsWeb && Platform.isAndroid) {
      final androidPlugin = _notificationsPlugin
          .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
      await androidPlugin?.requestNotificationsPermission();
    }

    _isInitialized = true;
  }

  Future<void> showNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
    String channelId = 'parkflow_channel',
    String channelName = 'ParkFlow Updates',
  }) async {
    if (!_isInitialized) await init();

    final androidDetails = AndroidNotificationDetails(
      channelId,
      channelName,
      channelDescription: 'Real-time booking and security dispatch alerts',
      importance: Importance.max,
      priority: Priority.high,
      showWhen: true,
      enableVibration: true,
      playSound: true,
    );

    const darwinDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    final notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: darwinDetails,
    );

    // Named parameters for show()
    await _notificationsPlugin.show(
      id: id,
      title: title,
      body: body,
      notificationDetails: notificationDetails,
      payload: payload,
    );
  }
}
```

---

## 3. Firebase Cloud Messaging (FCM) Integration

### A. Cross-Platform Token Architecture (iOS & Android)
- **Do not** write separate APNs device token management on your app server.
- On **Android**: Firebase SDK retrieves an FCM token via Google Play Services.
- On **iOS**: Firebase SDK exchanges the native Apple APNs token under the hood for a unified FCM token.
- **Requirement for iOS**: Upload the Apple APNs Auth Key (`.p8` file) to Firebase Console (**Project Settings -> Cloud Messaging -> Apple**). Both platforms then use the exact same FCM token.

### B. Backend FCM HTTP v1 Dispatch Payload
When your backend (Node.js / Python / Go) pushes notifications, use Google FCM HTTP v1 (`https://fcm.googleapis.com/v1/projects/{projectId}/messages:send`):

```json
{
  "message": {
    "token": "RECIPIENT_FCM_TOKEN_HERE",
    "notification": {
      "title": "Parking Request Approved ✅",
      "body": "Gatekeeper confirmed your slot at Silver Line. QR entry pass is active."
    },
    "data": {
      "notification_type": "REQUEST_ACCEPTED",
      "booking_id": "PKF-9281723",
      "plot_id": "101",
      "vehicle_number": "GJ03DH1450"
    },
    "android": {
      "priority": "HIGH",
      "notification": {
        "channel_id": "parkflow_channel",
        "sound": "default"
      }
    },
    "apns": {
      "payload": {
        "aps": {
          "sound": "default",
          "badge": 1
        }
      }
    }
  }
}
```

---

## 4. Role-Based Notification Routing: The Separation Rule

> [!WARNING]
> **The Golden Rule of Multi-Role Apps:**
> An alert dispatched *to* an operator/gatekeeper must **NEVER** be displayed to the user/driver who initiated the request.

### Matrix of Roles & Alert Targets:

| Event | Initiator | Intended Recipient | Delivery Target | Should User See It? |
|---|---|---|---|:---:|
| **New Parking Request** | Driver | Gatekeeper | `fcm_gatekeeper_plot_{id}` | ❌ **NO** (Never show on Driver App) |
| **Booking Confirmed** | Backend | Driver | Device Notification Drawer | ✅ **YES** (Driver Phone Status Bar) |
| **Request Approved** | Gatekeeper | Driver | Driver FCM + Status Bar | ✅ **YES** (Live ticket update + Notification) |
| **Request Declined** | Gatekeeper | Driver | Driver FCM + Status Bar | ✅ **YES** (Pass voided + Declining Reason) |

### Enforcing Role Isolation in Code:
1. **Never pass the gatekeeper notification back into the user UI:**
   ```dart
   // ❌ BAD: Passing gatekeeper's dispatch object into the driver's ticket page
   ParkingTicketPage(gatekeeperNotification: gatekeeperNotif);

   // ✅ GOOD: Clean driver screen with live polling and driver system notification
   ParkingTicketPage(bookingId: bookingId, plot: plot);
   SystemNotificationService().notifyBookingConfirmed(plotName: plotName, ...);
   ```

2. **Filter Reactive Notifiers:**
   ```dart
   // In GatekeeperNotificationService or repository listener:
   void _onNotificationReceived() {
     final notif = latestNotificationNotifier.value;
     if (notif == null) return;

     // Reject pending gatekeeper dispatch requests on user screens
     if (notif.isPending) return;

     if (notif.isAccepted) { ... }
     if (notif.isRejected) { ... }
   }
   ```

---

## 5. UI Placement: System Tray vs. In-App Overlay Banners

1. **System Tray / Phone Drawer (Recommended for Alerts):**
   - Use native `SystemNotificationService` to push notifications into the phone's status bar and drawer.
   - Users expect notifications in their device's notification center (works when app is backgrounded or foregrounded).

2. **Foreground State (Inside App Screens):**
   - **Do NOT** use intrusive, top floating overlay banners that cover navigation bars, headers, or QR codes.
   - **DO** use contextual, inline status changes:
     - Badge transitions: `PENDING` ➔ `CONFIRMED` ➔ `REJECTED` (with VOID overlay).
     - Inline warning card with rejection reason inside the ticket card.
     - Haptic feedback (`HapticFeedback.heavyImpact()`).

---

## 6. Live Sync Polling Fallback Pattern

Push notifications can occasionally be delayed by OS battery optimizations or poor network connectivity. Always pair push notifications with a lightweight live poll when viewing transactional screens (e.g. active parking pass):

```dart
Timer? _syncTimer;

void _startLiveSync() {
  _syncTimer?.cancel();
  _syncTimer = Timer.periodic(const Duration(seconds: 4), (_) async {
    if (!mounted || _isChecking) return;
    _isChecking = true;
    try {
      final res = await ApiService().getBookingStatus(widget.bookingId);
      final status = res['status']?.toString().toUpperCase();
      if (status == 'REJECTED') {
        _applyRejection(res['reason']);
      } else if (status == 'ACCEPTED') {
        setState(() => _status = 'ACCEPTED');
      }
    } finally {
      _isChecking = false;
    }
  });
}
```

---

## 7. Troubleshooting & Gotchas Cheat Sheet

| Symptom / Error | Cause | Fix |
|---|---|---|
| `Too many positional arguments: 0 allowed, but 1 found` in `initialize` | `flutter_local_notifications` 22+ API change | Use `initialize(settings: initSettings, ...)` |
| `Too many positional arguments: 0 allowed, but 4 found` in `show` | `flutter_local_notifications` 22+ API change | Use `show(id: id, title: title, body: body, notificationDetails: ...)` |
| `Dependency requires core library desugaring to be enabled` | Missing Java 8+ API desugaring for notification channels | Add `isCoreLibraryDesugaringEnabled = true` and `desugar_jdk_libs` in `android/app/build.gradle.kts` |
| Notifications not appearing on Android 13+ | Missing runtime permission | Call `requestNotificationsPermission()` on `AndroidFlutterLocalNotificationsPlugin` |
| Gatekeeper alert showing on driver phone | Dispatch object passed to user widget or broadcast via global notifier | Filter out `isPending` dispatches from driver listeners |
