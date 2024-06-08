import { getHumanFriendlyDifference, calculateMonthDifference, calculateWeeksDifference } from "../lib/utils";

describe("getHumanFriendlyDifference", () => {
  it("should return correct difference for months and days", () => {
    const latestTimestamp = new Date("2023-10-03T00:00:00Z");
    const earliestTimestamp = new Date("2023-09-01T00:00:00Z"); // 1 month and 2 days ago
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("1 month and 2 days");
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
    expect(result).toBe("2 months and 3 weeks");
  });

  it("should return correct difference for weeks and days", () => {
    const latestTimestamp = new Date("2023-09-17T00:00:00Z");
    const earliestTimestamp = new Date("2023-09-01T00:00:00Z"); // 2 weeks and 2 days ago
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("2 weeks and 2 days");
  });

  it("should return correct difference for days and hours", () => {
    const latestTimestamp = new Date("2023-10-01T00:00:00Z");
    const earliestTimestamp = new Date("2023-09-28T21:00:00Z"); // 2 days and 3 hours ago
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("2 days and 3 hours");
  });

  it("should return correct difference for hours and minutes", () => {
    const latestTimestamp = new Date("2023-10-01T00:00:00Z");
    const earliestTimestamp = new Date("2023-09-30T21:57:00Z"); // 2 hours and 3 minutes ago
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("2 hours and 3 minutes");
  });

  it("should return correct difference for minutes", () => {
    const latestTimestamp = new Date("2023-10-01T00:00:00Z");
    const earliestTimestamp = new Date("2023-09-30T23:58:00Z"); // 2 minutes ago
    const result = getHumanFriendlyDifference(earliestTimestamp, latestTimestamp);
    expect(result).toBe("2 minutes");
  });
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


it("should return correct week difference for same month", () => {
  const earliestTimestamp = new Date("2023-09-01T00:00:00Z");
  const latestTimestamp = new Date("2023-09-15T00:00:00Z"); // 2 weeks
  const result = calculateWeeksDifference(earliestTimestamp, latestTimestamp);
  expect(result).toBe(2);
});

it("should return correct week difference for different months", () => {
  const earliestTimestamp = new Date("2023-08-15T00:00:00Z");
  const latestTimestamp = new Date("2023-09-15T00:00:00Z"); // 0 weeks
  const result = calculateWeeksDifference(earliestTimestamp, latestTimestamp);
  expect(result).toBe(0);
});

it("should return correct week difference for different years", () => {
  const earliestTimestamp = new Date("2022-12-01T00:00:00Z");
  const latestTimestamp = new Date("2023-01-15T00:00:00Z"); // 6 weeks
  const result = calculateWeeksDifference(earliestTimestamp, latestTimestamp);
  expect(result).toBe(6);
});

it("should return correct week difference when days are not exact multiples of weeks", () => {
  const earliestTimestamp = new Date("2023-09-01T00:00:00Z");
  const latestTimestamp = new Date("2023-09-20T00:00:00Z"); // 2 weeks and 5 days
  const result = calculateWeeksDifference(earliestTimestamp, latestTimestamp);
  expect(result).toBe(2);
});

