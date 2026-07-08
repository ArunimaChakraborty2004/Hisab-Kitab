Hisab-Kitab React Prototype - v2
============================

This updated prototype includes:
- Large icon buttons and minimal text for low-literacy users
- Regional language samples (Kannada, Hindi, Tamil, Marathi, Bengali)
- Simple commands and sample phrases displayed for each language
- Quick action buttons for Balance, Schemes, and ID Verification (mocked)
- Mock integration functions for Bank, Schemes, and KYC inside App.jsx

To connect to a real backend/Dialogflow:
- Replace mockBankBalance/mockSendMoney/mockSchemes/mockKYC functions with real API calls.
- Ensure backend endpoints use HTTPS and return plain text 'reply' for TTS.

## How to run the project locally

You need two terminal windows to run both the frontend and the backend.

**1. Start the Backend Server:**
Open a terminal and run the following commands:
```bash
cd backend
npm run dev
```
*(This starts the backend on port 5000 and connects to MongoDB)*

**2. Start the Frontend App:**
Open a separate terminal in the root folder (`Hisab-Kitab`) and run:
```bash
npm run dev
```
*(This starts the Vite React frontend)*
