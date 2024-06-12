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
  latestTimestamp: Date,
  type?: 'exact'
): string {
    console.log("earliestTimestamp", earliestTimestamp);
    const years = calculateYearDifference(earliestTimestamp, latestTimestamp);
  const adjustedDateYears = addYears(new Date(earliestTimestamp), years);
  console.log("adjustedDateYears", adjustedDateYears);
  const months = calculateMonthDifference(adjustedDateYears, latestTimestamp);
  const adjustedDateMonths = addMonths(adjustedDateYears, months);
  const remainingDays = getRemainingDays(adjustedDateMonths, latestTimestamp);
  
    console.log("adjustedDateMonths", adjustedDateMonths);
    console.log("latestTimestamp", latestTimestamp);
  // Calculate the remaining hours after subtracting the days
  adjustedDateMonths.setDate(adjustedDateMonths.getDate() + remainingDays);
  const remainingHours = Math.floor((latestTimestamp.getTime() - adjustedDateMonths.getTime()) / (1000 * 60 * 60));
  // Calculate the remaining minutes after subtracting the hours
  adjustedDateMonths.setHours(adjustedDateMonths.getHours() + remainingHours);
  const remainingMinutes = Math.floor((latestTimestamp.getTime() - adjustedDateMonths.getTime()) / (1000 * 60));

  const result = [];

  if (years > 0) {
    result.push(`${pluralize(years, 'year')}`);
  } else if (type === 'exact') {
    result.push('0 years');
  }

  if (months > 0) {
    result.push(`${pluralize(months, 'month')}`);
  } else if (type === 'exact') {
    result.push('0 months');
  } 

  if (remainingDays > 0) {
    result.push(`${pluralize(remainingDays, 'day')}`);
  } else if (type === 'exact') {
    result.push('0 days');
  }

  if (remainingDays > 2 && type !== 'exact') {
    return result.join(' and ');
  }

  if (remainingHours > 0) {
    result.push(`${pluralize(remainingHours, 'hour')}`);
  } else if (type === 'exact') {
    result.push('0 hours');
  }

  if (remainingMinutes > 0) {
    result.push(`${pluralize(remainingMinutes, 'minute')}`);
  } else if (type === 'exact') {
    result.push('0 minutes');
  }

  if (type === 'exact') {
    return result.join(', ');
  }
  return result.join(' and ');
}



export function calculateYearDifference(
  earlierDate: Date, 
  laterDate: Date
): number {
  const earlierYear = earlierDate.getFullYear();
  const laterYear = laterDate.getFullYear();
  const earlierMonth = earlierDate.getMonth();
  const laterMonth = laterDate.getMonth();
  const earlierDay = earlierDate.getDate();
  const laterDay = laterDate.getDate();

  // Adjust the year difference if the month/day of the later date hasn't reached the month/day of the earlier date
  if (laterMonth < earlierMonth || (laterMonth === earlierMonth && laterDay < earlierDay)) {
    return laterYear - earlierYear - 1;
  }

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
  const earlierDay = earlierDate.getDate();
  const laterDay = laterDate.getDate();

  let monthsDiff = (laterYear - earlierYear) * 12 + (laterMonth - earlierMonth);

  // Adjust the month difference if the day of the later date is before the day of the earlier date
  if (laterDay < earlierDay) {
    monthsDiff -= 1;
  }

  return monthsDiff;
}


export function getRemainingDays(earliestTimestamp: Date, latestTimestamp: Date): number {
    const diffInMs = latestTimestamp.getTime() - earliestTimestamp.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return diffInDays;
}

function pluralize(count: number, noun: string): string {
  return count === 1 ? `1 ${noun}` : `${count} ${noun}s`;
}

// Helper functions to add years and months to a Date (safer than direct modification)
function addYears(date: Date, years: number): Date {
    const newDate = new Date(date);
    newDate.setFullYear(date.getFullYear() + years);
    return newDate;
}

export function addMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    const originalMonth = newDate.getMonth();
    const originalYear = newDate.getFullYear();
    const originalDay = newDate.getDate();
    
    newDate.setMonth(originalMonth + months);
    
    // Check if the year has changed due to adding months and adjust the day if necessary
    if (newDate.getFullYear() !== originalYear) {
        if (newDate.getDate() !== originalDay) {
            newDate.setDate(0); // Set to the last day of the previous month
        }
    }
    
    console.log("newDate", newDate);
    // Ensure the day remains consistent, adjusting for month rollover
    if (newDate.getDate() < originalDay) {
        newDate.setDate(0); // Set to the last day of the previous month
    }
    
    return newDate;
}
export function getExactDifference(earliestTimestamp: Date, latestTimestamp: Date): string {
    return getHumanFriendlyDifference(earliestTimestamp, latestTimestamp, 'exact');
}

export const getQueries = (evalItem: EvalItem): Set<string> => {
    const queries = new Set<string>();

    evalItem.query && queries.add(evalItem.query);

    // Check for queries in eval_parts
    evalItem.eval_parts?.forEach(part => {
        if (part.query) {
            queries.add(part.query);
        }
    });

    // Check for queries in images
    evalItem.images?.forEach(image => {
        if (image.query) {
            queries.add(image.query);
        }
    });

    return queries;
};