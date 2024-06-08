import { getHumanFriendlyDifference, calculateMonthDifference, getRemainingDays, getExactDifference, addMonths } from "../lib/utils";

describe("getHumanFriendlyDifference", () => {
  it("should return correct difference for months and days", () => {
    const latestTimestamp = new Date("2023-10-03T00:00:00Z");
    const earliestTimestamp = new Date("2023-09-01T00:00:00Z"); // 1 month and 2 days ago
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("1 month and 2 days");
  });

  it("should return correct difference for years, months, and days", () => {
    const latestTimestamp = new Date("2023-10-03T00:00:00Z");
    const earliestTimestamp = new Date("2020-07-01T00:00:00Z"); // 3 years, 3 months, and 2 days ago
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("3 years and 3 months and 2 days");
  });

  it("should return correct difference for days and hours", () => {
    const latestTimestamp = new Date("2023-10-03T12:00:00Z");
    const earliestTimestamp = new Date("2023-10-01T00:00:00Z"); // 2 days and 12 hours ago
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("2 days and 12 hours");
  });

  it("should return correct difference for hours and minutes", () => {
    const latestTimestamp = new Date("2023-10-03T12:30:00Z");
    const earliestTimestamp = new Date("2023-10-03T10:00:00Z"); // 2 hours and 30 minutes ago
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("2 hours and 30 minutes");
  });

  it("should return correct difference for years and months", () => {
    const latestTimestamp = new Date("2023-10-01T00:00:00Z");
    const earliestTimestamp = new Date("2021-07-01T00:00:00Z"); // 2 years and 3 months ago
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("2 years and 3 months");
  });

  it("should return correct difference for months and weeks", () => {
    const latestTimestamp = new Date("2023-10-01T00:00:00Z");
    const earliestTimestamp = new Date("2023-06-10T00:00:00Z"); // 2 months and 3 weeks ago
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("3 months and 21 days");
  });

  it("should return correct difference for weeks and days", () => {
    const latestTimestamp = new Date("2023-09-17T00:00:00Z");
    const earliestTimestamp = new Date("2023-09-01T00:00:00Z"); // 2 weeks and 2 days ago
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("16 days");
  });


  it("should return the correct Wayback diff", () => {
    const latestTimestamp = new Date("2024-06-06T23:03:26.000Z");
    const earliestTimestamp = new Date("2024-02-01T05:00:44-05:00");
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("4 months and 5 days");
  });

  it("should return correct difference for minutes", () => {
    const latestTimestamp = new Date("2023-10-01T00:00:00Z");
    const earliestTimestamp = new Date("2023-09-30T23:58:00Z"); // 2 minutes ago
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("2 minutes");
  });



it("should return correct month difference for same year", () => {
  const earlierDate = new Date("2023-01-15T00:00:00Z");
  const laterDate = new Date("2023-10-01T00:00:00Z"); // 8 months and 16 days
  const result = calculateMonthDifference(earlierDate, laterDate);
  expect(result).toBe(8);
});

it("should return correct month difference for different years", () => {
  const earlierDate = new Date("2021-07-01T00:00:00Z");
  const laterDate = new Date("2023-10-01T00:00:00Z"); // 2 years and 3 months
  const result = calculateMonthDifference(earlierDate, laterDate);
  expect(result).toBe(27);
});

it("should return correct month difference when earlier day is greater", () => {
  const earlierDate = new Date("2023-03-31T00:00:00Z");
  const laterDate = new Date("2023-05-01T00:00:00Z"); // 1 month
  const result = calculateMonthDifference(earlierDate, laterDate);
  expect(result).toBe(1);
});

it("should return correct month difference when later day is greater", () => {
  const earlierDate = new Date("2023-01-01T00:00:00Z");
  const laterDate = new Date("2023-03-31T00:00:00Z"); // 2 months
  const result = calculateMonthDifference(earlierDate, laterDate);
  expect(result).toBe(2);
});


  it("should return 0 days when dates are the same", () => {
    const timestamp = new Date("2023-10-01T00:00:00Z");
    const result = getRemainingDays(timestamp, timestamp);
    expect(result).toBe(0);
  });

  it("should return 1 day when the difference is exactly one day", () => {
    const earlierTimestamp = new Date("2023-09-30T00:00:00Z");
    const laterTimestamp = new Date("2023-10-01T00:00:00Z");
    const result = getRemainingDays(earlierTimestamp, laterTimestamp);
    expect(result).toBe(1);
  });

  it("should return correct days for dates with time differences", () => {
    const earlierTimestamp = new Date("2023-09-30T23:00:00Z");
    const laterTimestamp = new Date("2023-10-02T01:00:00Z");
    const result = getRemainingDays(earlierTimestamp, laterTimestamp);
    expect(result).toBe(1);
  });

it("should return exact difference with all units for multi-year span", () => {
  const earlierTimestamp = new Date("2018-04-01T00:00:00Z");
  const laterTimestamp = new Date("2023-09-15T12:30:00Z");
  const result = getExactDifference(earlierTimestamp, laterTimestamp);
  expect(result).toBe("5 years, 5 months, 14 days, 12 hours, 30 minutes");
});

it("should return exact difference with days, hours, and minutes for short spans", () => {
  const earlierTimestamp = new Date("2023-05-01T08:00:00Z");
  const laterTimestamp = new Date("2023-05-02T09:45:00Z");
  const result = getExactDifference(earlierTimestamp, laterTimestamp);
  expect(result).toBe("0 years, 0 months, 1 day, 1 hour, 45 minutes");
});

it("should correctly handle month addition with day rollover", () => {
  const baseDate = new Date("2023-04-01T00:00:00Z");
  const monthsToAdd = 4;
  const expectedDate = new Date("2023-08-01T00:00:00Z");
  const result = addMonths(baseDate, monthsToAdd);
  expect(result).toEqual(expectedDate);
});




});

