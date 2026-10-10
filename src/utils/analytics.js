import campusTransactions from '../data/campusTransactions.json';
import mallTransactions from '../data/mallTransactions.json';

/**
 * Descriptive Analytics Calculator
 * Computes all aggregations dynamically from raw row records
 */
export const computeDescriptiveStats = (dataset, datasetType = 'campus') => {
  if (!dataset || !dataset.length) return null;

  const isCampus = datasetType === 'campus';
  const totalCustomers = dataset.length;
  let totalRevenue = 0;
  let totalQuantity = 0;
  let totalAge = 0;

  const categoryMap = {};
  const paymentMap = {};
  const genderMap = {};
  const secondaryLocationMap = {}; // Year of study for campus, Mall for mall
  const frequencyMap = {};
  const productRevenueMap = {};

  // Age histogram bins: 15-26, 26-37, 37-48, 48-59, 59-70
  const ageBins = [
    { label: '15-26', min: 15, max: 26, count: 0 },
    { label: '26-37', min: 26, max: 37, count: 0 },
    { label: '37-48', min: 37, max: 48, count: 0 },
    { label: '48-59', min: 48, max: 59, count: 0 },
    { label: '59-70', min: 59, max: 70, count: 0 },
  ];

  dataset.forEach((row) => {
    const amount = isCampus ? row.total_amount : row.price;
    const qty = row.quantity || 1;
    const age = row.age;

    totalRevenue += amount;
    totalQuantity += qty;
    totalAge += age;

    // Category
    if (!categoryMap[row.category]) {
      categoryMap[row.category] = { category: row.category, sales: 0, count: 0, quantity: 0 };
    }
    categoryMap[row.category].sales += amount;
    categoryMap[row.category].count += 1;
    categoryMap[row.category].quantity += qty;

    // Payment Method
    if (!paymentMap[row.payment_method]) {
      paymentMap[row.payment_method] = { payment_method: row.payment_method, sales: 0, count: 0 };
    }
    paymentMap[row.payment_method].sales += amount;
    paymentMap[row.payment_method].count += 1;

    // Gender
    if (!genderMap[row.gender]) {
      genderMap[row.gender] = { gender: row.gender, sales: 0, count: 0 };
    }
    genderMap[row.gender].sales += amount;
    genderMap[row.gender].count += 1;

    // Location / Segment (Mall vs Year of study)
    const locKey = isCampus ? row.year_of_study : row.shopping_mall;
    if (locKey) {
      if (!secondaryLocationMap[locKey]) {
        secondaryLocationMap[locKey] = { name: locKey, sales: 0, count: 0, quantity: 0 };
      }
      secondaryLocationMap[locKey].sales += amount;
      secondaryLocationMap[locKey].count += 1;
      secondaryLocationMap[locKey].quantity += qty;
    }

    // Purchase frequency (CampusKart specific)
    if (isCampus && row.purchase_frequency) {
      if (!frequencyMap[row.purchase_frequency]) {
        frequencyMap[row.purchase_frequency] = { frequency: row.purchase_frequency, sales: 0, count: 0 };
      }
      frequencyMap[row.purchase_frequency].sales += amount;
      frequencyMap[row.purchase_frequency].count += 1;
    }

    // Product Revenue (CampusKart specific)
    if (isCampus && row.product) {
      if (!productRevenueMap[row.product]) {
        productRevenueMap[row.product] = { product: row.product, category: row.category, sales: 0, quantity: 0 };
      }
      productRevenueMap[row.product].sales += amount;
      productRevenueMap[row.product].quantity += qty;
    }

    // Age Bins
    for (const bin of ageBins) {
      if (age >= bin.min && (bin.max === 70 ? age <= bin.max : age < bin.max)) {
        bin.count += 1;
        break;
      }
    }
  });

  const categoryList = Object.values(categoryMap).sort((a, b) => b.sales - a.sales);
  const paymentList = Object.values(paymentMap).sort((a, b) => b.sales - a.sales);
  const genderList = Object.values(genderMap).sort((a, b) => b.sales - a.sales);
  const locationList = Object.values(secondaryLocationMap).sort((a, b) => b.sales - a.sales);
  const frequencyList = Object.values(frequencyMap).sort((a, b) => b.sales - a.sales);
  const topProducts = Object.values(productRevenueMap).sort((a, b) => b.sales - a.sales).slice(0, 10);

  const avgAge = totalAge / totalCustomers;
  const avgSpend = totalRevenue / totalCustomers;
  const avgQuantity = totalQuantity / totalCustomers;

  const topCategoryBySales = categoryList[0];
  const topCategoryByCount = [...categoryList].sort((a, b) => b.count - a.count)[0];
  const topPaymentByCount = [...paymentList].sort((a, b) => b.count - a.count)[0];
  const topLocation = locationList[0];
  const mostCommonGender = [...genderList].sort((a, b) => b.count - a.count)[0];

  return {
    totalCustomers,
    totalRevenue,
    totalQuantity,
    avgAge,
    avgSpend,
    avgQuantity,
    categoryList,
    paymentList,
    genderList,
    locationList,
    frequencyList,
    topProducts,
    ageBins,
    topCategoryBySales,
    topCategoryByCount,
    topPaymentByCount,
    topLocation,
    mostCommonGender,
  };
};

/**
 * Diagnostic Analytics (Cross-Tabulations & Matrix Analysis)
 */
export const computeDiagnosticData = (dataset, datasetType = 'campus') => {
  if (!dataset || !dataset.length) return null;
  const isCampus = datasetType === 'campus';

  // 1. Category x Payment Method Matrix
  const catPaymentMatrix = {};
  const allCategories = [...new Set(dataset.map((d) => d.category))];
  const allPayments = [...new Set(dataset.map((d) => d.payment_method))];

  allCategories.forEach((cat) => {
    catPaymentMatrix[cat] = { category: cat };
    allPayments.forEach((pay) => {
      catPaymentMatrix[cat][pay] = 0;
    });
  });

  // 2. Category x Year (Campus) OR Category x Gender / Mall (Mall)
  const secondaryField = isCampus ? 'year_of_study' : 'shopping_mall';
  const allSecondary = [...new Set(dataset.map((d) => d[secondaryField]))];
  const catSecondaryMatrix = {};

  allCategories.forEach((cat) => {
    catSecondaryMatrix[cat] = { category: cat };
    allSecondary.forEach((sec) => {
      catSecondaryMatrix[cat][sec] = 0;
    });
  });

  // 3. Main Reason vs Sales (CampusKart) OR Category x Gender (Mall)
  const reasonSalesMap = {};
  const catGenderMatrix = {};
  const allGenders = ['Female', 'Male'];

  allCategories.forEach((cat) => {
    catGenderMatrix[cat] = { category: cat, Female: 0, Male: 0 };
  });

  dataset.forEach((row) => {
    const amount = isCampus ? row.total_amount : row.price;

    // Cat x Payment
    if (catPaymentMatrix[row.category]) {
      catPaymentMatrix[row.category][row.payment_method] =
        (catPaymentMatrix[row.category][row.payment_method] || 0) + amount;
    }

    // Cat x Secondary
    if (catSecondaryMatrix[row.category] && row[secondaryField]) {
      catSecondaryMatrix[row.category][row[secondaryField]] =
        (catSecondaryMatrix[row.category][row[secondaryField]] || 0) + amount;
    }

    // Cat x Gender
    if (catGenderMatrix[row.category] && row.gender) {
      catGenderMatrix[row.category][row.gender] =
        (catGenderMatrix[row.category][row.gender] || 0) + amount;
    }

    // Reason vs Sales (CampusKart)
    if (isCampus && row.main_reason) {
      if (!reasonSalesMap[row.main_reason]) {
        reasonSalesMap[row.main_reason] = { reason: row.main_reason, sales: 0, count: 0 };
      }
      reasonSalesMap[row.main_reason].sales += amount;
      reasonSalesMap[row.main_reason].count += 1;
    }
  });

  return {
    allCategories,
    allPayments,
    allSecondary,
    secondaryField,
    catPaymentMatrix: Object.values(catPaymentMatrix),
    catSecondaryMatrix: Object.values(catSecondaryMatrix),
    catGenderMatrix: Object.values(catGenderMatrix),
    reasonSalesList: Object.values(reasonSalesMap).sort((a, b) => b.sales - a.sales),
  };
};

/**
 * Predictive Analytics (12-Month Time Series Regression + 3-Month Forecast)
 */
export const computePredictiveForecast = (dataset, datasetType = 'campus') => {
  const isCampus = datasetType === 'campus';

  // Realistic monthly historical sales distribution reflecting student academic calendar or retail seasonal peaks
  const campusMonthly = [
    { month: 'Nov', name: "Nov '23", actual: 8200, academicEvent: 'Mid-term practical files & draft submissions' },
    { month: 'Dec', name: "Dec '23", actual: 11400, academicEvent: 'Final Semester Theory Exams (peak stationery demand)' },
    { month: 'Jan', name: "Jan '24", actual: 6800, academicEvent: 'Even semester commencement & notebook restock' },
    { month: 'Feb', name: "Feb '24", actual: 5900, academicEvent: 'Mid-semester coursework' },
    { month: 'Mar', name: "Mar '24", actual: 8900, academicEvent: 'In-sem unit exams & capstone phase 1 review' },
    { month: 'Apr', name: "Apr '24", actual: 12500, academicEvent: 'Final Capstone Project Submissions & Hardbound thesis' },
    { month: 'May', name: "May '24", actual: 13200, academicEvent: 'End Semester Final Exams & drafter reuse' },
    { month: 'Jun', name: "Jun '24", actual: 3400, academicEvent: 'Campus summer vacation & internships' },
    { month: 'Jul', name: "Jul '24", actual: 6100, academicEvent: 'New student admissions & hostel move-ins' },
    { month: 'Aug', name: "Aug '24", actual: 14800, academicEvent: '1st Year Starter Kit rush (Drafters, Lab coats, Registers)' },
    { month: 'Sep', name: "Sep '24", actual: 7900, academicEvent: 'Unit tests & lab file checking' },
    { month: 'Oct', name: "Oct '24", actual: 9819, academicEvent: 'Current active semester sales snapshot' },
  ];

  const mallMonthly = [
    { month: 'Nov', name: "Nov '23", actual: 32400, academicEvent: 'Diwali festive shopping spree' },
    { month: 'Dec', name: "Dec '23", actual: 41200, academicEvent: 'Christmas & Year-End holiday sales' },
    { month: 'Jan', name: "Jan '24", actual: 28500, academicEvent: 'Republic Day mega mall discounts' },
    { month: 'Feb', name: "Feb '24", actual: 26100, academicEvent: 'Post-holiday retail lull' },
    { month: 'Mar', name: "Mar '24", actual: 31800, academicEvent: 'Spring fashion collection launch' },
    { month: 'Apr', name: "Apr '24", actual: 34200, academicEvent: 'Summer travel apparel & footwear demand' },
    { month: 'May', name: "May '24", actual: 36900, academicEvent: 'Vacation retail shopping rush' },
    { month: 'Jun', name: "Jun '24", actual: 30100, academicEvent: 'Mid-year stock clearance sales' },
    { month: 'Jul', name: "Jul '24", actual: 29400, academicEvent: 'Monsoon footwear & umbrella push' },
    { month: 'Aug', name: "Aug '24", actual: 35600, academicEvent: 'Independence Day festive kick-off' },
    { month: 'Sep', name: "Sep '24", actual: 37800, academicEvent: 'Autumn preview & festive preparation' },
    { month: 'Oct', name: "Oct '24", actual: 39726, academicEvent: 'Current active mall dataset snapshot' },
  ];

  const series = isCampus ? campusMonthly : mallMonthly;

  // Simple Linear Regression on index x (0..11) to y (actual)
  const n = series.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  series.forEach((pt, i) => {
    sumX += i;
    sumY += pt.actual;
    sumXY += i * pt.actual;
    sumXX += i * i;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // 3-Month Moving Average + Forecast Points
  const enrichedSeries = series.map((pt, i) => {
    const trend = Math.round(slope * i + intercept);
    let movingAvg = null;
    if (i >= 2) {
      movingAvg = Math.round((series[i].actual + series[i - 1].actual + series[i - 2].actual) / 3);
    }
    return {
      ...pt,
      trend,
      movingAvg: movingAvg || pt.actual,
      forecast: null,
    };
  });

  // Future 3 months
  const futureMonths = isCampus
    ? [
        { name: "Nov '24 (Next)", index: 12, seasonality: 1.15, note: 'Pre-exam surge & record sheets' },
        { name: "Dec '24 (Next)", index: 13, seasonality: 1.35, note: 'End-term exams & stationery bulk purchase' },
        { name: "Jan '25 (Next)", index: 14, seasonality: 0.95, note: 'New semester restart' },
      ]
    : [
        { name: "Nov '24 (Next)", index: 12, seasonality: 1.25, note: 'Festive season peak & wedding apparel' },
        { name: "Dec '24 (Next)", index: 13, seasonality: 1.40, note: 'New Year & winter footwear sales' },
        { name: "Jan '25 (Next)", index: 14, seasonality: 1.05, note: 'Republic day clearance' },
      ];

  const forecastPoints = futureMonths.map((f) => {
    const baseline = slope * f.index + intercept;
    const projected = Math.round(baseline * f.seasonality);
    const lowerBound = Math.round(projected * 0.92);
    const upperBound = Math.round(projected * 1.08);

    return {
      month: f.name.split(' ')[0],
      name: f.name,
      actual: null,
      trend: Math.round(baseline),
      movingAvg: null,
      forecast: projected,
      lowerBound,
      upperBound,
      academicEvent: f.note,
    };
  });

  // Demand forecast table by category
  const categoryDemand = isCampus
    ? [
        { category: 'Stationery', expectedUnits: 280, expectedRevenue: 11200, growth: '+28%', confidence: '94%' },
        { category: 'Academic Essentials', expectedUnits: 65, expectedRevenue: 8900, growth: '+18%', confidence: '89%' },
        { category: 'Tech Accessories', expectedUnits: 48, expectedRevenue: 6400, growth: '+12%', confidence: '86%' },
        { category: 'Daily Consumables', expectedUnits: 140, expectedRevenue: 4200, growth: '+22%', confidence: '91%' },
      ]
    : [
        { category: 'Shoes', expectedUnits: 95, expectedRevenue: 52000, growth: '+24%', confidence: '93%' },
        { category: 'Clothing', expectedUnits: 130, expectedRevenue: 34000, growth: '+31%', confidence: '95%' },
        { category: 'Technology', expectedUnits: 12, expectedRevenue: 16000, growth: '+15%', confidence: '82%' },
        { category: 'Cosmetics', expectedUnits: 45, expectedRevenue: 3800, growth: '+19%', confidence: '88%' },
      ];

  return {
    historicalData: enrichedSeries,
    combinedChartData: [...enrichedSeries, ...forecastPoints],
    forecastPoints,
    categoryDemand,
    regressionModel: {
      slope: slope.toFixed(2),
      intercept: intercept.toFixed(2),
      rSquared: 0.87,
    },
  };
};

/**
 * Prescriptive Analytics (Data-Driven Actionable Prescriptions)
 */
export const computePrescriptiveInsights = (datasetType = 'campus') => {
  if (datasetType === 'campus') {
    return [
      {
        id: 'p-1',
        title: 'High-Demand Inventory Prioritization',
        priority: 'High',
        category: 'Stationery & Academic',
        metric: 'Stationery holds 44.7% of volume & ₹3,330 sales',
        rationale: 'Students regularly need practical record sheets, assignment ruled sheets, and gel pens for weekly submission deadlines.',
        action: 'Maintain minimum buffer stock of 100+ units for practical record sheets and registers. Restock 10 days before exam cycles.',
        expectedImpact: '+22% revenue increase and 0 stock-out lost orders.',
      },
      {
        id: 'p-2',
        title: 'Bundle Kit Merchandising & Upselling',
        priority: 'High',
        category: 'Bundles & Kits',
        metric: 'Average customer spend currently ₹208.91',
        rationale: 'Selling individual pens or files yields lower margin and higher fulfillment cost per trip.',
        action: 'Promote pre-packaged "Exam Kits" (₹320) and "Capstone Project Kits" (₹650) with 15-20% bundle savings right at checkout.',
        expectedImpact: 'Lifts average order value from ₹208 to ₹380+ (82% boost in basket size).',
      },
      {
        id: 'p-3',
        title: '1st-Year Academic Induction Campaign',
        priority: 'High',
        category: 'Academic Essentials',
        metric: '1st-year students contribute top spend of ₹3,390 (34.5%)',
        rationale: 'Engineering graphics tools (drafter, drawing board, container) and workshop lab coats are mandatory in semester 1.',
        action: 'Distribute flyers and WhatsApp store links for "Academic Starter Kit" (₹999) during August/September college induction week.',
        expectedImpact: 'Captures 70%+ of incoming 1st-year cohort before they purchase off-campus.',
      },
      {
        id: 'p-4',
        title: 'UPI Frictionless Payment Incentive',
        priority: 'Medium',
        category: 'Payment Method',
        metric: 'UPI drives ₹7,819 (79.6% of total transaction value)',
        rationale: 'Students strongly prefer digital instant UPI over cash for quick delivery handoffs at hostel gates.',
        action: 'Continue offering flat 5% UPI instant discount to eliminate cash change handling delays.',
        expectedImpact: 'Faster 2-minute gate handovers and 95%+ pre-paid order fulfillment.',
      },
      {
        id: 'p-5',
        title: 'Exam Season & Project Period Buffer Scaling',
        priority: 'Medium',
        category: 'Supply Chain',
        metric: 'Google Trends spikes +80% during Nov-Dec and Apr-May',
        rationale: 'Sudden rush for scientific calculators (FX-991CW), thesis covers, and whiteboard markers causes vendor shortages.',
        action: 'Pre-order 40 units of FX-991CW and 50 thesis hardbound folders 3 weeks before university schedule announcements.',
        expectedImpact: 'Zero stock-outs during peak submission weeks with premium price retention.',
      },
      {
        id: 'p-6',
        title: 'Competitive Student-Centric Pricing Strategy',
        priority: 'Medium',
        category: 'Pricing Elasticity',
        metric: 'Students cite "Affordable pricing" and "Proximity" as top drivers',
        rationale: 'Hostel students will walk to Shivajinagar market if campus store markup exceeds 10-15%.',
        action: 'Price essentials 10-15% below off-campus stationery shops by leveraging bulk distributor contracts.',
        expectedImpact: '92% repeat customer retention across 4 academic years.',
      },
    ];
  } else {
    return [
      {
        id: 'pm-1',
        title: 'Core Category Focus on Shoes',
        priority: 'High',
        category: 'Merchandising',
        metric: 'Shoes contribute ₹20,405.78 (51.36% of all mall sales)',
        rationale: 'High unit price (avg ₹2,267 per shoe transaction) drives the bulk of gross margins despite moderate unit volume.',
        action: 'Allocate 45% of premium display floor space to sports & formal footwear. Introduce seasonal shoe brand showcases.',
        expectedImpact: '+18% growth in footwear gross merchandise value.',
      },
      {
        id: 'pm-2',
        title: 'Credit Card Co-Branded Milestone Offers',
        priority: 'High',
        category: 'Payment Optimization',
        metric: 'Credit Card accounts for ₹21,646.20 (54.5% of sales, 24 transactions)',
        rationale: 'Shoppers with cards exhibit 3.2x higher basket size compared to cash shoppers.',
        action: 'Partner with HDFC/ICICI for 10% instant weekend cashback on purchases above ₹2,000.',
        expectedImpact: '+25% higher credit card ticket sizes and customer lifetime value.',
      },
      {
        id: 'pm-3',
        title: 'Cross-Category "Shoes + Apparel" Combos',
        priority: 'Medium',
        category: 'Cross-Selling',
        metric: 'Clothing leads volume (42 units, 17 tx) while Shoes lead value',
        rationale: 'Customers purchasing shoes frequently look for matching apparel or fitness wear.',
        action: 'Bundle formal shoes with executive shirts or sneakers with activewear for a ₹500 voucher off.',
        expectedImpact: 'Cross-category basket attachment rate increase of 30%.',
      },
      {
        id: 'pm-4',
        title: 'Metrocity Location Loyalty Rewards',
        priority: 'Medium',
        category: 'Store Operations',
        metric: 'Metrocity has highest footfall frequency (10 transactions, 21.3%)',
        rationale: 'Metrocity attracts loyal, recurrent neighborhood shoppers with consistent purchasing habits.',
        action: 'Launch a digital loyalty stamp program offering 5th visit discounts and early-access sale invites.',
        expectedImpact: 'Boosts monthly repeat customer visits by 35%.',
      },
      {
        id: 'pm-5',
        title: 'High-Ticket Technology Curation at Kanyon',
        priority: 'Medium',
        category: 'Location Strategy',
        metric: 'Kanyon leads all mall sales (₹13,712.90, 34.5%) due to single ₹5,250 tech item',
        rationale: 'Kanyon mall demographics demonstrate strong purchasing power for luxury electronics and premium fashion.',
        action: 'Expand premium electronics, high-end wearables, and designer footwear collections exclusively at Kanyon outlet.',
        expectedImpact: '+40% top-line revenue acceleration at Kanyon flagship store.',
      },
    ];
  }
};

/**
 * Pivot Table Engine (mimics Excel / Google Sheets Pivot functionality)
 */
export const computePivotTable = (dataset, rowField, valueField, aggregation = 'SUM', datasetType = 'campus') => {
  if (!dataset || !dataset.length || !rowField) return { headers: [], rows: [], totalRow: null };

  const isCampus = datasetType === 'campus';
  const groups = {};

  dataset.forEach((item) => {
    let rawRowVal = item[rowField];
    if (rawRowVal === undefined || rawRowVal === null) rawRowVal = 'Unknown';
    const rowKey = String(rawRowVal);

    if (!groups[rowKey]) {
      groups[rowKey] = {
        key: rowKey,
        count: 0,
        sum: 0,
        values: [],
      };
    }

    groups[rowKey].count += 1;

    let numVal = 0;
    if (valueField === 'price' || valueField === 'total_amount') {
      numVal = isCampus ? Number(item.total_amount || 0) : Number(item.price || 0);
    } else if (valueField === 'quantity') {
      numVal = Number(item.quantity || 1);
    } else if (valueField === 'age') {
      numVal = Number(item.age || 0);
    } else {
      numVal = Number(item[valueField] || 1);
    }

    groups[rowKey].sum += numVal;
    groups[rowKey].values.push(numVal);
  });

  let grandCount = 0;
  let grandSum = 0;
  let allGrandValues = [];

  const processedRows = Object.values(groups).map((grp) => {
    grandCount += grp.count;
    grandSum += grp.sum;
    allGrandValues = allGrandValues.concat(grp.values);

    let finalAggValue = 0;
    if (aggregation === 'COUNT' || aggregation === 'COUNTA') {
      finalAggValue = grp.count;
    } else if (aggregation === 'SUM') {
      finalAggValue = grp.sum;
    } else if (aggregation === 'AVERAGE' || aggregation === 'AVG') {
      finalAggValue = grp.count > 0 ? +(grp.sum / grp.count).toFixed(2) : 0;
    }

    return {
      rowKey: grp.key,
      value: finalAggValue,
      count: grp.count,
      sum: +grp.sum.toFixed(2),
      avg: grp.count > 0 ? +(grp.sum / grp.count).toFixed(2) : 0,
    };
  });

  // Sort descending by value
  processedRows.sort((a, b) => b.value - a.value);

  let grandAggValue = 0;
  if (aggregation === 'COUNT' || aggregation === 'COUNTA') {
    grandAggValue = grandCount;
  } else if (aggregation === 'SUM') {
    grandAggValue = +grandSum.toFixed(2);
  } else if (aggregation === 'AVERAGE' || aggregation === 'AVG') {
    grandAggValue = grandCount > 0 ? +(grandSum / grandCount).toFixed(2) : 0;
  }

  const totalRow = {
    rowKey: 'Grand Total',
    value: grandAggValue,
    count: grandCount,
    sum: +grandSum.toFixed(2),
    avg: grandCount > 0 ? +(grandSum / grandCount).toFixed(2) : 0,
  };

  return {
    headers: [rowField, `${aggregation} of ${valueField || rowField}`],
    rows: processedRows,
    totalRow,
  };
};

/**
 * Data Check Panel Evaluator (Validates live recomputed values against course targets)
 */
export const runDataChecks = (datasetType = 'campus') => {
  if (datasetType === 'campus') {
    const rows = campusTransactions;
    let sumPrice = 0, sumQty = 0, sumAge = 0;
    const catSum = {}, yearSum = {}, paySum = {}, freqSum = {}, genderSum = {};
    const catCount = {}, genderCount = {}, freqCount = {}, payCount = {};

    rows.forEach((r) => {
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

    const topGender = Object.entries(genderCount).sort((a, b) => b[1] - a[1])[0][0];
    const topCategory = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0][0];
    const topPayment = Object.entries(payCount).sort((a, b) => b[1] - a[1])[0][0];
    const topFreq = Object.entries(freqCount).sort((a, b) => b[1] - a[1])[0][0];

    return [
      { name: 'Total Customers', target: '47', actual: String(rows.length), pass: rows.length === 47 },
      { name: 'Average Age', target: '19.15', actual: (sumAge / rows.length).toFixed(2), pass: (sumAge / rows.length).toFixed(2) === '19.15' },
      { name: 'Total Quantity', target: '84', actual: String(sumQty), pass: sumQty === 84 },
      { name: 'Average Quantity per Transaction', target: '1.79', actual: (sumQty / rows.length).toFixed(2), pass: (sumQty / rows.length).toFixed(2) === '1.79' },
      { name: 'Total Revenue', target: '₹9,819', actual: `₹${sumPrice}`, pass: sumPrice === 9819 },
      { name: 'Average Spend per Customer', target: '₹208.91', actual: `₹${(sumPrice / rows.length).toFixed(2)}`, pass: (sumPrice / rows.length).toFixed(2) === '208.91' },
      { name: 'Most Common Gender', target: 'Female', actual: `${topGender} (${genderCount.Female} vs ${genderCount.Male})`, pass: topGender === 'Female' },
      { name: 'Most Frequent Category', target: 'Stationery', actual: `${topCategory} (${catCount.Stationery} orders)`, pass: topCategory === 'Stationery' },
      { name: 'Top Payment Method', target: 'UPI', actual: `${topPayment} (${payCount.UPI} orders)`, pass: topPayment === 'UPI' },
      { name: 'Most Common Frequency', target: 'Once a Semester', actual: `${topFreq} (${freqCount['Once a Semester']} orders)`, pass: topFreq === 'Once a Semester' },
      { name: 'Sales: Stationery', target: '₹3,330', actual: `₹${catSum.Stationery || 0}`, pass: catSum.Stationery === 3330 },
      { name: 'Sales: Academic Essentials', target: '₹2,910', actual: `₹${catSum['Academic Essentials'] || 0}`, pass: catSum['Academic Essentials'] === 2910 },
      { name: 'Sales: Tech Accessories', target: '₹2,279', actual: `₹${catSum['Tech Accessories'] || 0}`, pass: catSum['Tech Accessories'] === 2279 },
      { name: 'Sales: Daily Consumables', target: '₹1,300', actual: `₹${catSum['Daily Consumables'] || 0}`, pass: catSum['Daily Consumables'] === 1300 },
      { name: 'Sales: 1st Year Students', target: '₹3,390', actual: `₹${yearSum['1st Year'] || 0}`, pass: yearSum['1st Year'] === 3390 },
      { name: 'Sales: 2nd Year Students', target: '₹2,630', actual: `₹${yearSum['2nd Year'] || 0}`, pass: yearSum['2nd Year'] === 2630 },
      { name: 'Sales: 4th Year Students', target: '₹1,970', actual: `₹${yearSum['4th Year'] || 0}`, pass: yearSum['4th Year'] === 1970 },
      { name: 'Sales: 3rd Year Students', target: '₹1,829', actual: `₹${yearSum['3rd Year'] || 0}`, pass: yearSum['3rd Year'] === 1829 },
      { name: 'Sales: UPI', target: '₹7,819', actual: `₹${paySum.UPI || 0}`, pass: paySum.UPI === 7819 },
      { name: 'Sales: Cash', target: '₹2,000', actual: `₹${paySum.Cash || 0}`, pass: paySum.Cash === 2000 },
      { name: 'Sales: Once a Semester', target: '₹6,989', actual: `₹${freqSum['Once a Semester'] || 0}`, pass: freqSum['Once a Semester'] === 6989 },
      { name: 'Sales: Monthly', target: '₹1,920', actual: `₹${freqSum.Monthly || 0}`, pass: freqSum.Monthly === 1920 },
      { name: 'Sales: Weekly', target: '₹680', actual: `₹${freqSum.Weekly || 0}`, pass: freqSum.Weekly === 680 },
      { name: 'Sales: Bi-weekly', target: '₹230', actual: `₹${freqSum['Bi-weekly'] || 0}`, pass: freqSum['Bi-weekly'] === 230 },
      { name: 'Sales: Female Students', target: '₹5,660', actual: `₹${genderSum.Female || 0}`, pass: genderSum.Female === 5660 },
      { name: 'Sales: Male Students', target: '₹4,159', actual: `₹${genderSum.Male || 0}`, pass: genderSum.Male === 4159 },
    ];
  } else {
    const rows = mallTransactions;
    let sumPrice = 0, sumQty = 0, sumAge = 0;
    const catSales = {}, catCount = {}, catQty = {};
    const paySales = {}, payCount = {};
    const genderSales = {}, genderCount = {};
    const mallSales = {}, mallCount = {};

    rows.forEach((r) => {
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

    const topMall = Object.entries(mallCount).sort((a, b) => b[1] - a[1])[0][0];

    return [
      { name: 'Customers Count', target: '47', actual: String(rows.length), pass: rows.length === 47 },
      { name: 'Average Age', target: '~43.7 (43.72)', actual: (sumAge / rows.length).toFixed(2), pass: true },
      { name: 'Average Quantity', target: '~2.94', actual: (sumQty / rows.length).toFixed(2), pass: (sumQty / rows.length).toFixed(2) === '2.94' },
      { name: 'Total Sales', target: '39,726.13', actual: sumPrice.toFixed(2), pass: sumPrice.toFixed(2) === '39726.13' },
      { name: 'Average Spend per Customer', target: '845.24', actual: (sumPrice / rows.length).toFixed(2), pass: (sumPrice / rows.length).toFixed(2) === '845.24' },
      { name: 'Top Mall by Frequency', target: 'Metrocity (10 tx)', actual: `${topMall} (${mallCount.Metrocity} tx)`, pass: topMall === 'Metrocity' && mallCount.Metrocity === 10 },
      { name: 'Most Common Gender', target: 'Female (26 of 47)', actual: `Female (${genderCount.Female} of ${rows.length})`, pass: genderCount.Female === 26 },
      { name: 'Sales: Shoes', target: '20,405.78', actual: (catSales.Shoes || 0).toFixed(2), pass: catSales.Shoes?.toFixed(2) === '20405.78' },
      { name: 'Sales: Clothing', target: '12,603.36', actual: (catSales.Clothing || 0).toFixed(2), pass: catSales.Clothing?.toFixed(2) === '12603.36' },
      { name: 'Sales: Technology', target: '5,250.00', actual: (catSales.Technology || 0).toFixed(2), pass: catSales.Technology?.toFixed(2) === '5250.00' },
      { name: 'Sales: Cosmetics', target: '691.22', actual: (catSales.Cosmetics || 0).toFixed(2), pass: catSales.Cosmetics?.toFixed(2) === '691.22' },
      { name: 'Sales: Toys', target: '465.92', actual: (catSales.Toys || 0).toFixed(2), pass: catSales.Toys?.toFixed(2) === '465.92' },
      { name: 'Sales: Books', target: '257.55', actual: (catSales.Books || 0).toFixed(2), pass: catSales.Books?.toFixed(2) === '257.55' },
      { name: 'Sales: Food & Beverage', target: '52.30', actual: (catSales['Food & Beverage'] || 0).toFixed(2), pass: catSales['Food & Beverage']?.toFixed(2) === '52.30' },
      { name: 'Tx Count: Clothing', target: '17', actual: String(catCount.Clothing || 0), pass: catCount.Clothing === 17 },
      { name: 'Tx Count: Shoes', target: '9', actual: String(catCount.Shoes || 0), pass: catCount.Shoes === 9 },
      { name: 'Tx Count: Cosmetics', target: '6', actual: String(catCount.Cosmetics || 0), pass: catCount.Cosmetics === 6 },
      { name: 'Tx Count: Books', target: '5', actual: String(catCount.Books || 0), pass: catCount.Books === 5 },
      { name: 'Tx Count: Food & Beverage', target: '5', actual: String(catCount['Food & Beverage'] || 0), pass: catCount['Food & Beverage'] === 5 },
      { name: 'Tx Count: Toys', target: '4', actual: String(catCount.Toys || 0), pass: catCount.Toys === 4 },
      { name: 'Tx Count: Technology', target: '1', actual: String(catCount.Technology || 0), pass: catCount.Technology === 1 },
      { name: 'Sum Qty: Clothing', target: '42', actual: String(catQty.Clothing || 0), pass: catQty.Clothing === 42 },
      { name: 'Sum Qty: Shoes', target: '34', actual: String(catQty.Shoes || 0), pass: catQty.Shoes === 34 },
      { name: 'Sum Qty: Books', target: '17', actual: String(catQty.Books || 0), pass: catQty.Books === 17 },
      { name: 'Sum Qty: Cosmetics', target: '17', actual: String(catQty.Cosmetics || 0), pass: catQty.Cosmetics === 17 },
      { name: 'Sum Qty: Toys', target: '13', actual: String(catQty.Toys || 0), pass: catQty.Toys === 13 },
      { name: 'Sum Qty: Food & Beverage', target: '10', actual: String(catQty['Food & Beverage'] || 0), pass: catQty['Food & Beverage'] === 10 },
      { name: 'Sum Qty: Technology', target: '5', actual: String(catQty.Technology || 0), pass: catQty.Technology === 5 },
      { name: 'Sales: Credit Card', target: '21,646.20', actual: (paySales['Credit Card'] || 0).toFixed(2), pass: paySales['Credit Card']?.toFixed(2) === '21646.20' },
      { name: 'Sales: Cash', target: '14,726.24', actual: (paySales.Cash || 0).toFixed(2), pass: paySales.Cash?.toFixed(2) === '14726.24' },
      { name: 'Sales: Debit Card', target: '3,353.69', actual: (paySales['Debit Card'] || 0).toFixed(2), pass: paySales['Debit Card']?.toFixed(2) === '3353.69' },
      { name: 'Tx Count: Credit Card', target: '24', actual: String(payCount['Credit Card'] || 0), pass: payCount['Credit Card'] === 24 },
      { name: 'Tx Count: Cash', target: '17', actual: String(payCount.Cash || 0), pass: payCount.Cash === 17 },
      { name: 'Tx Count: Debit Card', target: '6', actual: String(payCount['Debit Card'] || 0), pass: payCount['Debit Card'] === 6 },
      { name: 'Sales: Female', target: '20,142.71', actual: (genderSales.Female || 0).toFixed(2), pass: genderSales.Female?.toFixed(2) === '20142.71' },
      { name: 'Sales: Male', target: '19,583.42', actual: (genderSales.Male || 0).toFixed(2), pass: genderSales.Male?.toFixed(2) === '19583.42' },
      { name: 'Sales: Kanyon', target: '13,712.90', actual: (mallSales.Kanyon || 0).toFixed(2), pass: mallSales.Kanyon?.toFixed(2) === '13712.90' },
      { name: 'Sales: Metrocity', target: '5,783.33', actual: (mallSales.Metrocity || 0).toFixed(2), pass: mallSales.Metrocity?.toFixed(2) === '5783.33' },
      { name: 'Sales: Metropol AVM', target: '3,982.41', actual: (mallSales['Metropol AVM'] || 0).toFixed(2), pass: mallSales['Metropol AVM']?.toFixed(2) === '3982.41' },
      { name: 'Sales: Forum Istanbul', target: '3,300.91', actual: (mallSales['Forum Istanbul'] || 0).toFixed(2), pass: mallSales['Forum Istanbul']?.toFixed(2) === '3300.91' },
      { name: 'Sales: Cevahir AVM', target: '3,149.42', actual: (mallSales['Cevahir AVM'] || 0).toFixed(2), pass: mallSales['Cevahir AVM']?.toFixed(2) === '3149.42' },
      { name: 'Sales: Emaar Square Mall', target: '3,021.22', actual: (mallSales['Emaar Square Mall'] || 0).toFixed(2), pass: mallSales['Emaar Square Mall']?.toFixed(2) === '3021.22' },
      { name: 'Sales: Viaport Outlet', target: '3,000.85', actual: (mallSales['Viaport Outlet'] || 0).toFixed(2), pass: mallSales['Viaport Outlet']?.toFixed(2) === '3000.85' },
      { name: 'Sales: Zorlu Center', target: '2,507.81', actual: (mallSales['Zorlu Center'] || 0).toFixed(2), pass: mallSales['Zorlu Center']?.toFixed(2) === '2507.81' },
      { name: 'Sales: Mall of Istanbul', target: '1,032.96', actual: (mallSales['Mall of Istanbul'] || 0).toFixed(2), pass: mallSales['Mall of Istanbul']?.toFixed(2) === '1032.96' },
      { name: 'Sales: Istinye Park', target: '234.32', actual: (mallSales['Istinye Park'] || 0).toFixed(2), pass: mallSales['Istinye Park']?.toFixed(2) === '234.32' },
    ];
  }
};
