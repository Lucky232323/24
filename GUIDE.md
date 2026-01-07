# Rider App 2.0 - Auth & Setup Guide

## 1. Authentication Updates (No More OTP) 🚫📱
We have completely removed Phone OTP and replaced it with robust **Email/Password** authentication for both Riders and Captains.

### **Rider Login Flow** 🛵
- **Login:** Enter Email & Password.
- **Sign Up:** Toggle to "Create Account". Enter Name, Phone (Optional), Gender, Email, Password.
- **Forgot Password:** Click "Forgot Password?" to receive a reset link.
- **Profile:** Upon signup, a profile is automatically created in Firestore `userProfiles`.

### **Captain Login Flow** 🧢
- **Login:** Enter Email & Password.
- **Sign Up:** Toggle to "Register". Enter Name, Mobile (Required), Gender, Email, Password.
- **Validation:** Checks if the Captain is "blocked" or "pending" (future proofing).
- **Profile:** Creates a profile in `captainProfiles` with `status: 'approved'` (for demo purposes).

---

## 2. Firebase Firestore Structure (Auto-Created) 🗄️
You do NOT need to manually create these. The app creates them when you sign up or book.

### `userProfiles` (Collection)
Stores Rider data.
- `id` (uid)
- `name`
- `email`
- `phoneNumber`
- `gender`
- `createdAt`

### `captainProfiles` (Collection)
Stores Captain data.
- `id` (uid)
- `name`
- `email`
- `phoneNumber`
- `gender`
- `vehicleType` (Bike/Auto/Cab)
- `status` ('pending' | 'approved' | 'blocked')
- `isOnline` (boolean)

### `rides` (Collection)
Stores trip data.
- `riderId`, `riderName`
- `captainId`, `captainName`
- `pickup`, `drop`
- `fare`, `status`
- `bookingMode` ('daily' | 'rentals' | 'parcel')

---

## 3. How to Test 🧪
1. **Rider:**
   - Go to `http://localhost:9002`
   - Select "Rider"
   - Click "New here? Create an account"
   - Sign up with a fresh email.
   - You should land on the Home page.

2. **Captain:**
   - Logout and select "Captain"
   - Click "Register"
   - Sign up.
   - You will be taken to Document/Vehicle selection (Rider App flow).

3. **Admin:**
   - Login with `rider12@GMAIL.COM` / `1212` (Hardcoded for now).
   - Check "Recent Users" to see your new Rider accounts!

---

** Enjoy your new OTP-free experience! ** 🚀
