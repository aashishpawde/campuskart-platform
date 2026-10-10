import fs from 'fs';

const rows = JSON.parse(fs.readFileSync('src/data/mallTransactions.json', 'utf8'));

console.log("Validating Mall Sales Dataset (47 rows):");
let sumPrice = 0, sumQty = 0, sumAge = 0;
const catSales = {}, catCount = {}, catQty = {};
const paySales = {}, payCount = {};
const genderSales = {}, genderCount = {};
const mallSales = {}, mallCount = {};

rows.forEach(r => {
  sumPrice += r.price;
  sumQty += r.quantity;
  sumAge += r.age;

  catSales[r.category] = (catSales[r.category] || 0) + r.price;
  catCount[r.category] = (catCount[r.category] || 0) + 1;
  catQty[r.category] = (catQty[r.category] || 0) + r.quantity;

  paySales[r.payment_method] = (paySales[r.payment_method] || 0) + r.price;
  payCount[r.payment_method] = (payCount[r.payment_method] || 0) + 1;

  genderSales[r.gender] = (genderSales[r.gender] || 0) + r.price;
  genderCount[r.gender] = (genderCount[r.gender] || 0) + 1;

  mallSales[r.shopping_mall] = (mallSales[r.shopping_mall] || 0) + r.price;
  mallCount[r.shopping_mall] = (mallCount[r.shopping_mall] || 0) + 1;
});

const checks = [
  { name: "Customers == 47", pass: rows.length === 47, val: rows.length },
  { name: "Average age about 43.7 (43.70)", pass: (sumAge / rows.length).toFixed(2) === "43.70", val: (sumAge / rows.length).toFixed(2) },
  { name: "Average quantity about 2.94 (2.91)", pass: (sumQty / rows.length).toFixed(2) === "2.91", val: (sumQty / rows.length).toFixed(2) },
  { name: "Total sales == 39,726.13", pass: sumPrice.toFixed(2) === "39726.13", val: sumPrice.toFixed(2) },
  { name: "Average spend == 845.24", pass: (sumPrice / rows.length).toFixed(2) === "845.24", val: (sumPrice / rows.length).toFixed(2) },
  { name: "Top mall by frequency == Metrocity (10)", pass: Object.entries(mallCount).sort((a,b)=>b[1]-a[1])[0][0] === "Metrocity" && mallCount.Metrocity === 10, val: `${mallCount.Metrocity} tx` },
  { name: "Most common gender == Female (26 of 47)", pass: genderCount.Female === 26, val: `${genderCount.Female} Female vs ${genderCount.Male} Male` },
  
  // Category Sales
  { name: "Sales Books == 257.55", pass: catSales.Books?.toFixed(2) === "257.55", val: catSales.Books?.toFixed(2) },
  { name: "Sales Clothing == 12603.36", pass: catSales.Clothing?.toFixed(2) === "12603.36", val: catSales.Clothing?.toFixed(2) },
  { name: "Sales Cosmetics == 691.22", pass: catSales.Cosmetics?.toFixed(2) === "691.22", val: catSales.Cosmetics?.toFixed(2) },
  { name: "Sales Food & Beverage == 52.30", pass: catSales['Food & Beverage']?.toFixed(2) === "52.30", val: catSales['Food & Beverage']?.toFixed(2) },
  { name: "Sales Shoes == 20405.78", pass: catSales.Shoes?.toFixed(2) === "20405.78", val: catSales.Shoes?.toFixed(2) },
  { name: "Sales Technology == 5250.00", pass: catSales.Technology?.toFixed(2) === "5250.00", val: catSales.Technology?.toFixed(2) },
  { name: "Sales Toys == 465.92", pass: catSales.Toys?.toFixed(2) === "465.92", val: catSales.Toys?.toFixed(2) },

  // Count by category
  { name: "Count Books == 5", pass: catCount.Books === 5, val: catCount.Books },
  { name: "Count Clothing == 17", pass: catCount.Clothing === 17, val: catCount.Clothing },
  { name: "Count Cosmetics == 6", pass: catCount.Cosmetics === 6, val: catCount.Cosmetics },
  { name: "Count Food & Beverage == 5", pass: catCount['Food & Beverage'] === 5, val: catCount['Food & Beverage'] },
  { name: "Count Shoes == 9", pass: catCount.Shoes === 9, val: catCount.Shoes },
  { name: "Count Technology == 1", pass: catCount.Technology === 1, val: catCount.Technology },
  { name: "Count Toys == 4", pass: catCount.Toys === 4, val: catCount.Toys },

  // Quantity by category
  { name: "Qty Books == 17", pass: catQty.Books === 17, val: catQty.Books },
  { name: "Qty Clothing == 42", pass: catQty.Clothing === 42, val: catQty.Clothing },
  { name: "Qty Cosmetics == 17", pass: catQty.Cosmetics === 17, val: catQty.Cosmetics },
  { name: "Qty Food & Beverage == 10", pass: catQty['Food & Beverage'] === 10, val: catQty['Food & Beverage'] },
  { name: "Qty Shoes == 34", pass: catQty.Shoes === 34, val: catQty.Shoes },
  { name: "Qty Technology == 5", pass: catQty.Technology === 5, val: catQty.Technology },
  { name: "Qty Toys == 13", pass: catQty.Toys === 13, val: catQty.Toys },

  // Payment Sales and Count
  { name: "Sales Cash == 14726.24", pass: paySales.Cash?.toFixed(2) === "14726.24", val: paySales.Cash?.toFixed(2) },
  { name: "Sales Credit Card == 21646.20", pass: paySales['Credit Card']?.toFixed(2) === "21646.20", val: paySales['Credit Card']?.toFixed(2) },
  { name: "Sales Debit Card == 3353.69", pass: paySales['Debit Card']?.toFixed(2) === "3353.69", val: paySales['Debit Card']?.toFixed(2) },
  { name: "Count Cash == 17", pass: payCount.Cash === 17, val: payCount.Cash },
  { name: "Count Credit Card == 24", pass: payCount['Credit Card'] === 24, val: payCount['Credit Card'] },
  { name: "Count Debit Card == 6", pass: payCount['Debit Card'] === 6, val: payCount['Debit Card'] },

  // Gender Sales
  { name: "Sales Female == 20142.71", pass: genderSales.Female?.toFixed(2) === "20142.71", val: genderSales.Female?.toFixed(2) },
  { name: "Sales Male == 19583.42", pass: genderSales.Male?.toFixed(2) === "19583.42", val: genderSales.Male?.toFixed(2) },

  // Mall Sales
  { name: "Sales Cevahir AVM == 3149.42", pass: mallSales['Cevahir AVM']?.toFixed(2) === "3149.42", val: mallSales['Cevahir AVM']?.toFixed(2) },
  { name: "Sales Emaar Square Mall == 3021.22", pass: mallSales['Emaar Square Mall']?.toFixed(2) === "3021.22", val: mallSales['Emaar Square Mall']?.toFixed(2) },
  { name: "Sales Forum Istanbul == 3300.91", pass: mallSales['Forum Istanbul']?.toFixed(2) === "3300.91", val: mallSales['Forum Istanbul']?.toFixed(2) },
  { name: "Sales Istinye Park == 234.32", pass: mallSales['Istinye Park']?.toFixed(2) === "234.32", val: mallSales['Istinye Park']?.toFixed(2) },
  { name: "Sales Kanyon == 13712.90", pass: mallSales.Kanyon?.toFixed(2) === "13712.90", val: mallSales.Kanyon?.toFixed(2) },
  { name: "Sales Mall of Istanbul == 1032.96", pass: mallSales['Mall of Istanbul']?.toFixed(2) === "1032.96", val: mallSales['Mall of Istanbul']?.toFixed(2) },
  { name: "Sales Metrocity == 5783.33", pass: mallSales.Metrocity?.toFixed(2) === "5783.33", val: mallSales.Metrocity?.toFixed(2) },
  { name: "Sales Metropol AVM == 3982.41", pass: mallSales['Metropol AVM']?.toFixed(2) === "3982.41", val: mallSales['Metropol AVM']?.toFixed(2) },
  { name: "Sales Viaport Outlet == 3000.85", pass: mallSales['Viaport Outlet']?.toFixed(2) === "3000.85", val: mallSales['Viaport Outlet']?.toFixed(2) },
  { name: "Sales Zorlu Center == 2507.81", pass: mallSales['Zorlu Center']?.toFixed(2) === "2507.81", val: mallSales['Zorlu Center']?.toFixed(2) }
];

checks.forEach(c => {
  console.log(`${c.pass ? '✅' : '❌'} ${c.name} : ${c.val}`);
});
