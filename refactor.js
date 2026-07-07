const fs = require('fs');
const path = 'src/TransactionsPage.jsx';
let content = fs.readFileSync(path, 'utf8');

// Fix CSV Date Export issue
content = content.replace(
  'const rows = filteredTransactions.map(t => [t.date, t.type, t.label, t.amount]);',
  'const rows = filteredTransactions.map(t => ["=\"" + t.date + "\"", t.type, t.label, t.amount]);'
);

// Extract CSS
const startRegex = /const embeddedStyle = `([\s\S]*?)`;/;
const match = content.match(startRegex);

if (match) {
  fs.writeFileSync('src/TransactionsPage.scss', match[1].trim() + '\n');
  
  // Remove embedded style block
  content = content.replace(/ \/\/ embedded CSS inside component \([\s\S]*?const embeddedStyle = `[\s\S]*?`;/, '');
  
  // Add import
  content = content.replace('import { t } from "./translations";', 'import { t } from "./translations";\nimport "./TransactionsPage.scss";');
  
  // Remove <style>{embeddedStyle}</style>
  content = content.replace(/<style>{embeddedStyle}<\/style>/g, '');
  
  fs.writeFileSync(path, content);
  console.log('Successfully refactored CSS to SCSS and fixed CSV date format!');
} else {
  console.log('Could not find embedded style block');
}
