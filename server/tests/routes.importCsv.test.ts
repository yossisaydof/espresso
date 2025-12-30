import express from "express";
import request from "supertest";
import issuesRoutes from "../src/routes/issuesRoutes";
import * as service from "../src/services/issuesService";

jest.mock("../src/services/issuesService");

const mockService = service as jest.Mocked<typeof service>;

describe("/api/issues/import-csv (multipart)", () => {
  beforeEach(() => jest.resetAllMocks());

  function makeApp() {
    const app = express();
    // index.ts also uses express.json(), not needed here for multipart
    app.use("/api/issues", issuesRoutes);
    // simple error handler same as in index.ts
    app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      res.status(500).json({ error: err.message });
    });
    return app;
  }

  test("returns 200 and delegates to service when file is provided", async () => {
    mockService.importIssuesFromCsvBuffer.mockResolvedValueOnce([
      { id: 1, title: "A" },
    ] as any);

    const csv = Buffer.from("title,description,site,severity,status\nA,desc,S,minor,open\n");
    const app = makeApp();

    const res = await request(app)
      .post("/api/issues/import-csv")
      .attach("file", csv, { filename: "test.csv", contentType: "text/csv" });

    expect(res.status).toBe(200);
    expect(mockService.importIssuesFromCsvBuffer).toHaveBeenCalledTimes(1);
    expect(res.body).toEqual([{ id: 1, title: "A" }]);
  });

  test("returns 400 when file is missing", async () => {
    const app = makeApp();
    const res = await request(app).post("/api/issues/import-csv");
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
