const Scheme = require('./models/Scheme');
const SavingsPlan = require('./models/SavingsPlan');
const Lesson = require('./models/Lesson');
const QuizQuestion = require('./models/QuizQuestion');
const Transaction = require('./models/Transaction');

const initialSchemes = [
  { title: 'myScheme Portal', desc: 'National one‑stop platform to discover and apply for government schemes.', link: 'https://www.myscheme.gov.in', category: 'general', icon: '🏛️' },
  { title: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)', desc: 'Provides basic banking accounts with overdraft and insurance benefits.', link: 'https://pmjdy.gov.in', category: 'finance', icon: '🏦' },
  { title: 'Sukanya Samriddhi Yojana (SSY)', desc: 'Small deposit scheme for the girl child to build a corpus for her future.', link: 'https://www.nsiindia.gov.in', category: 'women', icon: '👧' },
  { title: 'Atal Pension Yojana (APY)', desc: 'Pension scheme primarily for the unorganized sector.', link: 'https://pfrda.org.in', category: 'finance', icon: '👴' },
  { title: 'Stand-Up India', desc: 'Bank loans between 10 lakh and 1 crore for SC/ST and women entrepreneurs.', link: 'https://www.standupmitra.in', category: 'business', icon: '💼' }
];

const initialSavingsPlans = [
  { planId: 'std-save', title: 'Standard Savings', defaultRate: 4, defaultMonths: 12, defaultAmount: 500, desc: 'Basic bank savings account' },
  { planId: 'fd-save', title: 'Fixed Deposit (FD)', defaultRate: 7, defaultMonths: 60, defaultAmount: 10000, desc: 'Safe investment with fixed returns' },
  { planId: 'ssy-save', title: 'Sukanya Samriddhi (SSY)', defaultRate: 8, defaultMonths: 168, defaultAmount: 250, desc: 'High interest scheme for girl child' }
];

async function seedDB() {
  try {
    const schemeCount = await Scheme.countDocuments();
    if (schemeCount === 0) await Scheme.insertMany(initialSchemes);

    const savingsCount = await SavingsPlan.countDocuments();
    if (savingsCount === 0) await SavingsPlan.insertMany(initialSavingsPlans);

    // ----- SEED INITIAL TRANSACTIONS -----
    const txCount = await Transaction.countDocuments();
    if (txCount === 0) {
      const initialTransactions = [
        { title: 'Salary', amount: 15000, type: 'income', date: new Date().toISOString().slice(0, 10) },
        { title: 'Groceries', amount: 1200, type: 'expense', date: new Date().toISOString().slice(0, 10) },
        { title: 'Savings Deposit', amount: 3000, type: 'saving', date: new Date().toISOString().slice(0, 10) }
      ];
      await Transaction.insertMany(initialTransactions);
      console.log('Seeded initial transactions.');
    }

    // ----- SEED LESSONS (Bilingual) -----
    const lessonCount = await Lesson.countDocuments();
    if (lessonCount === 0) {
      const lessons = [
        {
          title: { en: "Self-Help Groups (SHGs)", hi: "स्वयं सहायता समूह (SHG)" },
          summary: { en: "Learn how SHGs can help you save money and get low-interest loans.", hi: "जानें कैसे SHG आपको पैसे बचाने और कम ब्याज पर लोन लेने में मदद करते हैं।" },
          content: { 
            en: "A Self-Help Group is a small group of women who pool their savings. You can take small loans from this pool at a very low interest rate compared to local moneylenders. It also empowers you to start small businesses together.", 
            hi: "स्वयं सहायता समूह महिलाओं का एक छोटा समूह होता है जो अपनी बचत इकट्ठा करते हैं। आप साहूकारों की तुलना में बहुत कम ब्याज दर पर यहां से छोटे लोन ले सकती हैं। यह आपको मिलकर छोटा व्यवसाय शुरू करने में भी मदद करता है।" 
          },
          category: { en: "Community", hi: "समुदाय" },
          difficulty: "Beginner",
          readTime: "3 min",
          thumbnailColor: "#ec4899"
        },
        {
          title: { en: "Maternity Benefit Schemes", hi: "मातृत्व लाभ योजनाएं" },
          summary: { en: "Financial help provided by the government during pregnancy.", hi: "गर्भावस्था के दौरान सरकार द्वारा दी जाने वाली वित्तीय सहायता।" },
          content: { 
            en: "Under schemes like PMMVY, pregnant women receive ₹5,000 directly into their bank account to help with nutrition and wage loss. Always keep your Aadhar and Bank passbook linked to claim this.", 
            hi: "PMMVY जैसी योजनाओं के तहत, गर्भवती महिलाओं को पोषण के लिए उनके बैंक खाते में सीधे ₹5,000 मिलते हैं। इसका लाभ उठाने के लिए हमेशा अपना आधार और बैंक पासबुक लिंक रखें।" 
          },
          category: { en: "Government Schemes", hi: "सरकारी योजनाएं" },
          difficulty: "Beginner",
          readTime: "4 min",
          thumbnailColor: "#8b5cf6"
        },
        {
          title: { en: "Avoiding Fake Lottery Scams", hi: "फर्जी लॉटरी घोटालों से बचना" },
          summary: { en: "Protect your hard-earned money from mobile scammers.", hi: "अपने मेहनत के पैसे को मोबाइल स्कैमर्स से बचाएं।" },
          content: { 
            en: "If you receive a WhatsApp message or SMS saying you won a lottery or a car, DO NOT click the link. If they ask you to pay a small 'processing fee' to get the big prize, it is 100% a scam.", 
            hi: "यदि आपको WhatsApp या SMS पर कोई संदेश मिलता है कि आपने लॉटरी या कार जीती है, तो लिंक पर क्लिक न करें। यदि वे बड़ा इनाम पाने के लिए आपसे 'प्रोसेसिंग फीस' मांगते हैं, तो यह 100% एक धोखा है।" 
          },
          category: { en: "Security", hi: "सुरक्षा" },
          difficulty: "Beginner",
          readTime: "2 min",
          thumbnailColor: "#ef4444"
        }
      ];
      await Lesson.insertMany(lessons);
    }

    // ----- SEED QUIZ QUESTIONS (Bilingual) -----
    const quizCount = await QuizQuestion.countDocuments();
    if (quizCount === 0) {
      const quizQuestions = [
        {
          question: { en: "Why is joining a Self-Help Group (SHG) beneficial for women?", hi: "महिलाओं के लिए स्वयं सहायता समूह (SHG) में शामिल होना क्यों फायदेमंद है?" },
          category: { en: "Community", hi: "समुदाय" },
          options: [
            { 
              text: { en: "You get free money without saving.", hi: "आपको बिना बचत किए मुफ्त पैसा मिलता है।" }, 
              isCorrect: false, 
              explanation: { en: "SHGs require regular savings, it is not free money.", hi: "SHG में नियमित बचत की आवश्यकता होती है, यह मुफ्त पैसा नहीं है।" } 
            },
            { 
              text: { en: "You can save together and get loans at very low interest rates.", hi: "आप एक साथ बचत कर सकते हैं और बहुत कम ब्याज दरों पर ऋण प्राप्त कर सकते हैं।" }, 
              isCorrect: true, 
              explanation: { en: "SHGs empower women to pool money and avoid expensive local moneylenders.", hi: "SHG महिलाओं को पैसे इकट्ठा करने और महंगे स्थानीय साहूकारों से बचने में सशक्त बनाता है।" } 
            }
          ]
        },
        {
          question: { en: "You are pregnant and eligible for the PMMVY scheme. How will you receive the ₹5,000?", hi: "आप गर्भवती हैं और PMMVY योजना के लिए पात्र हैं। आपको ₹5,000 कैसे मिलेंगे?" },
          category: { en: "Government Schemes", hi: "सरकारी योजनाएं" },
          options: [
            { 
              text: { en: "The Sarpanch will give you cash in hand.", hi: "सरपंच आपको नकद पैसे देंगे।" }, 
              isCorrect: false, 
              explanation: { en: "The government directly transfers the money to your bank account to prevent corruption.", hi: "भ्रष्टाचार को रोकने के लिए सरकार सीधे आपके बैंक खाते में पैसे ट्रांसफर करती है।" } 
            },
            { 
              text: { en: "It is deposited directly into your Aadhar-linked bank account.", hi: "यह सीधे आपके आधार-लिंक्ड बैंक खाते में जमा किया जाता है।" }, 
              isCorrect: true, 
              explanation: { en: "Direct Benefit Transfer (DBT) ensures the money safely reaches you.", hi: "प्रत्यक्ष लाभ हस्तांतरण (DBT) यह सुनिश्चित करता है कि पैसा सुरक्षित रूप से आप तक पहुंचे।" } 
            }
          ]
        },
        {
          question: { en: "A stranger calls saying your bank account is blocked and asks for your OTP to fix it. What should you do?", hi: "एक अजनबी कॉल करता है कि आपका बैंक खाता ब्लॉक है और इसे ठीक करने के लिए आपका OTP मांगता है। आपको क्या करना चाहिए?" },
          category: { en: "Security", hi: "सुरक्षा" },
          options: [
            { 
              text: { en: "Tell him the OTP quickly so your account is saved.", hi: "जल्दी से उसे OTP बता दें ताकि आपका खाता बच जाए।" }, 
              isCorrect: false, 
              explanation: { en: "Never share OTPs! The fraudster is trying to steal your money.", hi: "कभी भी OTP साझा न करें! धोखेबाज आपके पैसे चुराने की कोशिश कर रहा है।" } 
            },
            { 
              text: { en: "Disconnect the call immediately. Banks never ask for OTPs.", hi: "कॉल को तुरंत काट दें। बैंक कभी भी OTP नहीं मांगते।" }, 
              isCorrect: true, 
              explanation: { en: "You are absolutely correct. Your OTP is your secret key.", hi: "आप बिल्कुल सही हैं। आपका OTP आपकी गुप्त कुंजी है।" } 
            }
          ]
        }
      ];
      await QuizQuestion.insertMany(quizQuestions);
    }

    console.log("Database seed check completed.");
  } catch (error) {
    console.error("Error seeding:", error);
  }
}

module.exports = seedDB;
