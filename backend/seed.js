require('dotenv').config();
const mongoose = require('mongoose');
const Scheme = require('./models/Scheme');
const SavingsPlan = require('./models/SavingsPlan');

const initialSchemes = [
  { title: 'myScheme Portal', desc: 'National one‑stop platform to discover and apply for government schemes.', link: 'https://www.myscheme.gov.in', category: 'general', icon: '🏛️' },
  { title: 'Pradhan Mantri Matru Vandana Yojana (PMMVY)', desc: 'Cash incentive scheme for pregnant and lactating women.', link: 'https://pmmvy.gov.in', category: 'health', icon: '🤰' },
  { title: 'Stand Up India', desc: 'Loans for women entrepreneurs to start new ventures.', link: 'https://www.standupmitra.in', category: 'business', icon: '💼' },
  { title: 'Sukanya Samriddhi Yojana', desc: 'Savings scheme for girl children (via banks/post offices).', link: 'https://www.indiapost.gov.in/Financial/Pages/Content/Post-Office-Savings-Schemes.aspx', category: 'savings', icon: '👧' },
  { title: 'Ujjawala Scheme', desc: 'Rescue, rehabilitation, and reintegration of trafficked women.', link: 'https://wcd.nic.in/schemes/ujjawala-scheme', category: 'health', icon: '🤝' },
  { title: 'Working Women Hostel', desc: 'Safe and affordable accommodation for working women.', link: 'https://wcd.nic.in/schemes/working-women-hostel', category: 'general', icon: '🏢' },
  { title: 'One Stop Centre Scheme', desc: 'Support services for women facing violence.', link: 'https://wcd.nic.in/schemes/one-stop-centre-scheme', category: 'health', icon: '🛡️' }
];

const initialSavingsPlans = [
  { planId: "monthly-goal", title: "Emergency Fund", desc: "Save ₹5,000 every month for peace of mind.", defaultAmount: 5000, defaultMonths: 60, defaultRate: 7.5 },
  { planId: "child-edu", title: "Child Education", desc: "Start small with ₹2,000 monthly for the future.", defaultAmount: 2000, defaultMonths: 120, defaultRate: 8.0 },
  { planId: "festival-fund", title: "Festival Fund", desc: "Save ₹1,000 monthly for holiday spending.", defaultAmount: 1000, defaultMonths: 12, defaultRate: 5.0 }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    // Seed Schemes
    const schemeCount = await Scheme.countDocuments();
    if (schemeCount === 0) {
      await Scheme.insertMany(initialSchemes);
      console.log("Seeded initial Schemes.");
    } else {
      console.log("Schemes already exist, skipping.");
    }

    // Seed Savings Plans
    const savingsCount = await SavingsPlan.countDocuments();
    if (savingsCount === 0) {
      await SavingsPlan.insertMany(initialSavingsPlans);
      console.log("Seeded initial Savings Plans.");
    } else {
      console.log("Savings Plans already exist, skipping.");
    }

    mongoose.connection.close();
    console.log("Done seeding.");
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

seedDB();
