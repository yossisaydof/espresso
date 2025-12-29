import express from "express";
import request from "supertest";
import * as controller from "../src/controllers/issuesController";
import * as service from "../src/services/issuesService";

jest.mock("../src/services/issuesService");

const mockService = service as jest.Mocked<typeof service>;

function jsonApp() {
  const app = express();
  app.use(express.json());
  app.get("/issues", controller.getIssues as any);
  app.get("/issues/:id", controller.getIssueById as any);
  app.post("/issues", controller.createIssue as any);
  app.put("/issues/:id", controller.updateIssue as any);
  app.delete("/issues/:id", controller.deleteIssue as any);
  app.patch("/issues/:id/resolve", controller.resolveIssue as any);
  app.get("/issues/dashboard", controller.getDashboard as any);
  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    res.status(500).json({ error: err.message });
  });
  return app;
}

describe("issuesController", () => {
  beforeEach(() => jest.resetAllMocks());

  test("GET /issues returns list", async () => {
    mockService.listIssues.mockResolvedValueOnce([{ id: 1 } as any]);
    const app = jsonApp();
    const res = await request(app).get("/issues");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1 }]);
  });

  test("GET /issues/:id 400 on bad id", async () => {
    const app = jsonApp();
    const res = await request(app).get("/issues/abc");
    expect(res.status).toBe(400);
  });

  test("GET /issues/:id 404 when not found", async () => {
    mockService.getIssue.mockResolvedValueOnce(null);
    const app = jsonApp();
    const res = await request(app).get("/issues/999");
    expect(res.status).toBe(404);
  });

  test("POST /issues 201 on valid payload", async () => {
    mockService.createIssue.mockResolvedValueOnce({ id: 5 } as any);
    const app = jsonApp();
    const res = await request(app)
      .post("/issues")
      .send({ title: "t", description: "d", site: "s", severity: "minor", status: "open" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 5 });
  });

  test("PUT /issues/:id 404 when not found", async () => {
    mockService.updateIssue.mockResolvedValueOnce(null);
    const app = jsonApp();
    const res = await request(app)
      .put("/issues/1")
      .send({ title: "x" });
    expect(res.status).toBe(404);
  });

  test("DELETE /issues/:id 204 on success", async () => {
    mockService.deleteIssue.mockResolvedValueOnce(true);
    const app = jsonApp();
    const res = await request(app).delete("/issues/1");
    expect(res.status).toBe(204);
  });

  test("PATCH /issues/:id/resolve 404 when not found", async () => {
    mockService.resolveIssue.mockResolvedValueOnce(null);
    const app = jsonApp();
    const res = await request(app).patch("/issues/1/resolve");
    expect(res.status).toBe(404);
  });

  test("GET /issues/dashboard returns summary", async () => {
    mockService.getDashboardSummary.mockResolvedValueOnce({
      statusCounts: { open: 1, in_progress: 0, resolved: 0 },
      severityCounts: { minor: 1, major: 0, critical: 0 },
    });
    const app = jsonApp();
    const res = await request(app).get("/issues/dashboard");
    expect(res.status).toBe(200);
    expect(res.body.statusCounts.open).toBe(1);
  });
});
