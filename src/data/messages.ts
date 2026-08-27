/**
 * Headline encouragement. A line is drawn at random on every page load.
 *
 * The clock and the calendar can override the general pool: late at night,
 * across the start of the academic year, and over Christmas.
 */

export const MESSAGES = [
  // Straight encouragement
  'Your best round is still ahead',
  'You are further along than you think',
  'Small steps, consistency beats cramming',
  'Steady work, real results',
  'Keep going, it adds up',
  'The past is the past, focus on the future!',
  'Getting a pass is not the end of the world',
  'One grade at a time',
  'Done beats perfect on a deadline',
  'Progress is rarely a straight line',

  // Gentle reality checks
  'Chatting with your friends in the atrium is not locking in',
  'Resist the temptation to blanka!',
  'The GPA calculator will not change your grade, only studying will!',
  'Do the macroeconomics main exam. Pushing it to retakes is a trap!',
  'One more past exam beats one more highlighter colour',
  'Rereading your notes is not the same as knowing them',
  'Coffee in the atrium is not a revision strategy',
  'You can retake a course. You cannot retake the spring.',
  'Refreshing this page will not raise the number',

  // Perspective
  'Do not forget to enjoy student life! You will graduate in no time',
  'Touch some grass every now and then',
  'Sleep is a study technique',
  'Comparing yourself to the curve helps nobody',
  'Ask the question. Someone else is wondering too.',
  'Show up for your group. They are counting on you.',
  'A bad period is a period, not a pattern',
  'Your degree is three years long, not one exam',
  'Consistency compounds. So does avoidance.',
  'You have done harder things than this period',
  'The average student also feels behind',
  'Two hours today beats ten in exam week',
  'You are allowed to be new at something',
  'One period does not decide the next',
  'Nobody has ever raised their GPA by checking it',
  'The reading will not read itself',
  'Half the room has not started either. Start anyway.',
  'Open the past exam. Just the first question.',
  'Rewriting notes in nicer handwriting is not studying',
  'Grades open doors. They do not walk through them.',
  'The people you study with matter more than the average',
  'Rest is not something you have to earn',
  'Ask for help before you need it',
];

/** Shown late at night, whatever else would have been picked. */
export const LATE_NIGHT_MESSAGES = [
  'School closes soon, the bunker awaits you',
  'Whatever this is, it will look better after sleep',
  'Nothing good gets learned after midnight',
];

/** Shown across the start of the academic year, aimed at the new intake. */
export const SCHOOL_START_MESSAGES = [
  'Välkommen alla nya småttingar!',
  'Do not catch småttingsjukan, remember to wash your hands',
  'The first maths test is not that important',
  'Data Analytics I is only 3 ECTS, do not forget the other two courses!',
  'You do not need 5.0 to end up in consulting or banking',
  'Everyone around you is just as lost this week',
  'Nobody will ever ask you about your first exam',
  'Say yes to things this term, the grades will still be there',
  'Learn where the library is before week five',
  'Ask a second-year. They remember being lost too.',
  'The first period sets your rhythm, not your degree',
  'Buy your course books secondhand',
  'Sign up for one thing that is not a course',
  'The names and the rooms settle down by October',
  'Nobody has read the whole reading list. Nobody.',
  'Three years is longer than it sounds. Pace yourself.',
];

/** Shown from mid-December into the new year. */
export const CHRISTMAS_MESSAGES = [
  'God jul och gott nytt år!',
  'Whatever the second period did to you, it is over',
  'Rest properly. January arrives soon enough.',
  'Nobody revises on julafton. Put it down.',
  'The library is closed. Take the hint.',
  'Julbord beats the reading room tonight',
  'New year, new period, clean slate',
  'Glögg now. Retakes are a January problem.',
];

export type MessageScope = 'school-start' | 'christmas' | 'late-night' | 'general';

/** Local calendar and clock in Stockholm, wherever the reader happens to be. */
export const stockholmNow = (now: Date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Stockholm',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(now);

  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  // Midnight can format as hour 24; fold it back to 0.
  return { month: value('month'), day: value('day'), hour: value('hour') % 24 };
};

/** 20 August through 15 September. */
export const isSchoolStart = ({ month, day }: { month: number; day: number }) =>
  (month === 8 && day >= 20) || (month === 9 && day <= 15);

/** 15 December through 6 January, so it spans julafton and trettondedagen. */
export const isChristmas = ({ month, day }: { month: number; day: number }) =>
  (month === 12 && day >= 15) || (month === 1 && day <= 6);

/** 22:00 up to but not including 05:00. */
export const isLateNight = ({ hour }: { hour: number }) => hour >= 22 || hour < 5;

/** The calendar wins over the clock: term start, then Christmas, then night. */
export const scopeFor = (now: Date = new Date()): MessageScope => {
  const clock = stockholmNow(now);
  if (isSchoolStart(clock)) return 'school-start';
  if (isChristmas(clock)) return 'christmas';
  if (isLateNight(clock)) return 'late-night';
  return 'general';
};

export const poolFor = (scope: MessageScope): string[] => {
  if (scope === 'school-start') return SCHOOL_START_MESSAGES;
  if (scope === 'christmas') return CHRISTMAS_MESSAGES;
  if (scope === 'late-night') return LATE_NIGHT_MESSAGES;
  return MESSAGES;
};

export const pickFrom = (pool: string[], random: number = Math.random()): string =>
  pool[Math.min(pool.length - 1, Math.floor(random * pool.length))];

export const pickMessage = (now: Date = new Date(), random: number = Math.random()): string =>
  pickFrom(poolFor(scopeFor(now)), random);
