/**
 * Every SSE course that appears in the grade statistics, with credits and the
 * periods it runs in, from the school's course API and the grade history.
 *
 * Periods 1 and 2 fall in the autumn, 3 and 4 in the spring; a master's
 * semester is one of those halves, so it covers two periods.
 *
 * The school renumbers courses — the bachelor catalogue moved from three-digit
 * codes to BE###, and several master courses were reissued. Both numbers are
 * kept here, but the retired one is flagged and left out of the picker, or the
 * same course would appear twice.
 *
 * Row shape:
 *   [courseNo, name, ects | null, periods, rounds, registrations, lastTerm, retired]
 */

export type CatalogueRow = [
  courseNo: string,
  name: string,
  ects: number | null,
  periods: number[],
  rounds: number,
  registrations: number,
  lastTerm: string,
  retired: 0 | 1,
];

/** Standard course size at SSE, used when the catalogue no longer lists one. */
export const DEFAULT_ELECTIVE_CREDITS = 7.5;

/** Periods 1-2 are the autumn semester, 3-4 the spring. */
export const semesterOfPeriod = (period: number | null): 'Autumn' | 'Spring' | null =>
  period === null ? null : period <= 2 ? 'Autumn' : 'Spring';

export const CATALOGUE_ROWS: CatalogueRow[] = [
  ['NDH302', 'Accounting', 7.5, [2], 5, 325, '2502', 0],
  ['3310', 'Accounting and Financial Statement Analysis', 7.5, [1], 5, 237, '2501', 0],
  ['3314', 'Accounting and Financial Statement Analysis', 6.0, [1], 3, 280, '2501', 0],
  ['3315', 'Accounting for Grand Challenges', 7.5, [3], 3, 137, '2603', 0],
  ['BE301', 'Accounting I: Understanding Financial Reports', 6.0, [2], 5, 1823, '2502', 0],
  ['BE302', 'Accounting II: Analysing Performance', 6.0, [1], 5, 1657, '2501', 0],
  ['113', 'Advanced Business French', 7.5, [1,3], 6, 85, '2603', 0],
  ['117', 'Advanced Business German', 7.5, [1,3], 2, 18, '2603', 0],
  ['122', 'Advanced Business Spanish', 7.5, [1,3], 5, 47, '2603', 0],
  ['NDH103', 'Advanced Customer Management', 7.5, [2], 5, 268, '2502', 0],
  ['3307', 'Advanced Financial Analysis', 7.5, [3], 4, 235, '2503', 0],
  ['5303', 'Advanced Macroeconomics', 7.5, [2], 5, 259, '2502', 0],
  ['5301', 'Advanced Mathematics for Economic Analysis', 7.5, [1], 5, 279, '2501', 0],
  ['4329', 'Advanced Methods in Finance', null, [3], 1, 21, '2203', 0],
  ['5330', 'Advanced Microeconomic Theory', 7.5, [1,2], 5, 273, '2502', 0],
  ['1329', 'Advanced Strategic Management', 7.5, [1], 5, 421, '2501', 0],
  ['2318', 'AI Challenges to Business and Society', 7.5, [3], 3, 60, '2603', 0],
  ['BE928', 'AI, Innovation, and the Future of Work', 7.5, [2], 3, 75, '2502', 0],
  ['1327', 'An Experimentalist’s Toolbox', 7.5, [2,3], 3, 40, '2403', 0],
  ['NDH111', 'Analytics for Retail Merchandising', 6.0, [4], 3, 190, '2404', 0],
  ['759', 'Applied Business Strategy and Art of Case Cracking', 7.5, [3], 5, 134, '2603', 0],
  ['5314', 'Applied Econometric Time Series', 7.5, [3], 5, 195, '2603', 0],
  ['4328', 'Applied Financial Econometrics', null, [3], 1, 19, '2203', 0],
  ['767', 'Applied History: World Orders & Present Challenges', 7.5, [3], 5, 60, '2603', 0],
  ['621', 'Applied Marketing Theory', null, [1], 1, 93, '2101', 0],
  ['NDH007', 'Applied Retail Track', 7.5, [1], 5, 296, '2501', 0],
  ['8112', 'Artistic Entrepreneurship', 7.5, [3], 3, 30, '2503', 0],
  ['4335', 'Asset Management', 7.5, [2,4], 4, 138, '2604', 0],
  ['4394', 'Asset Management', null, [4], 1, 8, '2504', 0],
  ['4337', 'Asset Pricing and Investments', null, [1], 1, 100, '2201', 1],
  ['4339', 'Asset Pricing and Investments', 7.5, [1], 4, 325, '2501', 0],
  ['3309', 'Auditing, Governance, and Investor Assurance', 7.5, [4], 5, 251, '2604', 0],
  ['3312', 'Banks - Understanding the Business and Reports', 7.5, [4], 5, 260, '2604', 0],
  ['5326', 'Bayesian Econometrics', null, [1], 2, 31, '2201', 0],
  ['5316', 'Behavioral Economics', 7.5, [3,4], 5, 181, '2604', 0],
  ['4314', 'Behavioral Finance', 7.5, [1], 5, 172, '2501', 0],
  ['766', 'Behavioral Finance', 7.5, [3,4], 5, 463, '2603', 0],
  ['BE916', 'Beyond HRM for Diversity: Challenges and Change', 7.5, [2], 3, 35, '2402', 0],
  ['NDH105', 'Brand and Category Management', 7.5, [3], 5, 279, '2603', 0],
  ['1319', 'Brand Strategy', 7.5, [3], 5, 437, '2603', 0],
  ['BE001', 'BSc BE Program Channel 2026', 0.0, [1], 1, 320, '2101', 0],
  ['2319', 'Business & Sustainable Development Fundamentals', 7.5, [1,3], 3, 60, '2603', 0],
  ['103', 'Business and Economics in Literature', 7.5, [3], 5, 140, '2603', 0],
  ['1313', 'Business Creation and Development', 7.5, [1], 5, 422, '2501', 0],
  ['108', 'Business English', 7.5, [1,3], 9, 214, '2603', 0],
  ['109', 'Business English Applications', null, [1], 1, 5, '2101', 0],
  ['111', 'Business French', 7.5, [1], 5, 68, '2501', 0],
  ['116', 'Business German', 7.5, [1,3], 2, 18, '2501', 0],
  ['NDH801', 'Business Law', 7.5, [2], 5, 307, '2502', 0],
  ['BE671', 'Business Law I', 3.0, [2], 5, 1616, '2502', 0],
  ['BE672', 'Business Law II', 3.0, [3], 5, 1647, '2603', 0],
  ['323', 'Business Law III', null, [2], 1, 14, '2102', 0],
  ['324', 'Business Law IV', null, [2], 1, 22, '2102', 0],
  ['8065', 'Business Model Innovation', 7.5, [2,4], 10, 240, '2604', 0],
  ['BE924', 'Business Philosophy', 7.5, [1], 4, 95, '2501', 0],
  ['121', 'Business Spanish', 7.5, [1,3], 5, 128, '2503', 0],
  ['1008', 'Business Swedish', 7.5, [1,3], 8, 188, '2503', 0],
  ['9476', 'CEMS Business Project', 15.0, [3], 5, 308, '2603', 0],
  ['6194', 'CEMS International Internship', null, [1], 1, 34, '2101', 0],
  ['3306', 'CFO Challenges in Multinational Companies', null, [3], 2, 103, '2303', 0],
  ['1334', 'Changing the World through Negotiations', 2.5, [4], 3, 10, '2604', 0],
  ['BE923', 'Climate Finance', 7.5, [1], 4, 144, '2501', 0],
  ['4342', 'Climate, Financial Markets and the Economy', 7.5, [2,3], 2, 31, '2503', 0],
  ['756', 'Comparative Economic History: Theory and Evidence', 7.5, [4], 5, 191, '2604', 0],
  ['186', 'Comparative Public Policy: Sweden and the EU', 7.5, [3], 3, 14, '2403', 0],
  ['187', 'Comparative Public Policy: The Swedish Model', 7.5, [1], 5, 21, '2501', 0],
  ['4319', 'Corporate Finance', 7.5, [2], 5, 556, '2502', 0],
  ['644', 'Corporate Finance and Value Creation', null, [2], 1, 121, '2102', 1],
  ['BE453', 'Corporate Finance and Value Creation', 7.5, [4], 5, 975, '2604', 0],
  ['6123', 'Corporate Finance in Global Firms', 7.5, [3], 5, 224, '2603', 0],
  ['1306', 'Corporate Sustainability and Responsibility', 7.5, [2], 5, 153, '2502', 0],
  ['3304', 'Corporate Valuation', 7.5, [2], 5, 389, '2502', 0],
  ['6117', 'Creating International Firms (with live case)', 7.5, [1], 5, 263, '2501', 0],
  ['184', 'Creative Writing for Social Change', 7.5, [1,3], 6, 104, '2603', 0],
  ['3305', 'Current Issues in Financial Reporting', 7.5, [3], 5, 227, '2603', 0],
  ['NDH108', 'Current Issues in Retailing', 7.5, [1], 5, 279, '2501', 0],
  ['BE903', 'Current Topics in Data Science for Business', 7.5, [4], 3, 188, '2604', 0],
  ['NDH216', 'Customer Experience Management', 9.0, [4], 2, 126, '2604', 0],
  ['NDH803', 'Data Analytics for Retail Management', 6.0, [3], 2, 132, '2603', 0],
  ['BE601', 'Data Analytics I', 3.0, [1], 5, 1746, '2501', 0],
  ['BE602', 'Data Analytics II', 6.0, [3], 5, 1762, '2603', 0],
  ['BE603', 'Data Analytics III', 3.0, [2], 5, 1617, '2502', 0],
  ['NDH802', 'Data Analytics: Statistics for Retail Management', null, [4], 2, 143, '2304', 0],
  ['7313', 'Data Science Analytics', 7.5, [1,2], 5, 219, '2501', 0],
  ['BE902', 'Data Science for Business', 7.5, [2,3,4], 5, 412, '2603', 0],
  ['NDH113', 'Data Science for Retail Management', 6.0, [4], 2, 130, '2604', 0],
  ['7312', 'Data Science Strategy', null, [4], 1, 63, '2204', 0],
  ['BE917', 'Decision Making', 7.5, [2,3], 5, 115, '2603', 0],
  ['BE914', 'Decision-Making in Entrepreneurial Firms', 7.5, [2], 4, 123, '2502', 0],
  ['BE351', 'Degree Project in Accounting & Financial Mgmt', 15.0, [1,3], 8, 352, '2603', 0],
  ['639', 'Degree Project in Accounting & Financial Mgmt', null, [3], 1, 50, '2203', 1],
  ['BE551', 'Degree Project in Economics', 15.0, [1,3], 8, 146, '2603', 0],
  ['659', 'Degree Project in Economics', null, [3], 1, 23, '2203', 1],
  ['BE451', 'Degree Project in Finance', 15.0, [1,3], 8, 400, '2603', 0],
  ['649', 'Degree Project in Finance', null, [3], 1, 97, '2203', 1],
  ['BE151', 'Degree Project in Management', 15.0, [1,3], 8, 201, '2603', 0],
  ['619', 'Degree Project in Management', null, [3], 1, 60, '2203', 1],
  ['BE251', 'Degree Project in Marketing', 15.0, [1,3], 8, 101, '2603', 0],
  ['629', 'Degree Project in Marketing', null, [3], 1, 42, '2203', 1],
  ['NDH900', 'Degree Project in Retail Management', 15.0, [1,3], 6, 289, '2603', 0],
  ['643', 'Derivatives in Investment Management', null, [1], 1, 114, '2101', 0],
  ['BE919', 'Derivatives: Principles and Practice', 7.5, [2], 2, 76, '2302', 0],
  ['8074', 'Design Thinking', 7.5, [2], 5, 78, '2502', 0],
  ['BE912', 'Development Economics', 7.5, [2], 4, 190, '2502', 0],
  ['5315', 'Development Economics', 7.5, [1,3,4], 5, 159, '2603', 0],
  ['8110', 'Digital Health', 7.5, [1], 5, 47, '2501', 0],
  ['1330', 'Digital Transformation', 7.5, [4], 5, 408, '2604', 0],
  ['764', 'Digitalization in Finance', 7.5, [3,4], 5, 182, '2604', 0],
  ['9997', 'East Asia & the Global Economy: Advanced Analyses', 7.5, [1,2,4], 5, 62, '2504', 0],
  ['5304', 'Econometrics', 7.5, [1,2], 5, 260, '2501', 0],
  ['BE913', 'Economic Policy Analysis in Sweden', 7.5, [1], 4, 115, '2501', 0],
  ['NDH401', 'Economics I', 7.5, [1], 5, 322, '2501', 0],
  ['BE501', 'Economics I: Microeconomics', 6.0, [1], 5, 1617, '2501', 0],
  ['NDH402', 'Economics II', 7.5, [4], 5, 396, '2604', 0],
  ['BE502', 'Economics II: Macroeconomics', 6.0, [4], 5, 1835, '2604', 0],
  ['652', 'Economics of Organization', null, [2], 1, 41, '2102', 0],
  ['651', 'Empirical Economics', null, [1], 1, 29, '2101', 0],
  ['4338', 'Empirical Methods in Finance', 7.5, [2], 4, 401, '2502', 0],
  ['8078', 'Entrepreneurial Family Firms', 7.5, [4], 5, 167, '2604', 0],
  ['4326', 'Entrepreneurial Finance and Venture Capital', 7.5, [1], 5, 234, '2501', 0],
  ['8071', 'Entrepreneurship in Developing Countries', 7.5, [1], 5, 93, '2501', 0],
  ['8113', 'Entrepreneurship in the Welfare State', 7.5, [2,4], 2, 16, '2504', 0],
  ['BE938', 'European Security: A Turbulent World Order', 7.5, [3], 1, 5, '2603', 0],
  ['8063', 'Execution - Running Your Own Company', 7.5, [1,3], 10, 201, '2603', 0],
  ['9310', 'Executive Trainee Module', 30.0, [1], 5, 136, '2501', 0],
  ['NDH403', 'Finance', 7.5, [1], 5, 320, '2501', 0],
  ['8088', 'Finance for Start-Ups', 7.5, [3], 5, 136, '2603', 0],
  ['BE401', 'Finance I', 3.0, [4], 5, 1611, '2604', 0],
  ['315', 'Finance I', null, [4], 1, 4, '2304', 1],
  ['BE402', 'Finance II', 6.0, [1], 5, 1620, '2501', 0],
  ['3303', 'Financial Analysis', 7.5, [1], 5, 397, '2501', 0],
  ['7311', 'Financial and Business History', 7.5, [4], 5, 94, '2604', 0],
  ['3311', 'Financial Communication', 7.5, [4], 4, 247, '2604', 0],
  ['631', 'Financial Reporting and Financial Markets', null, [1], 1, 128, '2101', 1],
  ['BE352', 'Financial Reporting and Financial Markets', 7.5, [3], 5, 1023, '2603', 0],
  ['5331', 'Firms, Misallocation and the Macroeconomy', null, [4], 2, 37, '2304', 0],
  ['BE915', 'First-time Manager: Leading Yourself and Others', 7.5, [1], 4, 140, '2501', 0],
  ['4318', 'Fixed Income and Derivatives Markets', null, [2], 1, 128, '2102', 0],
  ['6124', 'Foundations of the Global Economy', 7.5, [2], 5, 263, '2502', 0],
  ['BE911', 'From Start-Up to High-Growth Firm: Value Creation', 7.5, [2], 4, 231, '2502', 0],
  ['5332', 'Game Theory', 7.5, [3,4], 5, 143, '2604', 0],
  ['5328', 'Gender and the Labor Market', 7.5, [1,2], 5, 125, '2501', 0],
  ['BE801', 'Global Challenges I: Understanding', 6.0, [1], 5, 1585, '2501', 0],
  ['BE802', 'Global Challenges II: Shifting', 6.0, [2], 5, 1460, '2502', 0],
  ['9480', 'Global Leadership', 7.5, [3], 5, 308, '2603', 0],
  ['1331', 'Global Virtual Teams', 7.5, [3], 5, 66, '2603', 0],
  ['BE934', 'Governance and Key Actors in Migration', 7.5, [2], 1, 46, '2502', 0],
  ['8064', 'Growth - Managing Your Firm', 7.5, [2,4], 10, 180, '2604', 0],
  ['BE925', 'Happiness and Wellbeing: Making a Better Life', 7.5, [2], 4, 716, '2502', 0],
  ['BE937', 'Healthcare Policy for the Social Good', 7.5, [3], 1, 14, '2603', 0],
  ['185', 'History of Modern Scandinavian Art & Architecture', 7.5, [1,3], 10, 44, '2603', 0],
  ['4327', 'Household Finances and Wealth Management', 7.5, [2,4], 5, 98, '2502', 0],
  ['BE901', 'Hybrid Organizations - Value Creation and Strategy', 7.5, [3], 5, 182, '2603', 0],
  ['8061', 'Ideation - Creating a Business Idea', 7.5, [1,3], 10, 302, '2603', 0],
  ['BE906', 'Impactful Entrepreneurship for Global Challenges', 7.5, [3], 5, 210, '2603', 0],
  ['5321', 'Industrial Organization', 7.5, [4], 3, 96, '2404', 0],
  ['5329', 'Inequality, Household Behavior, & the Macroeconomy', 7.5, [1,2,3,4], 6, 124, '2603', 0],
  ['1404', 'InnoLab: Solving Innovation Challenges through CI', 7.5, [3], 4, 94, '2603', 0],
  ['BE701', 'Innovation', 6.0, [4], 5, 1477, '2604', 0],
  ['1318', 'Innovation Management', 7.5, [3], 5, 422, '2603', 0],
  ['6113', 'Innovation Processes, Capabilities and Networks', 7.5, [2], 5, 263, '2502', 0],
  ['NDH107', 'Innovation Strategy', 7.5, [4], 5, 264, '2604', 0],
  ['BE922', 'International Commercial Law', 7.5, [1], 4, 380, '2501', 0],
  ['BE553', 'International Economics', 7.5, [4], 3, 287, '2404', 0],
  ['BE935', 'International Finance', 7.5, [2,3], 2, 138, '2503', 0],
  ['4306', 'International Financial Management', 7.5, [3], 5, 305, '2603', 0],
  ['3301', 'International Financial Reporting', 7.5, [2], 5, 383, '2502', 0],
  ['6196', 'International Immersion', null, [3], 4, 211, '2503', 0],
  ['6195', 'International Internship', null, [4], 2, 4, '2304', 0],
  ['2307', 'International Management and Strategy', 7.5, [1], 5, 241, '2501', 0],
  ['BE909', 'International Taxation of Entrepreneurs', null, [4], 1, 20, '2204', 0],
  ['BE908', 'International Taxation of Groups', 7.5, [3], 4, 75, '2603', 0],
  ['5311', 'International Trade', 7.5, [3], 3, 46, '2403', 0],
  ['BE933', 'Internship Training', 15.0, [1], 2, 37, '2501', 0],
  ['7316', 'Introduction to Data Analysis in Python', 4.0, [1,4], 5, 68, '2501', 0],
  ['NDH101', 'Introduction to Retailing', 7.5, [1], 5, 308, '2501', 0],
  ['118', 'Introductory Business Mandarin', null, [3], 1, 19, '2203', 0],
  ['10061', 'Introductory Swedish Part 1a', 4.0, [1], 1, 28, '2501', 0],
  ['10062', 'Introductory Swedish Part 1b', 3.5, [3], 1, 22, '2603', 0],
  ['1006', 'Introductory Swedish Part I', 7.5, [1,3], 10, 842, '2603', 0],
  ['1007', 'Introductory Swedish Part II', 7.5, [1,3], 10, 341, '2603', 0],
  ['BE452', 'Investment Management', 7.5, [3], 5, 967, '2603', 0],
  ['3313', 'Investments and Value Creation in Global Sports', 7.5, [2], 5, 440, '2502', 0],
  ['9993', 'Japan in the Global Economy: Advanced Analyses', 7.5, [1,4], 3, 22, '2401', 0],
  ['NDH747', 'Key Account Management', 3.0, [2], 5, 54, '2502', 0],
  ['6193', 'Language Proficiency (CEMS Language Requirements)', null, [1,3], 6, 214, '2603', 0],
  ['734', 'Law of Companies and other Legal Entities', 7.5, [3], 5, 341, '2603', 0],
  ['1321', 'Leading Change', 7.5, [4], 5, 407, '2604', 0],
  ['BE905', 'Leading Teams: Advanced Project Management', 7.5, [4], 5, 221, '2604', 0],
  ['768', 'Luxury Goods and Art in the Market', 7.5, [4], 5, 208, '2604', 0],
  ['1332', 'M&A: The Art of the Deal Making', 7.5, [1,2], 4, 78, '2501', 0],
  ['4312', 'M&A: Value, Corporate Structure and Control', 7.5, [2,4], 3, 186, '2402', 0],
  ['737', 'Macroeconomic Policy Analysis', 7.5, [4], 3, 66, '2404', 0],
  ['4330', 'Macroeconomics and Finance', 7.5, [3], 4, 151, '2503', 0],
  ['NDH303', 'Management & Organization', 7.5, [1], 5, 293, '2501', 0],
  ['1326', 'Management Accounting & Control', 7.5, [2], 5, 422, '2502', 0],
  ['NDH301', 'Management Control', 7.5, [3], 5, 338, '2603', 0],
  ['BE101', 'Management I: Organizing', 6.0, [2], 5, 1580, '2502', 0],
  ['BE102', 'Management II: Leadership', 3.0, [1], 5, 1547, '2501', 0],
  ['611', 'Management: Consulting and Change', null, [2], 1, 71, '2102', 1],
  ['BE153', 'Management: Consulting and Change', 7.5, [4], 5, 488, '2604', 0],
  ['612', 'Management: Operations', null, [1], 1, 65, '2101', 1],
  ['BE152', 'Management: Operations', 7.5, [3], 5, 484, '2603', 0],
  ['194', 'Management: Organizational Leadership', null, [1], 4, 53, '2401', 0],
  ['2314', 'Managing Current Business Challenges', null, [2], 2, 38, '2202', 0],
  ['6125', 'Managing Data and AI in the Global Workplace', 7.5, [3], 4, 103, '2603', 0],
  ['BE929', 'Managing Digitalization', 7.5, [1], 2, 32, '2501', 0],
  ['6118', 'Managing Human Dynamics in the Global Firm', 7.5, [1], 5, 264, '2501', 0],
  ['BE931', 'Market Regulation, Competition & Antitrust Law', 7.5, [4], 3, 66, '2604', 0],
  ['2316', 'Market Shaping: Revolutionizing Strategizing', 7.5, [1], 4, 105, '2501', 0],
  ['BE252', 'Market Strategies and Customer Value', 7.5, [3], 5, 260, '2603', 0],
  ['NDH201', 'Marketing', 7.5, [2], 5, 314, '2502', 0],
  ['BE201', 'Marketing', 6.0, [3], 5, 1522, '2603', 0],
  ['NDH215', 'Marketing Communications', 6.0, [3,4], 5, 290, '2603', 0],
  ['622', 'Marketing in Practice', null, [2], 1, 90, '2102', 0],
  ['NDH214', 'Marketing Research', 6.0, [3], 3, 175, '2403', 1],
  ['NDH204', 'Marketing Research', 7.5, [4], 3, 192, '2604', 0],
  ['BE253', 'Marketing Strategies and Customer Behavior', 7.5, [4], 5, 250, '2604', 0],
  ['1405', 'Mastering Data in the Real World with Python', 7.5, [3], 2, 113, '2603', 0],
  ['5349', 'Methodology for MSc Thesis in Economics', 0.0, [3], 1, 62, '2203', 0],
  ['4354', 'MFIN Business Project', 15.0, [1,3], 1, 13, '2603', 0],
  ['6198', 'MIB Immersion Track', null, [1], 1, 55, '2101', 0],
  ['6199', 'MIB Professional Path Finder', 0.0, [1], 1, 55, '2101', 0],
  ['6181', 'MIB Research Project', 15.0, [3], 5, 263, '2603', 0],
  ['6185', 'MIB Research Project Thesis Completion', 15.0, [3], 4, 9, '2603', 0],
  ['BE926', 'Migration Policy and Politics', 7.5, [3], 4, 24, '2603', 0],
  ['9482', 'Model UNFCCC, CEMS', 7.5, [4], 5, 24, '2604', 0],
  ['5334', 'Monetary Economics', 7.5, [4], 2, 75, '2604', 0],
  ['BE921', 'Nationalism and Populism', 7.5, [1], 4, 19, '2501', 0],
  ['5324', 'Natural Resource and Energy Economics', 7.5, [1], 5, 154, '2501', 0],
  ['7314', 'Navigating AI: Strategy and Impact', 7.5, [4], 4, 110, '2604', 0],
  ['BE930', 'Navigating Public Policy in the 21st Century', 7.5, [2], 2, 62, '2402', 0],
  ['8072', 'Negotiations for Start-ups', 7.5, [4], 5, 91, '2604', 0],
  ['1328', 'Operations Strategy', 7.5, [2], 5, 422, '2502', 0],
  ['632', 'Performance Measurement and Business Control', null, [2], 1, 137, '2102', 1],
  ['BE353', 'Performance Measurement and Business Control', 7.5, [4], 5, 980, '2604', 0],
  ['8114', 'Policy Ventures: Innovation in Public Organization', 7.5, [1,2], 2, 23, '2501', 0],
  ['4317', 'Portfolio Choice and Asset Pricing', null, [1], 1, 28, '2101', 0],
  ['4332', 'Portfolio Choice and Asset Pricing', null, [1], 1, 147, '2101', 0],
  ['128', 'Practical Rhetoric for Business and Life', 7.5, [1,3], 2, 47, '2603', 0],
  ['NDH307', 'Principles of Happiness', 3.0, [3], 2, 116, '2603', 0],
  ['4310', 'Private Equity', 7.5, [2,3,4], 5, 304, '2604', 0],
  ['1013', 'Professional Swedish', 7.5, [1,3], 1, 34, '2603', 0],
  ['7310', 'Quantitative Business Analysis Models', 7.5, [2], 5, 370, '2502', 0],
  ['119', 'Reading the Economic Humanities', 7.5, [1], 4, 84, '2501', 0],
  ['4333', 'Real Estate Finance', 7.5, [3,4], 4, 284, '2604', 0],
  ['4331', 'Responsibility and Sustainability', 1.5, [1], 5, 476, '2501', 0],
  ['NDH306', 'Retail Accounting and Financial Management', 7.5, [2], 5, 376, '2502', 0],
  ['NDH676', 'Retail Clubs & Tutorials', 0.0, [1], 1, 179, '2101', 0],
  ['NDH305', 'Retail Operations', 7.5, [2], 5, 246, '2502', 0],
  ['2317', 'Rhetoric: The Art of Persuasion', 7.5, [2], 3, 32, '2502', 0],
  ['4340', 'Risk Management', 7.5, [3,4], 4, 154, '2603', 0],
  ['NDH212', 'Sales and Service Management', 6.0, [3,4], 3, 181, '2404', 0],
  ['881', 'Self Leadership', null, [2,4], 2, 10, '2204', 0],
  ['6122', 'Shaping Global Markets', 7.5, [3], 5, 200, '2603', 0],
  ['NDH112', 'Shopper Marketing', 6.0, [3], 3, 176, '2403', 0],
  ['8093', 'Social Entrepreneurship', 7.5, [2,4], 5, 87, '2502', 0],
  ['BE920', 'Social Psychology of Health and Well-Being', 7.5, [1], 3, 21, '2501', 0],
  ['4336', 'Special Situation Investing', 7.5, [4], 4, 165, '2604', 0],
  ['1009', 'Spoken Professional Swedish', 7.5, [3], 4, 71, '2503', 0],
  ['883', 'SSE MSc Mentor Program', null, [1], 1, 2, '2101', 0],
  ['1391', 'Stockholms Köpmansklubb MBI PT', 0.0, [1], 1, 78, '2101', 0],
  ['3302', 'Strategic Management Control', 7.5, [1], 5, 407, '2501', 0],
  ['BE927', 'Strategic Profitability Analysis', 7.5, [4], 4, 296, '2604', 0],
  ['9481', 'Strategic Thinking in a Global Digital World', 7.5, [1,2], 5, 286, '2501', 0],
  ['BE202', 'Strategy', 6.0, [2], 5, 1506, '2502', 0],
  ['BE907', 'Strategy Creation and Implementation', 7.5, [4], 3, 169, '2504', 0],
  ['NDH203', 'Supply Chain Management', 7.5, [3], 5, 299, '2603', 0],
  ['BE918', 'Sustainability Challenges: Business in Society', 7.5, [1], 4, 145, '2501', 0],
  ['4334', 'Sustainable Finance', 7.5, [3,4], 5, 308, '2603', 0],
  ['BE904', 'The AI Launchpad', 7.5, [1,3], 4, 141, '2501', 0],
  ['BE003', 'The B&E Reflection Series 2026', 0.0, [1,2], 5, 1585, '2502', 0],
  ['BE002', 'The Basics of Information Retrieval', 0.0, [1], 1, 2, '2101', 0],
  ['BE554', 'The Economic Approach to Policy Design', 7.5, [4], 2, 141, '2604', 0],
  ['5327', 'The Economics of Pollution and Climate Change', 7.5, [2], 5, 86, '2502', 0],
  ['1403', 'The Future of Europe', 7.5, [1], 5, 153, '2501', 0],
  ['9484', 'The Future of Money: Innovation and Policy', 7.5, [3,4], 5, 112, '2604', 0],
  ['1333', 'The Good Life', 7.5, [2,4], 3, 109, '2604', 0],
  ['BE936', 'The Psychology of Emotion and Relationships', 7.5, [1,3], 2, 10, '2603', 0],
  ['183', 'The Psychology of Work', 7.5, [1,3], 10, 173, '2603', 0],
  ['5333', 'The Road to the Green Transition', 7.5, [3], 2, 57, '2603', 0],
  ['3350', 'Thesis in Accounting and Financial Management', 30.0, [1,3], 10, 328, '2603', 0],
  ['1351', 'Thesis in Business & Management', 30.0, [1,3], 10, 420, '2603', 0],
  ['5350', 'Thesis in Economics', 30.0, [1,3], 10, 420, '2603', 0],
  ['4350', 'Thesis in Finance', 30.0, [1,3], 10, 540, '2603', 0],
  ['8070', 'Trendspotting & Future Thinking', 7.5, [3], 5, 98, '2603', 0],
  ['BE552', 'Using Data to Solve Economic and Social Problems', 7.5, [3], 5, 353, '2603', 0],
  ['4324', 'Value Investing', 7.5, [1], 5, 428, '2501', 0],
  ['4325', 'Value Investing II: Frontiers', 7.5, [2], 5, 206, '2502', 0],
  ['1401', 'Vision Design', 7.5, [2], 5, 136, '2502', 0],
];

export interface CatalogueCourse {
  courseNo: string;
  name: string;
  credits: number;
  /** False when the credits are the fallback rather than published. */
  creditsKnown: boolean;
  /** Every period the course is known to run in, ascending. */
  periods: number[];
  rounds: number;
  registrations: number;
  /** Last term it was examined, as YYPP. */
  lastTerm: string;
  /** True when a newer number carries the same course. */
  retired: boolean;
  /** True when another current course shares this name. */
  ambiguous?: boolean;
}

const toCourse = ([courseNo, name, ects, periods, rounds, registrations, lastTerm, retired]: CatalogueRow): CatalogueCourse => ({
  courseNo,
  name,
  credits: ects ?? DEFAULT_ELECTIVE_CREDITS,
  creditsKnown: ects !== null,
  periods,
  rounds,
  registrations,
  lastTerm,
  retired: retired === 1,
});

/** Everything in the export, retired numbers and non-credit entries included. */
export const ALL_CATALOGUE: CatalogueCourse[] = CATALOGUE_ROWS.map(toCourse);

/**
 * What can fill an elective slot. Left out are courses published at 0 ECTS —
 * programme channels, reflection series — which carry no weight in an average,
 * and numbers a newer course has replaced.
 */
export const CATALOGUE: CatalogueCourse[] = (() => {
  const live = ALL_CATALOGUE.filter((c) => c.credits > 0 && !c.retired);
  // Where two courses that are both current share a name, the number is the
  // only thing telling them apart, so the picker has to show it.
  const counts = new Map<string, number>();
  live.forEach((c) => {
    const key = c.name.trim().toLowerCase();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return live.map((c) => ({
    ...c,
    ambiguous: (counts.get(c.name.trim().toLowerCase()) ?? 0) > 1,
  }));
})();

const BY_NO = new Map(ALL_CATALOGUE.map((c) => [c.courseNo, c]));
export const catalogueCourse = (courseNo: string) => BY_NO.get(courseNo);

/** Courses that can be taken in any of the given periods. */
export const coursesInPeriods = (periods: number[]): CatalogueCourse[] =>
  periods.length === 0
    ? CATALOGUE
    : CATALOGUE.filter((course) => course.periods.some((p) => periods.includes(p)));
