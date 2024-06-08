import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { EvalItem } from "../types"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const extractTimestampTwitter = (statusId: string) => {
    const tweetId = BigInt(statusId);
    const timestampMs = tweetId / BigInt(2 ** 22) + BigInt(1288834974657);
    return new Date(Number(timestampMs));
};



export const isTimestampFriendly = (evalItem: EvalItem): boolean => {
    if (evalItem.datetime) {
        return true;
    } else {
        return ['twitter.com', 'x.com', 'infosec.exchange', 'mastodon.social']
            .some(domain => evalItem.url.includes(domain));
    }
};



/**
 * Extracts the timestamp from a Mastodon status ID (Snowflake ID)
 * @param {string} statusId - The Mastodon status ID
 * @returns {Date} The timestamp represented by the status ID
 */
const extractTimestampMastodon = (statusId: string): Date => {
    // Convert the status ID to a BigInt
    const snowflakeId = BigInt(statusId);

    // Shift the ID 16 bits to the right to remove the sequence number
    const timestamp = Number(snowflakeId >> BigInt(16));

    // Mastodon uses the Unix epoch (1970-01-01T00:00:00Z) as the reference
    // The timestamp is in milliseconds
    const unixEpochMs = 1000;

    // Create a new Date object from the timestamp
    const date = new Date(timestamp + unixEpochMs);

    return date;
}

export const extractTimestamp = (url: string): Date => {
    const segments = url.split('/');
    const statusId = segments[segments.length - 1];
    if (url.includes('twitter.com') || url.includes('x.com')) {
        return extractTimestampTwitter(statusId);
    } else if (url.includes('mastodon.social') || url.includes('infosec.exchange')) {
        return extractTimestampMastodon(statusId);
    } else {
        throw new Error('Invalid URL');
    }
};




export function getHumanFriendlyDifference(
  earliestTimestamp: Date, 
  latestTimestamp: Date
): string {
  const diffInMilliseconds = Math.abs(
    latestTimestamp.getTime() - earliestTimestamp.getTime()
  );
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const years = calculateYearDifference(earliestTimestamp, latestTimestamp);
  const months = calculateMonthDifference(earliestTimestamp, latestTimestamp);
  const weeks = calculateWeeksDifference(earliestTimestamp, latestTimestamp);
  const remainingDays = diffInDays % 7;
  const remainingHours = diffInHours % 24;
  const remainingMinutes = diffInMinutes % 60;
  

  const result = [];

  if (years > 0) {
    result.push(`${pluralize(years, 'year')}`);
  }

  if (months > 0) {
    result.push(`${pluralize(months, 'month')}`);
  }
  if (weeks > 0) {
    result.push(`${pluralize(weeks, 'week')}`);
  }
  if (remainingDays > 0) {
    result.push(`${pluralize(remainingDays, 'day')}`);
  }

  if (remainingHours > 0) {
    result.push(`${pluralize(remainingHours, 'hour')}`);
  }

  if (remainingMinutes > 0) {
    result.push(`${pluralize(remainingMinutes, 'minute')}`);
  }

  return result.join(' and ');
}

export function calculateYearDifference(
  earlierDate: Date, 
  laterDate: Date
): number {
  const earlierYear = earlierDate.getFullYear();
  const laterYear = laterDate.getFullYear();
  return laterYear - earlierYear;
}
export function calculateMonthDifference(
  earlierDate: Date, 
  laterDate: Date
): number {
  const earlierMonth = earlierDate.getMonth();
  const laterMonth = laterDate.getMonth();
  const earlierYear = earlierDate.getFullYear();
  const laterYear = laterDate.getFullYear();

  const monthsDiff = (laterYear - earlierYear) * 12 + (laterMonth - earlierMonth);

  const earlierDay = earlierDate.getDate();
  const laterDay = laterDate.getDate();

  // Only adjust the month difference if the day of the later date is before the day of the earlier date
  if (laterDay < earlierDay) {
    return monthsDiff - 1;
  }

  return monthsDiff;
}

export const calculateWeeksDifference = (earliestTimestamp: Date, latestTimestamp: Date): number => {
  const totalMonths = calculateMonthDifference(earliestTimestamp, latestTimestamp);
  const totalYears = calculateYearDifference(earliestTimestamp, latestTimestamp);
  const daysInYears = totalYears * 365;
  const daysInMonths = (totalMonths % 12) * 30; // Approximation assuming each month has 30 days
  const diffInMilliseconds = latestTimestamp.getTime() - earliestTimestamp.getTime();
  const totalDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  const remainingDays = totalDays - (daysInYears + daysInMonths);
  const weeks = Math.floor(remainingDays / 7);
  return weeks;
}


function pluralize(count: number, noun: string): string {
  return count === 1 ? `1 ${noun}` : `${count} ${noun}s`;
}