---
name: login-register
description: Builds production-ready Login and Register (sign up) screens for Flutter mobile apps and Next.js web apps, covering form validation, loading and error states, Google/OAuth sign-in, terms consent, secure session handling, autofill, accessibility, and dark mode. Use this skill whenever the user mentions login, sign in, sign up, register, registration, auth screens, authentication UI, "login & register", or asks to create, fix, redesign, or review any authentication page or screen, even if they do not say "production ready".
---

# Login & Register

Generate or upgrade Login and Register screens so they are safe to ship. Do not paste a template: read the project first, then apply the rules for its platform.

## Pick the platform

Detect it from the project and do not ask if it is obvious:

- `pubspec.yaml` exists → follow the **Flutter** section only.
- `package.json` with `next` → follow the **Next.js** section only.
- Both exist (monorepo) or neither → ask the user which one to build, in one short question.

## Rules that apply to every platform

1. **Inspect before writing.** Reuse the existing auth/API layer, theme, state management, and routes. Do not add a second auth system or rename things other files depend on.
2. **Validate everywhere.** Every field has validation. Passwords are never trimmed. Confirm-password is validated against the password field. Server-side checks must not depend on the client's checks.
3. **One shared set of building blocks.** Login and Register share header, field, button, and terms components. No copy-pasted widgets.
4. **Friendly, generic errors.** Map errors in one place (no connection, timeout, wrong credentials, already registered, server error, unknown). Never show raw exception text. Login failures must not reveal whether an account exists.
5. **No double submits.** Disable controls while loading, dismiss the keyboard, and reset loading state in `finally`.
6. **Consent at registration.** Terms and Privacy are required when an account can be created, not for logging in an existing user (flag it if the original code differs).
7. **No fake data.** Do not write placeholder values to the backend just to satisfy a required field.
8. **Accessible by default.** Labels, error announcements, autofill hints, correct keyboard types, large tap targets, text scaling, light and dark mode through theme tokens.
9. **Safe session handling.** Tokens go in secure storage (mobile) or httpOnly cookies (web). Never log secrets or credentials.
10. **Be honest about the edges.** Do not claim the result is "secure". Finish with a short list of decisions made and things that could not be verified (backend contract, provider settings, rate limits).
11. **Verify.** Run the platform's analyzer or type-check and fix what the change introduced.

## Do not

- Do not add packages without saying which and why.
- Do not put secrets, API keys, or client IDs in screen/page files.
- Do not change routes, class names, or API methods that other files use.

---

## Flutter

### Step 1: Inspect the project before writing anything

1. Read `pubspec.yaml`. Note the state management in use (setState / Provider / Riverpod / Bloc / GetX) and follow it. Do not introduce a new one.
2. Find the existing API/auth layer (e.g. `ApiService`, `AuthRepository`, `GoogleAuthService`, `NotificationService`). Reuse it. Never invent endpoints.
3. Find the theme (`ThemeData`, color constants, `AppColors`). Use the theme. Only fall back to the default tokens below if the project has none.
4. Find the app name, logo asset and home route. Use the real app name consistently everywhere (title, terms text, header). Flag any mismatch to the user instead of silently picking one.
5. Check whether the project already has `login_screen.dart` / `register_screen.dart`. If so, refactor in place and keep the public class names and routes so nothing else breaks.

### Step 2: File structure

Put shared pieces in one place so the two screens never duplicate code:

```
features/auth/presentation/
├── login_screen.dart
├── register_screen.dart
├── forgot_password_screen.dart      (only if it already exists)
└── widgets/
    ├── auth_header.dart             logo + title + tagline
    ├── auth_text_field.dart         one text field used by both screens
    ├── auth_primary_button.dart     loading-aware button
    ├── google_sign_in_button.dart
    ├── terms_checkbox.dart          owns and disposes its TapGestureRecognizers
    └── auth_footer_link.dart        "New here? Sign Up" / "Already have an account? Log in"
features/auth/validators.dart        pure functions, easy to unit test
```

### Step 3: Production checklist (every item is required)

#### Validation
- Every `TextFormField` has a `validator`. A `Form.validate()` with no validators does nothing.
- Email: trimmed, non-empty, matches a sane regex. Password: required, minimum 8 characters on register (login only checks non-empty so existing users are never blocked).
- Confirm password is validated **inside its own validator** by comparing with the password controller, not with a separate snackbar.
- Use `autovalidateMode: AutovalidateMode.onUserInteraction` after the first submit attempt.

#### Credentials
- Trim username/email. **Never trim or alter the password.**
- Never log passwords, tokens, or full responses. No `print` of user data. Use `debugPrint` only for non-sensitive messages, guarded by `kDebugMode`.
- Tokens must be stored with `flutter_secure_storage` (or the project's existing secure store). If the existing `ApiService` stores tokens in `SharedPreferences`, tell the user and offer to migrate. Do not change it silently.

#### Submit behaviour
- Dismiss the keyboard (`FocusScope.of(context).unfocus()`) on submit.
- Ignore taps while loading (`if (_isLoading) return;`) and disable the button. Disable the Google button too, and vice versa.
- Always check `if (!mounted) return;` after every `await` before touching `context` or `setState`.
- Reset loading in `finally`.
- Order of checks: form validation first, then consent, then network.

#### Errors
- Convert exceptions into friendly messages in **one** helper (for example `AuthErrorMapper.message(Object e)`), handling at least: no connection / `SocketException`, timeout, 400/401 (wrong credentials), 409 (already registered), 5xx (server problem), and unknown.
- Never show raw `e.toString()` or stack-ish text to the user.
- Never swallow errors with an empty `catch (_) {}`. Non-critical steps (like uploading an FCM token) may fail without blocking login, but log them in debug mode.

#### Navigation
- After a successful login or register-and-auto-login, go to Home with `Navigator.pushAndRemoveUntil(..., (_) => false)` so Back cannot return to the auth screen. Use the project's router (go_router etc.) equivalent if it has one.
- After register, pick **one** consistent flow and say which: either auto-login straight into the app, or send the user to Login with a success message. Do not log the user in silently and then also ask them to log in again.
- Do not create server records with fake placeholder values (`'Unknown'`, `0`). Collect the field, make it optional on the backend, or complete it in an onboarding step. Tell the user if the backend currently forces placeholders.
- If registration succeeds but a follow-up step (profile creation) fails, do not hide it. Show a clear message and make the step retryable.

#### Terms and consent
- Consent is required at **register**, and for Google sign-in when it can create a new account. Do not block plain login of an existing user behind a checkbox unless the user's legal requirement says so. If the original code does this, ask or flag it.
- Link text to Terms and Privacy uses `TapGestureRecognizer`. **Dispose recognizers** in `dispose()` or they leak. This is why `terms_checkbox.dart` is its own StatefulWidget.

#### UX and accessibility
- `textInputAction`: `next` on every field, `done`/`go` on the last. Call submit from `onFieldSubmitted`.
- `keyboardType: emailAddress` for email; `autocorrect: false` and `enableSuggestions: false` for email and password.
- Wrap fields in `AutofillGroup` and set `autofillHints` (`AutofillHints.email`, `.password`, `.newPassword`, `.name`). Call `TextInput.finishAutofillContext()` on success.
- Password visibility toggle has a `tooltip`/semantic label.
- Footer links use `InkWell`/`TextButton` (48x48 minimum tap target), not a bare `GestureDetector` on text.
- Layout must not overflow on small screens or with the keyboard open: `SingleChildScrollView` + `ConstrainedBox(minHeight)` inside `LayoutBuilder`, and avoid fixed heights.
- Respect text scaling. No hardcoded widths on labels.
- Image assets (Google icon) get an `errorBuilder` fallback to a `Icon`.
- Remove empty/unused UI (for example bilingual labels with an empty second string).

#### Styling
- Use `Theme.of(context).colorScheme` and `TextTheme` instead of `isDark ? X : Y` ternaries repeated in every widget. Dark mode should come from the theme, not from per-widget checks.
- Define constants once (radius, spacing, field height). Use `const` constructors everywhere possible.
- Use `super.key` instead of `Key? key` + `super(key: key)`.

#### Fallback design tokens (only if the project has no theme)
Primary `#1E2A47`, dark-mode accent `Colors.blue.shade300`, radius 8, field fill `cardColor`, button height 56, logo 80px circle, screen padding 24 horizontal / 32 vertical, label 14 bold.

### Step 4: Reference patterns

Validators (pure, testable):

```dart
class AuthValidators {
  static final _email = RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$');

  static String? email(String? v) {
    final s = v?.trim() ?? '';
    if (s.isEmpty) return 'Email is required';
    if (!_email.hasMatch(s)) return 'Enter a valid email';
    return null;
  }

  static String? loginPassword(String? v) =>
      (v == null || v.isEmpty) ? 'Password is required' : null;

  static String? newPassword(String? v) {
    if (v == null || v.isEmpty) return 'Password is required';
    if (v.length < 8) return 'Use at least 8 characters';
    return null;
  }

  static String? Function(String?) confirm(TextEditingController other) =>
      (v) => v != other.text ? 'Passwords do not match' : null;

  static String? name(String? v) =>
      (v == null || v.trim().length < 2) ? 'Enter your full name' : null;
}
```

Submit skeleton:

```dart
Future<void> _submit() async {
  if (_isLoading) return;
  FocusScope.of(context).unfocus();
  if (!_formKey.currentState!.validate()) return;

  setState(() => _isLoading = true);
  try {
    await _auth.login(_email.text.trim(), _password.text); // password untouched
    TextInput.finishAutofillContext();
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const HomeScreen()),
      (_) => false,
    );
  } catch (e) {
    if (!mounted) return;
    _showError(AuthErrorMapper.message(e));
  } finally {
    if (mounted) setState(() => _isLoading = false);
  }
}
```

### Step 5: Verify before finishing

1. Run `flutter analyze`. Fix everything the change introduced.
2. Confirm no unused imports remain and every controller, focus node, and recognizer is disposed.
3. Mentally walk these cases: empty form, invalid email, short password, mismatched passwords, no internet, wrong password, already-registered email, double tap on submit, Google sign-in cancelled by the user, rotate / small screen / keyboard open, dark mode.
4. End your reply with a short list of **decisions you made** and **things you could not verify** (backend contract, token storage, Google backend token exchange), so the user can confirm them.

### Do not

- Do not rename routes, classes, or API methods that other files depend on.
- Do not add packages without saying which and why.
- Do not store secrets, API keys, or client IDs in the screen files.
- Do not claim the screens are "secure". Say what was done and what depends on the backend.

---

## Next.js

### Step 1: Inspect the project before writing anything

1. Read `package.json` and `next.config.*`. Note the Next version, whether it uses the App Router (`app/`) or Pages Router, and the React version.
   - Next 14 / React 18: `useFormState` from `react-dom`.
   - Next 15 / React 19: `useActionState` from `react`.
2. Find the existing auth layer and use it: Supabase (`@supabase/ssr`), Auth.js/NextAuth, Clerk, or a custom API. Do not add a second auth system. If none exists and the project already uses Supabase, use Supabase Auth.
3. Check Tailwind version. Tailwind v4 is CSS-first (`@import "tailwindcss"` + `@theme` in the CSS file); do not create a `tailwind.config.js` unless the project already has one.
4. Find existing UI primitives (shadcn/ui, custom `Button`, `Input`). Reuse them. Match the existing design tokens and dark-mode approach.
5. Read the app name, logo, and route conventions. Keep names consistent everywhere.
6. If login/register pages already exist, refactor in place and keep their routes.

### Step 2: File structure

```
app/
├── (auth)/
│   ├── layout.tsx                 centered card layout, redirects signed-in users away
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── actions.ts                 "use server": login, register, signInWithGoogle, signOut
├── auth/
│   └── callback/route.ts          OAuth / email-confirmation code exchange
components/auth/
├── auth-card.tsx
├── form-field.tsx                 label + input + error, wired for a11y
├── password-input.tsx             show/hide toggle
├── submit-button.tsx              pending-aware
├── google-button.tsx
└── terms-checkbox.tsx
lib/
├── validators/auth.ts             zod schemas shared by client and server
├── safe-redirect.ts
└── supabase/{client,server,middleware}.ts   (only if using Supabase)
middleware.ts                      session refresh + route protection
```

### Step 3: Production checklist (every item is required)

#### Validation
- One zod schema per form in `lib/validators/auth.ts`, used for client-side feedback **and** re-validated inside the server action. Never trust the client.
- Email: trim + lowercase. Password: **never trim**. Register: minimum 8 characters, `confirmPassword` checked with `.refine`. Login: only "not empty", so existing users are never locked out.
- Return field-level errors (`{ errors: { email: [...] } }`) plus one form-level error, and render them next to the fields.

#### Security
- Do mutations in Server Actions or Route Handlers, never in client components with secrets.
- On the server, trust `supabase.auth.getUser()`, not `getSession()`, for authorization decisions.
- Only the public anon key goes in `NEXT_PUBLIC_*`. The service-role key must never reach client code or be imported from a client file.
- Auth cookies must come from `@supabase/ssr` (httpOnly handling) or the library's default. Do not hand-roll tokens in `localStorage`.
- **Open-redirect protection:** any `?next=` / `redirectTo` value must pass `safeRedirect()` (only same-origin paths that start with a single `/`). Default to `/dashboard` (or the project's home).
- Login errors must be generic ("Invalid email or password") and must not reveal whether an account exists. Do the same on password reset.
- Mention rate limiting / CAPTCHA (e.g. Cloudflare Turnstile, or Supabase's built-in limits) to the user as a decision. Do not silently skip it and do not add a service without saying so.
- Never log passwords, tokens, or whole request bodies.

#### Flow
- `middleware.ts` refreshes the session on every request and redirects unauthenticated users away from protected routes. Matcher excludes `_next/static`, images, and the favicon.
- Signed-in users who visit `/login` or `/register` get redirected to home.
- Register: choose one flow and state it. With email confirmation on: show a "check your inbox" state, no auto-login. With confirmation off: sign in and redirect. Handle "email already registered" without leaking details beyond what the provider returns.
- Google/OAuth: `redirectTo` points to `/auth/callback`, which exchanges the code for a session and then redirects through `safeRedirect`. Handle callback errors with a friendly message on `/login`.
- Terms and Privacy consent is required at register (and when OAuth can create a new account), not for logging in an existing user. Link to the real pages.
- Do not write fake placeholder data to the database. Collect it, make it optional, or ask for it in onboarding. A profile row can be created by a database trigger instead of client code.

#### UX and accessibility
- Every input has a visible `<label htmlFor>`. Do not rely on placeholders as labels.
- Errors use `aria-invalid`, `aria-describedby`, and a message with `role="alert"`. Focus the first invalid field after a failed submit.
- Correct `autoComplete`: `email`, `current-password` (login), `new-password` (register, both password fields), `name`. Use `type="email"` and `inputMode="email"`.
- Password toggle is a real `<button type="button">` with `aria-label` and `aria-pressed`.
- Submit button shows a pending state (`useFormStatus`) and is disabled while pending, so double submits are impossible. Disable the Google button during any pending action too.
- Works with keyboard only; Enter submits; visible focus rings; touch targets at least 44px.
- Responsive from 320px up; no horizontal scroll; correct in light and dark mode through design tokens, not per-component ternaries.
- Anything using `useSearchParams` is wrapped in `<Suspense>` so the build does not fail.
- Set page `metadata` (title) per page.

### Step 4: Reference patterns

Schemas:

```ts
// lib/validators/auth.ts
import { z } from "zod";

const email = z.string().trim().toLowerCase().email("Enter a valid email");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required"), // no trim
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name"),
    email,
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string(),
    terms: z.literal("on", { errorMap: () => ({ message: "You must accept the terms" }) }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
```

Safe redirect:

```ts
// lib/safe-redirect.ts
export function safeRedirect(next: string | null | undefined, fallback = "/dashboard") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return fallback;
  }
  return next;
}
```

Server action (Supabase):

```ts
// app/(auth)/actions.ts
"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validators/auth";
import { safeRedirect } from "@/lib/safe-redirect";

export type FormState = { errors?: Record<string, string[]>; message?: string };

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient(); // drop `await` if your helper is sync
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { message: "Invalid email or password." }; // generic on purpose

  redirect(safeRedirect(formData.get("next") as string | null));
}
```

Form component skeleton (Next 14 shown; on Next 15 use `useActionState` from `react`):

```tsx
"use client";
import { useFormState, useFormStatus } from "react-dom";
import { login, type FormState } from "../actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? "Signing in…" : "Log in"}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useFormState<FormState, FormData>(login, {});
  return (
    <form action={action} noValidate>
      <input type="hidden" name="next" value={next ?? ""} />
      {/* FormField for email (autoComplete="email") and PasswordInput
          (autoComplete="current-password"), each reading state.errors */}
      {state.message && <p role="alert">{state.message}</p>}
      <Submit />
    </form>
  );
}
```

### Step 5: Verify before finishing

1. Run `npx tsc --noEmit` and the project's lint command. Run `next build` when feasible (it catches the `useSearchParams` Suspense issue).
2. Walk through: empty form, invalid email, short password, mismatched passwords, wrong password, existing email, double click, JS disabled (server action still validates), `?next=https://evil.com` (must fall back), signed-in user opening `/login`, OAuth cancelled, mobile width, dark mode, keyboard-only.
3. End your reply with **decisions made** and **unverified items** (Supabase email-confirmation setting, redirect URLs allow-list in the dashboard, RLS policies, rate limits).

### Do not

- Do not move auth logic into client components or expose server-only keys.
- Do not add packages (zod, react-hook-form, Turnstile) without saying which and why. Prefer what the project already has.
- Do not change existing routes, middleware matchers, or database schema without saying so.
- Do not claim the flow is "secure"; state what was done and what depends on provider and database configuration.
