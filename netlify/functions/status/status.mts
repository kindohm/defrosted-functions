import { Context } from "@netlify/functions";

const getDefrostedStatus = (now: Date) => {
  const year = now.getFullYear();

  // black friday calculations
  const nov1 = new Date(year, 10, 1);
  const firstThursday =
    nov1.getDay() === 4 ? 1 : ((11 - nov1.getDay()) % 7) + 1;
  const thanksgivingDay = firstThursday + 21; //fourth thursday
  const thanksgiving = new Date(year, 10, thanksgivingDay);
  const newYears = new Date(year + 1, 0, 1);
  const curNewYears = new Date(year, 0, 1);

  const status =
    now >= curNewYears && now < nov1
      ? "frozen"
      : now >= nov1 && now <= thanksgiving
      ? "defrosted"
      : now > thanksgiving && now < newYears
      ? "hot"
      : "unknown";

  return status;
};

export default (request: Request, context: Context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const url = new URL(request.url);
    const testDate = url.searchParams.get("testDate") ?? "";
    const ms = Date.parse(testDate);
    const now = Number.isNaN(ms) ? new Date() : new Date(ms);

    const status = getDefrostedStatus(now);
    return Response.json({ status }, { headers });
  } catch (error) {
    // @ts-expect-error its ok
    return new Response(error.toString(), {
      status: 500,
    });
  }
};
