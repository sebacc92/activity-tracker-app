# Activity Tracker App

This is an activity tracking app built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev). The app integrates with the [Strava API](https://developers.strava.com/) to authenticate users and display activity data.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Assumptions](#assumptions)
- [Areas for Improvement](#areas-for-improvement)
- [Additional Notes](#additional-notes)

---

## Getting Started

Follow these steps to set up and run the project:

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd activity-tracker-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory of the project and include the following variables:

```bash
EXPO_PUBLIC_CLIENT_ID=your-strava-client-id
EXPO_PUBLIC_CLIENT_SECRET=your-strava-client-secret
```
> **Note:** Note: The CLIENT_SECRET is used for local development only and should be securely stored in production.

### 4. Start the app

```bash
npx expo start
```

You can then open the app on:

- A [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- An [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- An [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- The [Expo Go](https://expo.dev/go) app

## 5. Using the app

1. Click "Login with Strava" to authenticate with your Strava account.
2. After login, you will be redirected to a screen displaying activities.

---

## Features

- **OAuth2 Authentication with Strava:** Users can log in using their Strava credentials.
- **Token Management:** Tokens (access, refresh, expiration) are securely stored using Zustand and AsyncStorage.
- **Dynamic Routing:** The app uses file-based routing with `expo-router`.
- **Activity Display:** The app fetches and displays user activities from Strava (pending further development).

---

## Assumptions

During development, the following assumptions were made:

1. The app will use the [Strava API](https://developers.strava.com/) to authenticate and fetch activity data.
2. The `EXPO_PUBLIC_CLIENT_SECRET` is stored in `.env` for local testing but should not be used in production.
3. The app will initially focus on authentication and displaying basic activity data.

---

## Areas for Improvement

Given more time, the following areas could be improved:

1. **UI/UX Enhancements:**
   - Design and implement a polished interface for the activity list.
   - Add loading indicators and error messages for a smoother user experience.
2. **Token Refresh Logic:**
   - Automatically refresh expired tokens using the `refresh_token`.
   - Handle token refresh errors gracefully.
3. **Error Handling:**
   - Add detailed error messages for API calls and authentication failures.
4. **Testing:**
   - Implement unit and integration tests for critical components.
   - Add end-to-end tests for the authentication flow.
5. **Secure Secrets Management:**
   - Use a backend or secure store for sensitive data like `client_secret`.

---

## Additional Notes

- **Expo Router:** The app uses `expo-router` for file-based navigation, simplifying route management.
- **State Management:** Zustand is used to handle authentication state, with support for persistent tokens via AsyncStorage.
- **Strava Integration:** The app uses the Strava API for authentication and will later expand to fetch user activities and statistics.

For any questions or suggestions, feel free to reach out or open an issue in the repository.

---
