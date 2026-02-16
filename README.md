# Ser-Health (صحة) 🏥

Ser-Health is a modern, comprehensive healthcare guidance system designed to connect users with essential medical services in Egypt. The platform leverages AI to provide symptom analysis and helps users find doctors, hospitals, pharmacies, and labs quickly and efficiently.

## 🌟 Features

- **AI Symptom Analyzer**: Detailed analysis of medical symptoms using Google Gemini AI to provide guidance on the next steps.
- **Doctor Directory**: Search for doctors by specialization and location.
- **Hospital Finder**: Locate the nearest medical facilities.
- **Pharmacy & Lab Search**: Easily find pharmacies and medical laboratories.
- **Multilingual Support**: Fully localized in Arabic and English.
- **Admin Dashboard**: Comprehensive management system for healthcare providers.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend & Database**: Supabase (PostgreSQL, Auth, Edge Functions)
- **AI Engine**: Google Gemini Pro (via Supabase Edge Functions / Direct API)

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/afandyna/ser-Health.git
   cd ser-health
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 📂 Documentation

Detailed setup and configuration guides can be found in the [`setup_guides/`](./setup_guides/) folder:
- [Database Setup Guide](./setup_guides/DATABASE_SETUP_SUMMARY.md)
- [Gemini AI Configuration](./setup_guides/GEMINI_SETUP.md)
- [Admin Credentials](./setup_guides/ADMIN_CREDENTIALS.md)

## 📝 License

This project is part of the Ser-Health initiative.

---
*Developed with ❤️ to improve healthcare accessibility.*
