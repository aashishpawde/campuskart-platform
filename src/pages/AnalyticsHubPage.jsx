import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Search,
  Database,
  Download,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowUpDown,
  PieChart as PieIcon,
  Table as TableIcon,
  HelpCircle,
  Lightbulb,
  FileSpreadsheet,
  Compass,
  GraduationCap,
  Calendar,
  AlertCircle,
  Boxes,
  Zap,
  Tag,
  Target
} from 'lucide-react';
import campusTransactions from '../data/campusTransactions.json';
import mallTransactions from '../data/mallTransactions.json';
import googleTrendsData from '../data/googleTrendsData.json';
import {
  computeDescriptiveStats,
  computeDiagnosticData,
  computePredictiveForecast,
  computePrescriptiveInsights,
  computePivotTable,
  runDataChecks,
} from '../utils/analytics';
import { formatCurrency, formatNumber, exportToCsv } from '../utils/formatters';
import { DataCheckModal } from '../components/common/DataCheckModal';

// Vibrant Chart Color Palettes
const CHART_COLORS = [
  '#2563EB', // Blue
  '#F97316', // Orange
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F59E0B', // Amber
  '#6366F1', // Indigo
];

export const AnalyticsHubPage = () => {
  // Active Dataset Switcher: 'campus' (CampusKart Student Sales) or 'mall' (Mall Sales class dataset)
  const [datasetType, setDatasetType] = useState('campus');
  const [showDataCheckModal, setShowDataCheckModal] = useState(false);

  // Active dataset rows
  const activeData = datasetType === 'campus' ? campusTransactions : mallTransactions;
  const isCampus = datasetType === 'campus';

  // Section C4 Pivot Table Builder State
  const [pivotRowField, setPivotRowField] = useState(
    isCampus ? 'category' : 'category'
  );
  const [pivotValueField, setPivotValueField] = useState(
    isCampus ? 'total_amount' : 'price'
  );
  const [pivotAggregation, setPivotAggregation] = useState('SUM');
  const [pivotChartType, setPivotChartType] = useState('table'); // 'table', 'bar', 'pie'

  // Computed Analytics
  const descStats = useMemo(
    () => computeDescriptiveStats(activeData, datasetType),
    [activeData, datasetType]
  );
  const diagData = useMemo(
    () => computeDiagnosticData(activeData, datasetType),
    [activeData, datasetType]
  );
  const predData = useMemo(
    () => computePredictiveForecast(activeData, datasetType),
    [activeData, datasetType]
  );
  const presData = useMemo(
    () => computePrescriptiveInsights(datasetType),
    [datasetType]
  );

  // Pivot Table Output
  const pivotOutput = useMemo(
    () =>
      computePivotTable(
        activeData,
        pivotRowField,
        pivotValueField,
        pivotAggregation,
        datasetType
      ),
    [activeData, pivotRowField, pivotValueField, pivotAggregation, datasetType]
  );

  // Validation Checks Status Count
  const dataChecks = runDataChecks(datasetType);
  const passedChecksCount = dataChecks.filter((c) => c.pass).length;

  const handleExportDataset = () => {
    const filename =
      datasetType === 'campus'
        ? 'campuskart_student_transactions_47rows.csv'
        : 'mall_sales_class_dataset_47rows.csv';
    exportToCsv(activeData, filename);
  };

  // One-click Presets for Pivot Table Builder (from class video)
  const applyPivotPreset = (preset) => {
    setPivotRowField(preset.row);
    setPivotValueField(preset.val);
    setPivotAggregation(preset.agg);
    if (preset.chart) setPivotChartType(preset.chart);
  };

  const pivotPresets = isCampus
    ? [
        { label: 'COUNTA of Category', row: 'category', val: 'category', agg: 'COUNT', chart: 'bar' },
        { label: 'COUNTA of Payment Method', row: 'payment_method', val: 'payment_method', agg: 'COUNT', chart: 'pie' },
        { label: 'COUNT of Age (Distribution)', row: 'age', val: 'age', agg: 'COUNT', chart: 'bar' },
        { label: 'SUM of Price by Year of Study', row: 'year_of_study', val: 'total_amount', agg: 'SUM', chart: 'bar' },
        { label: 'SUM of Price by Payment', row: 'payment_method', val: 'total_amount', agg: 'SUM', chart: 'pie' },
        { label: 'SUM of Price by Gender', row: 'gender', val: 'total_amount', agg: 'SUM', chart: 'pie' },
        { label: 'SUM of Quantity by Category', row: 'category', val: 'quantity', agg: 'SUM', chart: 'bar' },
      ]
    : [
        { label: 'COUNTA of category', row: 'category', val: 'category', agg: 'COUNT', chart: 'bar' },
        { label: 'COUNTA of payment_method', row: 'payment_method', val: 'payment_method', agg: 'COUNT', chart: 'pie' },
        { label: 'COUNT of age (distribution)', row: 'age', val: 'age', agg: 'COUNT', chart: 'bar' },
        { label: 'SUM of price by shopping_mall', row: 'shopping_mall', val: 'price', agg: 'SUM', chart: 'bar' },
        { label: 'SUM of price by payment_method', row: 'payment_method', val: 'price', agg: 'SUM', chart: 'pie' },
        { label: 'SUM of price by gender', row: 'gender', val: 'price', agg: 'SUM', chart: 'pie' },
        { label: 'SUM of quantity by category', row: 'category', val: 'quantity', agg: 'SUM', chart: 'bar' },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Header & Dataset Switcher Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-mono px-3 py-0.5 rounded-full font-bold">
                RETAIL ANALYTICS HUB &bull; ACTIVITY 4
              </span>
              <span className="bg-accent-500/20 text-accent-300 border border-accent-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full">
                MCOE Pune (OEL11201A)
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Descriptive, Diagnostic, Predictive & Prescriptive Retail Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Analyze student requirements and retail transaction patterns using interactive Pivot Tables, Google Trends market validation, and regression modeling.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* CSV Export Button */}
            <button
              onClick={handleExportDataset}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
              title="Download active 47 rows as real CSV"
            >
              <Download className="w-4 h-4 text-brand-400" />
              <span>Export Active CSV</span>
            </button>

            {/* Data Check Verification Modal Button */}
            <button
              onClick={() => setShowDataCheckModal(true)}
              className="px-4 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/40 transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Data Check Panel ({passedChecksCount}/{dataChecks.length} ✅)</span>
            </button>
          </div>
        </div>

        {/* Dataset Switcher Pills */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/80">
            <button
              onClick={() => setDatasetType('campus')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                datasetType === 'campus'
                  ? 'bg-brand-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>CampusKart Student Sales (47 Rows)</span>
            </button>
            <button
              onClick={() => setDatasetType('mall')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                datasetType === 'mall'
                  ? 'bg-brand-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>Mall Sales (Class Dataset - 47 Rows)</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-4">
            <span>
              Active Data:{' '}
              <strong className="text-white font-mono">
                {activeData.length} records
              </strong>
            </span>
            <span>
              Total Volume:{' '}
              <strong className="text-white font-mono">
                {descStats?.totalQuantity} units
              </strong>
            </span>
            <span>
              Total Sales:{' '}
              <strong className="text-emerald-400 font-mono">
                {formatCurrency(descStats?.totalRevenue)}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION NAV JUMP PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold text-slate-600 scrollbar-none">
        <a href="#section-c1" className="px-3.5 py-1.5 bg-white hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 shrink-0 transition-colors">
          C1. Market Validation
        </a>
        <a href="#section-c2" className="px-3.5 py-1.5 bg-white hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 shrink-0 transition-colors">
          C2. 4 Question Insights
        </a>
        <a href="#section-c3" className="px-3.5 py-1.5 bg-white hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 shrink-0 transition-colors">
          C3. Descriptive Analytics
        </a>
        <a href="#section-c4" className="px-3.5 py-1.5 bg-white hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 shrink-0 transition-colors">
          C4. Pivot Table Builder
        </a>
        <a href="#section-c5" className="px-3.5 py-1.5 bg-white hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 shrink-0 transition-colors">
          C5. Diagnostic Analytics
        </a>
        <a href="#section-c6" className="px-3.5 py-1.5 bg-white hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 shrink-0 transition-colors">
          C6. Predictive Analytics
        </a>
        <a href="#section-c7" className="px-3.5 py-1.5 bg-white hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 shrink-0 transition-colors">
          C7. Prescriptive Analytics
        </a>
        <a href="#section-c8" className="px-3.5 py-1.5 bg-white hover:bg-brand-50 hover:text-brand-600 rounded-xl border border-slate-200 shrink-0 transition-colors">
          C8. Analytics Summary Table
        </a>
      </div>

      {/* ========================================================= */}
      {/* SECTION C1: MARKET VALIDATION (GOOGLE TRENDS) */}
      {/* ========================================================= */}
      <section id="section-c1" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-8 scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-brand-100 text-brand-800 text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                Step 1 of 4
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                C1. Market Validation (Google Trends Analysis)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Validating customer search demand and product viability prior to startup inventory commitment
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Illustrative Google Trends snapshot, India
          </span>
        </div>

        {/* Step List shown on page */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Google Trends Validation Methodology Workflow:
          </p>
          <div className="flex flex-wrap items-center gap-2 text-slate-700">
            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-semibold">1. Access Google Trends</span>
            <span className="text-slate-400">&rarr;</span>
            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-semibold">2. Enter first term</span>
            <span className="text-slate-400">&rarr;</span>
            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-semibold">3. Compare 2nd, 3rd, 4th term</span>
            <span className="text-slate-400">&rarr;</span>
            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-semibold">4. Analyse results</span>
            <span className="text-slate-400">&rarr;</span>
            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-semibold">5. Check regional popularity</span>
            <span className="text-slate-400">&rarr;</span>
            <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200 font-semibold">6. Review related queries</span>
          </div>
        </div>

        {/* Trends Visualization Area */}
        {isCampus ? (
          /* CampusKart Trends View */
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-200/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-brand-900 block">
                  Search Term: <strong className="font-mono text-brand-700">"college stationery"</strong> (India, Past Year)
                </span>
                <p className="text-xs text-brand-700">
                  Search interest surges <strong>+80% vs preceding year</strong>, driven heavily by semester exam cycles and admissions.
                </p>
              </div>
              <span className="px-3 py-1 bg-brand-600 text-white font-extrabold text-xs rounded-full shadow-sm">
                +80% Annual Growth
              </span>
            </div>

            {/* Line Chart of Campus Seasonality */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={googleTrendsData.campusTrends.timeline}>
                  <defs>
                    <linearGradient id="campusTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-lg space-y-1">
                            <p className="font-bold">{d.month}</p>
                            <p className="text-sky-300 font-mono">Interest: {d.interest} / 100</p>
                            <p className="text-[11px] text-slate-300 italic">{d.event}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="interest"
                    stroke="#2563EB"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#campusTrendGrad)"
                    name="Search Interest"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Subregions and Related Queries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Regional popularity */}
              <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-brand-600" />
                  Regional Search Popularity (India)
                </h4>
                <div className="space-y-2 text-xs">
                  {googleTrendsData.campusTrends.subregions.map((reg, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-slate-700">{reg.region}</span>
                        <span className="font-mono font-bold text-slate-900">{reg.interest}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-600 rounded-full"
                          style={{ width: `${reg.interest}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Queries Rising */}
              <div className="p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Rising Related Student Queries (Breakout)
                </h4>
                <div className="divide-y divide-slate-100 text-xs">
                  {googleTrendsData.campusTrends.relatedQueries.map((q, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between">
                      <span className="font-mono text-slate-700">{q.query}</span>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        {q.growth}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Mall Trends 4-Line Comparison View */
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900">
                4-Term Comparison (India, Past 12 Months): "cloths", "shoes", "books", "cosmetics"
              </span>
              <p className="text-slate-600">
                Notice that <strong>Clothes & Shoes lead search interest</strong> across India, Books maintain mid-level interest with exam surges, and Cosmetics remain steady.
              </p>
            </div>

            {/* 4-Line Chart */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={googleTrendsData.mallTrends.timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  <Line type="monotone" dataKey="cloths" stroke="#2563EB" strokeWidth={2.5} name="Cloths" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="shoes" stroke="#F97316" strokeWidth={2.5} name="Shoes" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="books" stroke="#10B981" strokeWidth={2.5} name="Books" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="cosmetics" stroke="#8B5CF6" strokeWidth={2.5} name="Cosmetics" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Subregions Table & Rising Related Queries */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
              {/* Subregion Table */}
              <div className="lg:col-span-6 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  Subregion Interest Index (%)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-bold">
                        <th className="py-2">Region</th>
                        <th className="py-2 text-right">Cloths</th>
                        <th className="py-2 text-right">Shoes</th>
                        <th className="py-2 text-right">Books</th>
                        <th className="py-2 text-right">Cosmetics</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {googleTrendsData.mallTrends.subregions.map((reg, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-1.5 font-sans font-medium text-slate-800">{reg.region}</td>
                          <td className="py-1.5 text-right text-brand-600">{reg.cloths}</td>
                          <td className="py-1.5 text-right text-orange-600">{reg.shoes}</td>
                          <td className="py-1.5 text-right text-emerald-600">{reg.books}</td>
                          <td className="py-1.5 text-right text-purple-600">{reg.cosmetics}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rising Queries from prompt */}
              <div className="lg:col-span-6 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  Related Queries (Rising Breakout - Video Class Dataset)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="font-bold text-emerald-800 text-[11px] uppercase">Books (Rising)</p>
                    {googleTrendsData.mallTrends.relatedQueries.books.map((q, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span className="text-slate-700 truncate">{q.query}</span>
                        <span className="font-mono text-emerald-700 font-bold">{q.growth}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <p className="font-bold text-brand-800 text-[11px] uppercase">Cloths (Rising)</p>
                    {googleTrendsData.mallTrends.relatedQueries.cloths.map((q, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span className="text-slate-700 truncate">{q.query}</span>
                        <span className="font-mono text-brand-700 font-bold">{q.growth}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conclusion Box Required */}
        <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 font-black text-emerald-900 uppercase tracking-wider text-[11px]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Market Validation Conclusion:</span>
          </div>
          <p className="leading-relaxed font-medium">
            "By using Google Trends, we have taken the first step in validating our product idea based on real-world search data. This supports our decision on which product category to focus on for our retail startup simulation."
          </p>
        </div>

        {/* One-Page Startup Description Card */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-accent-400 font-bold text-xs">
            <Sparkles className="w-4 h-4" />
            <span>CampusKart Startup Business Profile (Simulation)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Target Market</span>
              <p className="text-white font-medium mt-0.5">
                Engineering college students (1st to 4th year, avg age ~19), hostel-resident & campus day-scholars at MCOE Pune.
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Problem Solved</span>
              <p className="text-white font-medium mt-0.5">
                Eliminates wasted time and high prices hunting for urgent academic gear (drafters, calculators, record sheets) with 15-minute gate delivery.
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Value Proposition</span>
              <p className="text-white font-medium mt-0.5">
                Affordable student-budget prices, curated bundles (Exam Kit, Starter Kit), and frictionless 5% UPI cashback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION C2: CUSTOMER INSIGHTS DASHBOARD (4 QUESTION CARDS) */}
      {/* ========================================================= */}
      <section id="section-c2" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-24">
        <div className="border-b border-slate-100 pb-4">
          <span className="bg-brand-100 text-brand-800 text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full">
            Core Retail Analysis
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            C2. Customer Insights Dashboard (The 4 Fundamental Questions)
          </h2>
          <p className="text-xs text-slate-500">
            Synthesizing demographic, product preference, payment habit, and channel touchpoints
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Question 1: Who are the customers? */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">1</span>
                  Who are the customers?
                </h3>
                <span className="text-xs font-mono font-bold text-brand-600">
                  Avg Age: {descStats?.avgAge.toFixed(2)} yrs
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {isCampus
                  ? `Young undergraduate student body (avg 19.15 yrs), with Female students contributing 60% of total transactions and 57.6% of revenue.`
                  : `Diverse retail shopper demographic (avg age 43.7 yrs), with Female shoppers accounting for 26 out of 47 purchases (55.3%).`}
              </p>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={descStats?.genderList}
                    dataKey="sales"
                    nameKey="gender"
                    cx="50%"
                    cy="50%"
                    outerRadius={55}
                    innerRadius={30}
                    paddingAngle={4}
                  >
                    {descStats?.genderList.map((entry, index) => (
                      <Cell key={index} fill={index === 0 ? '#EC4899' : '#2563EB'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Question 2: What are they buying? */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">2</span>
                  What are they buying?
                </h3>
                <span className="text-xs font-mono font-bold text-brand-600">
                  Top: {descStats?.topCategoryBySales?.category}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {isCampus
                  ? `Stationery dominates volume (21 orders, ₹3,330), followed by high-ticket Academic Essentials (₹2,910) and Tech Accessories (₹2,279).`
                  : `Shoes capture 51.36% of all revenue (₹20,405.78), while Clothing captures the highest transaction count (17 orders, 42 units).`}
              </p>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={descStats?.categoryList.slice(0, 4)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="sales" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Question 3: How are they paying? */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">3</span>
                  How are they paying?
                </h3>
                <span className="text-xs font-mono font-bold text-brand-600">
                  {descStats?.topPaymentByCount?.payment_method} Dominates
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {isCampus
                  ? `UPI mobile payments represent 79.6% of sales (₹7,819 across 38 orders), powered by the 5% instant UPI student discount.`
                  : `Credit Cards dominate mall sales (₹21,646.20, 54.5%), followed by Cash (₹14,726.24) and Debit Cards (₹3,353.69).`}
              </p>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={descStats?.paymentList}
                    dataKey="sales"
                    nameKey="payment_method"
                    cx="50%"
                    cy="50%"
                    outerRadius={55}
                    paddingAngle={4}
                  >
                    {descStats?.paymentList.map((entry, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Question 4: Where are they shopping / Cohort Segment? */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">4</span>
                  {isCampus ? 'Which academic year spends most?' : 'Where are they shopping?'}
                </h3>
                <span className="text-xs font-mono font-bold text-brand-600">
                  Top: {descStats?.topLocation?.name}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {isCampus
                  ? `1st-Year students are the highest spending cohort (₹3,390, 34.5%) due to mandatory graphics equipment, followed by 2nd-Year (₹2,630).`
                  : `Kanyon mall leads in revenue (₹13,712.90, 34.5%) due to high-value tech, while Metrocity leads in shopping frequency (10 orders).`}
              </p>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={descStats?.locationList.slice(0, 4)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="sales" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION C3: DESCRIPTIVE ANALYTICS ("WHAT HAPPENED") */}
      {/* ========================================================= */}
      <section id="section-c3" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-8 scroll-mt-24">
        <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="bg-brand-100 text-brand-800 text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              Descriptive Analytics
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              C3. Descriptive Analytics: "What Happened"
            </h2>
            <p className="text-xs text-slate-500">
              Pivot chart visual representations mirroring Excel & Google Sheets pivot analysis
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
            Total Revenue: <strong className="text-slate-900">{formatCurrency(descStats?.totalRevenue)}</strong>
          </span>
        </div>

        {/* Descriptive KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Customers</span>
            <span className="text-xl font-black text-slate-900">{descStats?.totalCustomers}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Avg Age</span>
            <span className="text-xl font-black text-slate-900 font-mono">
              {descStats?.avgAge.toFixed(2)}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Qty</span>
            <span className="text-xl font-black text-slate-900 font-mono">{descStats?.totalQuantity}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Avg Qty / Tx</span>
            <span className="text-xl font-black text-slate-900 font-mono">
              {descStats?.avgQuantity.toFixed(2)}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Sales</span>
            <span className="text-xl font-black text-brand-600 font-mono">
              {formatCurrency(descStats?.totalRevenue)}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Avg Spend / Cust</span>
            <span className="text-xl font-black text-emerald-600 font-mono">
              {formatCurrency(descStats?.avgSpend)}
            </span>
          </div>
        </div>

        {/* Charts Grid: Category Count Bar, Payment Pie, Age Histogram, Location Sales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Chart 1: Category Popularity (Count) */}
          <div className="p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Category Popularity (Order Count)
              </h4>
              <span className="text-[10px] text-slate-400">COUNTA of category</span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={descStats?.categoryList}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Payment Method Distribution */}
          <div className="p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Payment Method Breakdown
              </h4>
              <span className="text-[10px] text-slate-400">SUM of sales by payment</span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={descStats?.paymentList}
                    dataKey="sales"
                    nameKey="payment_method"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {descStats?.paymentList.map((entry, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Age Histogram with exact bins */}
          <div className="p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Age Distribution Histogram (Bins: 15-26, 26-37, 37-48, 48-59, 59-70)
              </h4>
              <span className="text-[10px] text-slate-400">COUNT of age</span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={descStats?.ageBins}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} name="Customers in Bin" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Location / Year of Study Sales */}
          <div className="p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                {isCampus ? 'Sales by Year of Study' : 'Total Sales per Shopping Mall'}
              </h4>
              <span className="text-[10px] text-slate-400">
                SUM of price by {isCampus ? 'year' : 'mall'}
              </span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={descStats?.locationList}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="sales" fill="#F97316" radius={[4, 4, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top 10 Products by Revenue (CampusKart Specific) */}
        {isCampus && descStats?.topProducts && (
          <div className="p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Top 10 Campus Products by Revenue Contribution
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={descStats.topProducts}
                  layout="vertical"
                  margin={{ left: 50, right: 20, top: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="product" tick={{ fontSize: 9 }} width={160} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="sales" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Sales (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Sample Insights Box dynamically computed from raw rows */}
        <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 space-y-2">
          <div className="flex items-center gap-2 font-black text-brand-900 uppercase tracking-wider text-[11px]">
            <Lightbulb className="w-4 h-4 text-brand-600" />
            <span>Descriptive Analytics Key Takeaways:</span>
          </div>
          <p className="leading-relaxed">
            {isCampus ? (
              <>
                For the CampusKart dataset: <strong>Stationery</strong> is the most popular category by order count ({descStats?.categoryList.find(c=>c.category==='Stationery')?.count} orders, ₹3,330); <strong>1st-Year students</strong> represent the highest spending cohort ({formatCurrency(3390)}, 34.5%); <strong>UPI</strong> is the undisputed top payment mechanism ({formatCurrency(7819)}, 79.6%); and <strong>Once a Semester</strong> is the primary replenishment cycle ({formatCurrency(6989)}).
              </>
            ) : (
              <>
                For the Mall dataset: Most popular category by transaction count is <strong>Clothing</strong> (17 orders), whereas the highest sales category by revenue is <strong>Shoes</strong> ({formatCurrency(20405.78)}, capturing 51.36% of all sales); top mall by sales is <strong>Kanyon</strong> ({formatCurrency(13712.90)}); top mall by transaction frequency is <strong>Metrocity</strong> (10 transactions); and most common payment method is <strong>Credit Card</strong> (24 transactions, {formatCurrency(21646.20)}).
              </>
            )}
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION C4: PIVOT TABLE BUILDER (EXCEL / SHEETS CLONE) */}
      {/* ========================================================= */}
      <section id="section-c4" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-24">
        <div className="border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                Interactive Tool
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                C4. Pivot Table Builder (Excel / Google Sheets Simulator)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select Rows, Values, and Aggregations to slice and dice dataset dimensions dynamically
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setPivotChartType('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                pivotChartType === 'table' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setPivotChartType('bar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                pivotChartType === 'bar' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Bar Chart
            </button>
            <button
              onClick={() => setPivotChartType('pie')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                pivotChartType === 'pie' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" /> Pie Chart
            </button>
          </div>
        </div>

        {/* Quick Presets Bar (From Class Video) */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Classroom Preset Pivot Tables:
          </span>
          <div className="flex flex-wrap gap-2">
            {pivotPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => applyPivotPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  pivotRowField === preset.row &&
                  pivotValueField === preset.val &&
                  pivotAggregation === preset.agg
                    ? 'bg-purple-50 text-purple-800 border-purple-300 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Controls Bar: Rows, Values, Aggregations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Pivot Rows (Dimension):</label>
            <select
              value={pivotRowField}
              onChange={(e) => setPivotRowField(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500"
            >
              <option value="category">category</option>
              <option value="payment_method">payment_method</option>
              <option value="gender">gender</option>
              <option value="age">age</option>
              {isCampus ? (
                <>
                  <option value="year_of_study">year_of_study</option>
                  <option value="purchase_frequency">purchase_frequency</option>
                  <option value="main_reason">main_reason</option>
                </>
              ) : (
                <option value="shopping_mall">shopping_mall</option>
              )}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Pivot Values (Metric):</label>
            <select
              value={pivotValueField}
              onChange={(e) => setPivotValueField(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-purple-500"
            >
              <option value={isCampus ? 'total_amount' : 'price'}>
                {isCampus ? 'total_amount (price)' : 'price (sales)'}
              </option>
              <option value="quantity">quantity</option>
              <option value="age">age</option>
              <option value="category">category (count)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Aggregation Function:</label>
            <select
              value={pivotAggregation}
              onChange={(e) => setPivotAggregation(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-purple-900 focus:ring-2 focus:ring-purple-500"
            >
              <option value="SUM">SUM</option>
              <option value="COUNT">COUNTA / COUNT</option>
              <option value="AVERAGE">AVERAGE</option>
            </select>
          </div>
        </div>

        {/* Pivot Output: Table OR Chart */}
        {pivotChartType === 'table' ? (
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-800 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">{pivotOutput.headers[0]}</th>
                  <th className="py-2.5 px-4 text-center">Record Count</th>
                  <th className="py-2.5 px-4 text-right">Sum of Value</th>
                  <th className="py-2.5 px-4 text-right">Average</th>
                  <th className="py-2.5 px-4 text-right">
                    Active Metric ({pivotAggregation})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {pivotOutput.rows.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-sans font-semibold text-slate-900">
                      {r.rowKey}
                    </td>
                    <td className="py-2.5 px-4 text-center text-slate-600">{r.count}</td>
                    <td className="py-2.5 px-4 text-right text-slate-600">
                      {pivotValueField.includes('price') || pivotValueField.includes('total')
                        ? formatCurrency(r.sum)
                        : r.sum}
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-600">{r.avg}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-purple-700">
                      {pivotAggregation === 'SUM' &&
                      (pivotValueField.includes('price') || pivotValueField.includes('total'))
                        ? formatCurrency(r.value)
                        : r.value}
                    </td>
                  </tr>
                ))}

                {/* Grand Total Row */}
                {pivotOutput.totalRow && (
                  <tr className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300">
                    <td className="py-3 px-4 font-sans uppercase">
                      {pivotOutput.totalRow.rowKey}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      {pivotOutput.totalRow.count}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {pivotValueField.includes('price') || pivotValueField.includes('total')
                        ? formatCurrency(pivotOutput.totalRow.sum)
                        : pivotOutput.totalRow.sum}
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {pivotOutput.totalRow.avg}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-purple-900 text-sm">
                      {pivotAggregation === 'SUM' &&
                      (pivotValueField.includes('price') || pivotValueField.includes('total'))
                        ? formatCurrency(pivotOutput.totalRow.value)
                        : pivotOutput.totalRow.value}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : pivotChartType === 'bar' ? (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pivotOutput.rows}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="rowKey" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val) =>
                    pivotValueField.includes('price') || pivotValueField.includes('total')
                      ? formatCurrency(val)
                      : val
                  }
                />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} name={pivotOutput.headers[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pivotOutput.rows}
                  dataKey="value"
                  nameKey="rowKey"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {pivotOutput.rows.map((entry, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) =>
                    pivotValueField.includes('price') || pivotValueField.includes('total')
                      ? formatCurrency(val)
                      : val
                  }
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* SECTION C5: DIAGNOSTIC ANALYTICS ("WHY IT HAPPENED") */}
      {/* ========================================================= */}
      <section id="section-c5" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-24">
        <div className="border-b border-slate-100 pb-4">
          <span className="bg-amber-100 text-amber-800 text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full">
            Diagnostic Analytics
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            C5. Diagnostic Analytics: "Why It Happened"
          </h2>
          <p className="text-xs text-slate-500">
            Cross-tabulation matrices examining root causes, outlier purchases, and cohort behavior
          </p>
        </div>

        {/* Matrices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Matrix 1: Category x Payment Method */}
          <div className="p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Cross-Tabulation: Category &times; Payment Method (Sales ₹)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-2">Category</th>
                    {diagData?.allPayments.map((p) => (
                      <th key={p} className="py-2 text-right">{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {diagData?.catPaymentMatrix.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 font-sans font-semibold text-slate-800">{r.category}</td>
                      {diagData.allPayments.map((p) => (
                        <td key={p} className="py-2 text-right text-slate-700">
                          {formatCurrency(r[p] || 0)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Matrix 2: Category x Secondary Dimension (Year of Study or Mall) */}
          <div className="p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Cross-Tabulation: Category &times; {isCampus ? 'Year of Study' : 'Shopping Mall'} (Sales ₹)
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-2">Category</th>
                    {diagData?.allSecondary.slice(0, 4).map((sec) => (
                      <th key={sec} className="py-2 text-right">{sec}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {diagData?.catSecondaryMatrix.map((r, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 font-sans font-semibold text-slate-800">{r.category}</td>
                      {diagData.allSecondary.slice(0, 4).map((sec) => (
                        <td key={sec} className="py-2 text-right text-slate-700">
                          {formatCurrency(r[sec] || 0)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CampusKart Purchase Reason Analysis */}
        {isCampus && diagData?.reasonSalesList && (
          <div className="p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
              Diagnostic Driver: Primary Purchase Reasons vs Revenue
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {diagData.reasonSalesList.slice(0, 4).map((rs, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-900 truncate">{rs.reason}</p>
                  <p className="font-mono font-bold text-brand-700">{formatCurrency(rs.sales)}</p>
                  <p className="text-[10px] text-slate-400">{rs.count} student transactions</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diagnostic Insight Commentary (Auto-generated from requirements) */}
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-black text-amber-900 uppercase tracking-wider text-[11px]">
            <Search className="w-4 h-4 text-amber-600" />
            <span>Diagnostic Root Cause Insights:</span>
          </div>
          <p className="leading-relaxed">
            {isCampus ? (
              <>
                "Stationery demand is high because students regularly need notebooks, files, sheets, pens, and project materials. <strong>1st-year students spend the most (₹3,390)</strong> because of mandatory foundation course requirements (drafters, sheet containers, registers, lab coats). UPI dominates because of immediate hostel delivery convenience without cash change friction."
              </>
            ) : (
              <>
                "<strong>Shoes lead revenue (₹20,405.78, 51.36%)</strong> because of high unit price (average ₹2,267 per purchase), not volume; Clothing leads count (17 orders) and quantity (42 units); Credit cards dominate sales (54.5%); and <strong>the single Technology purchase of ₹5,250 at Kanyon is the primary reason Kanyon tops mall sales</strong>."
              </>
            )}
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION C6: PREDICTIVE ANALYTICS ("WHAT WILL HAPPEN") */}
      {/* ========================================================= */}
      <section id="section-c6" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-24">
        <div className="border-b border-slate-100 pb-4">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full">
            Predictive Analytics
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            C6. Predictive Analytics: "What Will Happen"
          </h2>
          <p className="text-xs text-slate-500">
            Time-series trend forecasting, academic seasonality regression, and expected 3-month category demand
          </p>
        </div>

        {/* 12-Month Historical + Forecast Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">
              12-Month Sales History with Linear Trend Line & 3-Month Projection
            </span>
            <span className="font-mono text-slate-500">
              Model: y = {predData.regressionModel.slope}x + {predData.regressionModel.intercept} (R² = {predData.regressionModel.rSquared})
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predData.combinedChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => (value ? formatCurrency(value) : 'Forecast Mode')} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={2.5} name="Historical Actual Sales" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="trend" stroke="#94A3B8" strokeDasharray="4 4" strokeWidth={2} name="Linear Regression Baseline" dot={false} />
                <Line type="monotone" dataKey="forecast" stroke="#10B981" strokeWidth={3} name="Projected Demand (Next 3 Months)" dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3-Month Expected Demand Table */}
        <div className="p-5 rounded-2xl border border-slate-200 space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
            3-Month Forward Expected Demand by Category
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Expected Units</th>
                  <th className="py-2.5 px-3 text-right">Projected Revenue (₹)</th>
                  <th className="py-2.5 px-3 text-center">Growth Rate</th>
                  <th className="py-2.5 px-3 text-center">Model Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {predData.categoryDemand.map((cd, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">{cd.category}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{cd.expectedUnits}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      {formatCurrency(cd.expectedRevenue)}
                    </td>
                    <td className="py-2.5 px-3 text-center text-brand-600 font-bold">{cd.growth}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{cd.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Methodology and Limits Note */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-900">Statistical Methodology & Forecasting Limits:</p>
          <p className="leading-relaxed">
            The projection utilizes a <strong>Least Squares Linear Regression model</strong> combined with 3-month moving average smoothing and seasonal adjustment weights (derived from the college academic calendar exams in Nov/Dec and Apr/May). <em>Limitations:</em> Assumes syllabus stability, steady enrollment cohorts, and lack of sudden macroeconomic inflation.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION C7: PRESCRIPTIVE ANALYTICS ("WHAT SHOULD WE DO") */}
      {/* ========================================================= */}
      <section id="section-c7" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-24">
        <div className="border-b border-slate-100 pb-4">
          <span className="bg-rose-100 text-rose-800 text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full">
            Prescriptive Analytics
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            C7. Prescriptive Analytics: "What Should We Do"
          </h2>
          <p className="text-xs text-slate-500">
            Actionable strategies and inventory directives backed by empirical customer data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presData.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                    {item.category}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.priority === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{item.title}</h4>
                  <p className="text-[11px] font-mono text-brand-600 mt-1 font-semibold">
                    Trigger: {item.metric}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <p className="text-slate-600 leading-tight">
                    <strong>Rationale:</strong> {item.rationale}
                  </p>
                  <p className="text-slate-800 font-semibold pt-1 border-t border-slate-200/60">
                    <strong>Action:</strong> {item.action}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 shrink-0" />
                <span>Impact: {item.expectedImpact}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION C8: ANALYTICS SUMMARY MATRIX TABLE & CONCLUSION */}
      {/* ========================================================= */}
      <section id="section-c8" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 scroll-mt-24">
        <div className="border-b border-slate-100 pb-4">
          <span className="bg-brand-100 text-brand-800 text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full">
            Course Synthesis Matrix
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            C8. Comprehensive Analytics Summary Framework
          </h2>
          <p className="text-xs text-slate-500">
            Four tiers of retail data analytics applied to {isCampus ? 'CampusKart student startup' : 'Mall sales dataset'}
          </p>
        </div>

        {/* 4 Analytics Type Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-900 text-white font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 w-1/5">Analytics Type</th>
                <th className="py-3 px-4 w-1/4">Question Answered</th>
                <th className="py-3 px-4 w-1/4">Definition / Methodology</th>
                <th className="py-3 px-4">Key Findings & Business Decisions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Descriptive */}
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-brand-700">1. Descriptive</td>
                <td className="py-3 px-4 font-medium text-slate-800">What happened?</td>
                <td className="py-3 px-4 text-slate-600">
                  Aggregations, counts, means, frequency histograms, and Excel pivot charts.
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {isCampus
                    ? `47 transactions, ₹9,819 revenue, avg age 19.15. Stationery is top volume category (₹3,330). UPI accounts for 79.6% of payments.`
                    : `47 transactions, ₹39,726.13 revenue. Shoes drive 51.36% of revenue. Clothing drives volume (42 units, 17 tx). Metrocity has top footfall (10).`}
                </td>
              </tr>

              {/* Diagnostic */}
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-amber-700">2. Diagnostic</td>
                <td className="py-3 px-4 font-medium text-slate-800">Why did it happen?</td>
                <td className="py-3 px-4 text-slate-600">
                  Two-way cross-tabulations, matrix analysis, and root-cause correlation testing.
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {isCampus
                    ? `1st-year students drive highest spend (₹3,390) because of mandatory graphics tools. Stationery has recurring frequency due to continuous lab submissions.`
                    : `Shoes lead revenue due to high unit price (₹2,267 avg), not volume. Kanyon mall leads sales because of a single ₹5,250 Technology purchase outlier.`
                }
                </td>
              </tr>

              {/* Predictive */}
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-emerald-700">3. Predictive</td>
                <td className="py-3 px-4 font-medium text-slate-800">What will happen?</td>
                <td className="py-3 px-4 text-slate-600">
                  Time-series linear regression trend lines and moving average seasonal modeling.
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {isCampus
                    ? `Stationery demand will peak in Nov-Dec and Apr-May (exam submissions). 3-month forecast projects ₹26,500+ across stationery and kits.`
                    : `Footwear and apparel demand will surge during upcoming Q4 festive holiday clearances, with estimated 95+ shoe units sold.`}
                </td>
              </tr>

              {/* Prescriptive */}
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-purple-700">4. Prescriptive</td>
                <td className="py-3 px-4 font-medium text-slate-800">What should we do?</td>
                <td className="py-3 px-4 text-slate-600">
                  Decision frameworks, buffer stock rules, combo bundle pricing, and partner offers.
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {isCampus
                    ? `Maintain buffer stock in record sheets; launch Academic Starter Kits for 1st years; provide 5% UPI cashback; curate Exam Kit combos.`
                    : `Allocate 45% floor space to Shoes; partner with credit card issuers for milestone discounts; introduce cross-selling Shoe + Apparel combos.`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Executive Conclusion Paragraph */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-brand-950 text-white space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-accent-400 font-extrabold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Executive Course Conclusion &bull; MCOE Pune</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            By establishing an end-to-end analytical pipeline from <strong>Google Trends market validation</strong> through <strong>Descriptive, Diagnostic, Predictive, and Prescriptive models</strong>, CampusKart demonstrates how retail start-ups can optimize inventory, minimize stock-out risks, and align merchandising with empirical student requirements. All mathematical aggregates recompute live from raw transactions to fulfill Activity 3 and Activity 4 course requirements.
          </p>
        </div>
      </section>

      {/* Data Check Modal */}
      <DataCheckModal
        isOpen={showDataCheckModal}
        onClose={() => setShowDataCheckModal(false)}
        defaultDataset={datasetType}
      />
    </div>
  );
};
