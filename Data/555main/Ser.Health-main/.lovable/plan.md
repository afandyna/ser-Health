

# Smart Emergency Router (SER) — Implementation Plan

## Branding & Design System
- **Colors**: White background, medical blue primary (#1E88E5), light green accents (#66BB6A), red for emergencies (#E53935)
- **Logo**: "SER" bold text with a medical cross icon
- **Typography**: Clean, large, accessibility-friendly fonts
- **Mobile-first**: All layouts designed for phones first, then scale up
- **RTL support**: Full Arabic/English toggle with right-to-left layout for Arabic

---

## Page 1: Homepage
- Large SER logo and tagline
- **Smart search bar** with tabs: Hospitals, Doctors, Pharmacies, Donations
- GPS auto-detection banner showing current location
- Quick action cards: AI Symptom Router, Emergency Button, Find Hospital, Find Pharmacy
- Language toggle (Arabic/English) in header
- **Floating red emergency button** — always visible on every page

## Page 2: AI Medical Specialty Router
- Input form with:
  - Symptoms (free text)
  - Age, Gender
  - Duration of symptoms
  - Pain level slider (1-10)
  - Chronic diseases (optional text)
  - Emergency symptom checkboxes (chest pain, breathing difficulty, severe bleeding, loss of consciousness)
- On submit → calls Lovable AI (via edge function) to classify into:
  - **Recommended Medical Specialty** (e.g., Cardiology, Ophthalmology)
  - **Severity Level** with color coding (Red/Orange/Green)
  - **Suggested Next Step** (e.g., "Go to ER immediately")
  - **Confidence Score** (percentage)
- Mandatory disclaimer displayed prominently
- "Find nearest specialist" button linking to filtered hospital/doctor results

## Page 3: Emergency Mode
- Full-screen red emergency interface
- Auto GPS detection
- Instantly displays:
  - 3 nearest hospitals with ambulance availability
  - Emergency phone numbers (call buttons)
  - AI-suggested specialty if symptoms were entered
- Large touch-friendly buttons, zero clutter
- Works offline with cached data (PWA)

## Page 4: Hospitals Listing
- Cards showing: name, phone, address, distance from user, ambulance availability
- Status badges: Green (Available), Orange (Busy), Red (Unavailable)
- Call button and Directions button (opens maps app)
- Sort by distance, filter by status
- Sample data for ~10 hospitals

## Page 5: Doctors Listing
- Cards showing: name, specialty, clinic address, phone, distance, star rating
- Call and Book buttons
- Filter by specialty (linked from AI results)
- Sample data for ~15 doctors across specialties

## Page 6: Pharmacies Listing
- Cards showing: name, address, phone, distance, open/closed status
- Call and Directions buttons
- Sort by distance
- Sample data for ~8 pharmacies

## Page 7: Donations
- Three categories: Ambulance transportation, Blood donation, Medical supplies
- Each listing shows: donor name, donation type, location, phone, distance
- Contact button
- Simple form to submit a new donation offer

---

## Backend (Lovable Cloud)
- **Edge function**: AI symptom classification using Lovable AI (Gemini model)
  - Accepts symptoms, age, gender, pain level, duration, chronic diseases, emergency flags
  - Returns specialty, severity, next step, confidence score
- **Database tables** (with sample data):
  - `hospitals` — name, phone, address, lat/lng, ambulance, status
  - `doctors` — name, specialty, clinic, phone, lat/lng, rating
  - `pharmacies` — name, address, phone, lat/lng, is_open
  - `donations` — donor_name, type, location, phone, lat/lng

## PWA / Offline Mode
- Service worker caching for emergency numbers, nearest hospital/pharmacy data
- Installable from browser as a home screen app
- Offline emergency page with cached critical info

## Internationalization
- Arabic (RTL) and English toggle
- All UI labels, buttons, disclaimers translated
- Language preference saved in local storage

## Footer (all pages)
- Emergency disclaimer
- Support contact info
- Data privacy notice

