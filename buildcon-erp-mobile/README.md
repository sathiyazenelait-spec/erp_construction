# BuildCon Mobile ERP (React Native / Expo)

A cross-platform native mobile application built with React Native and Expo for construction field engineers, site supervisors, storekeepers, and project managers.

---

## 📱 Features

1. **Daily Progress Reports (DPR)**
   - Live work % completion logging.
   - GPS geotagged site photo & video attachments.
   - Direct integration with Spring Boot `/api/site-management/dpr` backend.

2. **Geo-Fenced Labor Attendance**
   - GPS site boundary validation.
   - Head count allocation (skilled masons, carpenters, helpers).
   - Real-time muster synchronization with HR payroll.

3. **Executive Push Approvals**
   - High-priority cards for Purchase Orders (POs), Subcontractor RA Bills, and Quality Non-Conformance Reports (NCRs).
   - One-tap Approve / Reject actions with automated Audit Trail logging.

4. **Store Inward GRN Scanner**
   - QR code and barcode scanning for delivery vehicle delivery challans and weighbridge slips.
   - Instant store inventory stock level increments.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on iOS or Android

### Installation
```bash
cd buildcon-erp-mobile
npm install
```

### Run Locally
```bash
npx expo start
```
- Press `a` to open Android Emulator.
- Press `i` to open iOS Simulator.
- Press `w` to open Web Preview.
- Scan the QR code using the **Expo Go** app on your physical mobile phone.

### Build Production APK / IPA
```bash
# Android APK
npx eas build -p android --profile preview

# iOS IPA
npx eas build -p ios --profile preview
```
