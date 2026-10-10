import fs from 'fs';

const rows = JSON.parse(fs.readFileSync('src/data/campusTransactions.json', 'utf8'));

console.log("Validating CampusKart Student Sales Dataset (47 rows):");
let sumPrice = 0, sumQty = 0, sumAge = 0;
const catSum = {}, yearSum = {}, paySum = {}, freqSum = {}, genderSum = {};
const catCount = {}, genderCount = {}, freqCount = {}, payCount = {};

rows.forEach((r, idx) => {
  sumPrice += r.total_amount;
  sumQty += r.quantity;
  sumAge += r.age;
  catSum[r.category] = (catSum[r.category] || 0) + r.total_amount;
  yearSum[r.year_of_study] = (yearSum[r.year_of_study] || 0) + r.total_amount;
  paySum[r.payment_method] = (paySum[r.payment_method] || 0) + r.total_amount;
  freqSum[r.purchase_frequency] = (freqSum[r.purchase_frequency] || 0) + r.total_amount;
  genderSum[r.gender] = (genderSum[r.gender] || 0) + r.total_amount;

  catCount[r.category] = (catCount[r.category] || 0) + 1;
  genderCount[r.gender] = (genderCount[r.gender] || 0) + 1;
  freqCount[r.purchase_frequency] = (freqCount[r.purchase_frequency] || 0) + 1;
  payCount[r.payment_method] = (payCount[r.payment_method] || 0) + 1;
});

const checks = [
  { name: "Customers count == 47", pass: rows.length === 47, val: rows.length },
  { name: "Average age == 19.15", pass: (sumAge / rows.length).toFixed(2) === "19.15", val: (sumAge / rows.length).toFixed(2) },
  { name: "Total quantity == 84", pass: sumQty === 84, val: sumQty },
  { name: "Average quantity per transaction == 1.79", pass: (sumQty / rows.length).toFixed(2) === "1.79", val: (sumQty / rows.length).toFixed(2) },
  { name: "Revenue == ₹9,819", pass: sumPrice === 9819, val: sumPrice },
  { name: "Average spend per customer == ₹208.91", pass: (sumPrice / rows.length).toFixed(2) === "208.91", val: (sumPrice / rows.length).toFixed(2) },
  { name: "Most common gender == Female", pass: Object.entries(genderCount).sort((a,b)=>b[1]-a[1])[0][0] === "Female", val: `${genderCount.Female} Female vs ${genderCount.Male} Male` },
  { name: "Most frequent category == Stationery", pass: Object.entries(catCount).sort((a,b)=>b[1]-a[1])[0][0] === "Stationery", val: `${catCount.Stationery} transactions` },
  { name: "Top payment == UPI", pass: Object.entries(payCount).sort((a,b)=>b[1]-a[1])[0][0] === "UPI", val: `${payCount.UPI} transactions` },
  { name: "Most common frequency == Once a Semester", pass: Object.entries(freqCount).sort((a,b)=>b[1]-a[1])[0][0] === "Once a Semester", val: `${freqCount['Once a Semester']} transactions` },
  { name: "Stationery == 3330", pass: catSum.Stationery === 3330, val: catSum.Stationery },
  { name: "Academic Essentials == 2910", pass: catSum['Academic Essentials'] === 2910, val: catSum['Academic Essentials'] },
  { name: "Tech Accessories == 2279", pass: catSum['Tech Accessories'] === 2279, val: catSum['Tech Accessories'] },
  { name: "Daily Consumables == 1300", pass: catSum['Daily Consumables'] === 1300, val: catSum['Daily Consumables'] },
  { name: "1st Year == 3390", pass: yearSum['1st Year'] === 3390, val: yearSum['1st Year'] },
  { name: "2nd Year == 2630", pass: yearSum['2nd Year'] === 2630, val: yearSum['2nd Year'] },
  { name: "4th Year == 1970", pass: yearSum['4th Year'] === 1970, val: yearSum['4th Year'] },
  { name: "3rd Year == 1829", pass: yearSum['3rd Year'] === 1829, val: yearSum['3rd Year'] },
  { name: "UPI == 7819", pass: paySum.UPI === 7819, val: paySum.UPI },
  { name: "Cash == 2000", pass: paySum.Cash === 2000, val: paySum.Cash },
  { name: "Once a Semester == 6989", pass: freqSum['Once a Semester'] === 6989, val: freqSum['Once a Semester'] },
  { name: "Monthly == 1920", pass: freqSum.Monthly === 1920, val: freqSum.Monthly },
  { name: "Weekly == 680", pass: freqSum.Weekly === 680, val: freqSum.Weekly },
  { name: "Bi-weekly == 230", pass: freqSum['Bi-weekly'] === 230, val: freqSum['Bi-weekly'] },
  { name: "Female == 5660", pass: genderSum.Female === 5660, val: genderSum.Female },
  { name: "Male == 4159", pass: genderSum.Male === 4159, val: genderSum.Male }
];

checks.forEach(c => {
  console.log(`${c.pass ? '✅' : '❌'} ${c.name} : ${c.val}`);
});
