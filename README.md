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
