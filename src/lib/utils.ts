import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const extractTimestampTwitter = (statusId: string) => {
    const tweetId = BigInt(statusId);
    const timestampMs = tweetId / BigInt(2 ** 22) + BigInt(1288834974657);
    return new Date(Number(timestampMs));
};



export const isTimestampFriendly = (url: string): boolean => {
    return ['twitter.com', 'x.com', 'infosec.exchange', 'mastodon.social'].some(domain => url.includes(domain));
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
        console.log('url', url);
        return extractTimestampTwitter(statusId);
    } else if (url.includes('mastodon.social') || url.includes('infosec.exchange')) {
        return extractTimestampMastodon(statusId);
    } else {
        throw new Error('Invalid URL');
    }
};