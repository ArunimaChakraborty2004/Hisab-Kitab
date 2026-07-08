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
    await Lesson.deleteMany({});
    const lessons = [
      {
        title: { en: "Managing Daily Expenses", hi: "दैनिक खर्चों का प्रबंधन" },
        summary: { en: "Learn how to track your money, budget properly, and save more.", hi: "जानें कि अपने पैसे को कैसे ट्रैक करें, सही बजट कैसे बनाएं और अधिक बचत कैसे करें।" },
        content: { 
          en: "To build a secure future, track every rupee you spend. A good rule is 50-30-20. Keep 50% for needs like groceries, 30% for wants, and 20% for savings. Start by writing down your daily expenses in the Hisab-Kitab app so you can see where your money goes.", 
          hi: "सुरक्षित भविष्य बनाने के लिए, अपने हर खर्च को ट्रैक करें। 50-30-20 का नियम अपनाएं। 50% जरूरतों (किराने) के लिए, 30% इच्छाओं के लिए, और 20% बचत के लिए रखें। हिसाब-किताब ऐप में अपने दैनिक खर्च लिखकर शुरुआत करें।" 
        },
        category: { en: "Money Management", hi: "धन प्रबंधन" },
        difficulty: "Beginner",
        readTime: "3 min",
        thumbnailColor: "#10b981",
        youtubeId: "MUMbGLkc4yg"
      },
      {
        title: { en: "Financial Independence & Saving", hi: "वित्तीय स्वतंत्रता और बचत" },
        summary: { en: "Why saving money is crucial for women's financial independence.", hi: "महिलाओं की वित्तीय स्वतंत्रता के लिए पैसे बचाना क्यों महत्वपूर्ण है।" },
        content: { 
          en: "Having your own savings gives you financial independence and security during emergencies. Even saving ₹100 a week can build an emergency fund over time. Consider opening a secure bank account or joining reliable schemes like Sukanya Samriddhi Yojana for your daughters.", 
          hi: "अपनी खुद की बचत होना आपको आपात स्थिति के दौरान वित्तीय स्वतंत्रता और सुरक्षा देता है। सप्ताह में ₹100 बचाने से भी समय के साथ एक आपातकालीन फंड बन सकता है। एक सुरक्षित बैंक खाता खोलें या अपनी बेटियों के लिए सुकन्या समृद्धि योजना जैसी विश्वसनीय योजनाओं से जुड़ें।" 
        },
        category: { en: "Savings", hi: "बचत" },
        difficulty: "Intermediate",
        readTime: "4 min",
        thumbnailColor: "#ec4899",
        youtubeId: "rEWYxGI7NyU"
      },
      {
        title: { en: "PMJDY & Micro-Loans", hi: "PMJDY और माइक्रो-लोन" },
        summary: { en: "Learn how to open a zero-balance account and apply for small loans.", hi: "जीरो-बैलेंस खाता खोलने और छोटे लोन के लिए आवेदन करने का तरीका जानें।" },
        content: { 
          en: "The Pradhan Mantri Jan Dhan Yojana (PMJDY) allows you to open a bank account with zero balance. It also provides an overdraft facility of up to ₹10,000, which acts like a micro-loan for emergencies or small business needs. You can also look into Mudra loans for women entrepreneurs.", 
          hi: "प्रधानमंत्री जन धन योजना (PMJDY) आपको शून्य बैलेंस के साथ बैंक खाता खोलने की अनुमति देती है। यह ₹10,000 तक की ओवरड्राफ्ट सुविधा भी प्रदान करता है, जो आपात स्थिति या छोटी व्यावसायिक जरूरतों के लिए एक माइक्रो-लोन की तरह काम करता है।" 
        },
        category: { en: "Government Schemes", hi: "सरकारी योजनाएं" },
        difficulty: "Beginner",
        readTime: "3 min",
        thumbnailColor: "#3b82f6",
        youtubeId: "OA38czGuOxE"
      }
    ];
    await Lesson.insertMany(lessons);
    // ----- SEED QUIZ QUESTIONS (Bilingual) -----
    await QuizQuestion.deleteMany({});
    const quizCount = await QuizQuestion.countDocuments();
    if (quizCount === 0) {
      const quizQuestions = [
        {
          question: { en: "What is the 50-30-20 rule in budgeting?", hi: "बजट बनाने में 50-30-20 का नियम क्या है?" },
          category: { en: "Money Management", hi: "धन प्रबंधन" },
          options: [
            { 
              text: { en: "Spend 50% on wants, 30% on savings, 20% on needs.", hi: "इच्छाओं पर 50%, बचत पर 30%, जरूरतों पर 20% खर्च करें।" }, 
              isCorrect: false, 
              explanation: { en: "Incorrect. You should prioritize your needs and savings.", hi: "गलत। आपको अपनी जरूरतों और बचत को प्राथमिकता देनी चाहिए।" } 
            },
            { 
              text: { en: "Spend 50% on needs, 30% on wants, and save 20%.", hi: "जरूरतों पर 50%, इच्छाओं पर 30% खर्च करें और 20% बचाएं।" }, 
              isCorrect: true, 
              explanation: { en: "Correct! This rule helps you balance your expenses and build savings.", hi: "सही! यह नियम आपको अपने खर्चों को संतुलित करने और बचत बनाने में मदद करता है।" } 
            }
          ]
        },
        {
          question: { en: "Why is having an emergency fund important for women?", hi: "महिलाओं के लिए आपातकालीन फंड का होना क्यों महत्वपूर्ण है?" },
          category: { en: "Savings", hi: "बचत" },
          options: [
            { 
              text: { en: "It provides financial security and independence during unexpected events.", hi: "यह अप्रत्याशित घटनाओं के दौरान वित्तीय सुरक्षा और स्वतंत्रता प्रदान करता है।" }, 
              isCorrect: true, 
              explanation: { en: "Exactly. An emergency fund protects you without needing high-interest loans.", hi: "बिल्कुल। एक आपातकालीन फंड उच्च ब्याज वाले ऋण की आवश्यकता के बिना आपकी रक्षा करता है।" } 
            },
            { 
              text: { en: "It allows you to buy expensive jewelry anytime.", hi: "यह आपको किसी भी समय महंगे आभूषण खरीदने की अनुमति देता है।" }, 
              isCorrect: false, 
              explanation: { en: "Emergency funds are for urgent needs, not for luxury shopping.", hi: "आपातकालीन धन तत्काल जरूरतों के लिए है, लक्जरी खरीदारी के लिए नहीं।" } 
            }
          ]
        },
        {
          question: { en: "What is a major benefit of the PMJDY scheme?", hi: "PMJDY योजना का एक प्रमुख लाभ क्या है?" },
          category: { en: "Government Schemes", hi: "सरकारी योजनाएं" },
          options: [
            { 
              text: { en: "You get a guaranteed government job.", hi: "आपको सरकारी नौकरी की गारंटी मिलती है।" }, 
              isCorrect: false, 
              explanation: { en: "PMJDY is a financial scheme, it does not provide employment.", hi: "PMJDY एक वित्तीय योजना है, यह रोजगार प्रदान नहीं करती है।" } 
            },
            { 
              text: { en: "You can open a zero-balance bank account with an overdraft facility.", hi: "आप ओवरड्राफ्ट सुविधा के साथ जीरो-बैलेंस बैंक खाता खोल सकते हैं।" }, 
              isCorrect: true, 
              explanation: { en: "Yes! It ensures financial inclusion and provides small emergency loans via overdraft.", hi: "हाँ! यह वित्तीय समावेशन सुनिश्चित करता है और ओवरड्राफ्ट के माध्यम से छोटे आपातकालीन ऋण प्रदान करता है।" } 
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
