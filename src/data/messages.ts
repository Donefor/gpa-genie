/**
 * Headline encouragement. One message is chosen per browser session, so it
 * stays put while you move between pages and changes when you come back.
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
];

/** Shown late at night, whatever else would have been picked. */
export const LATE_NIGHT_MESSAGE = 'School closes soon, the bunker awaits you';

/** Shown across the start of the academic year. */
export const SCHOOL_START_MESSAGE = 'Välkommen alla nya småttingar!';

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

/** 22:00 up to but not including 05:00. */
export const isLateNight = ({ hour }: { hour: number }) => hour >= 22 || hour < 5;

/**
 * The message the date and clock dictate, or null when nothing special is on.
 * School start wins outright; otherwise late night takes over.
 */
export const contextualMessage = (now: Date = new Date()): string | null => {
  const clock = stockholmNow(now);
  if (isSchoolStart(clock)) return SCHOOL_START_MESSAGE;
  if (isLateNight(clock)) return LATE_NIGHT_MESSAGE;
  return null;
};

export const randomMessage = (random: number = Math.random()): string =>
  MESSAGES[Math.min(MESSAGES.length - 1, Math.floor(random * MESSAGES.length))];

/** Contextual message if there is one, otherwise a random one. */
export const pickMessage = (now: Date = new Date(), random: number = Math.random()): string =>
  contextualMessage(now) ?? randomMessage(random);
