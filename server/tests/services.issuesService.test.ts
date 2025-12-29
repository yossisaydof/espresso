import * as db from "../src/db";
import * as service from "../src/services/issuesService";

jest.mock("../src/db");

const mockQuery = db.query as jest.Mock;

describe("issuesService", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  test("listIssues without filters returns mapped rows", async () => {
    mockQuery.mockResolvedValue({
      rows: [
        {
          id: 1,
          title: "A",
          description: "desc",
          site: "site-1",
          severity: "minor",
          status: "open",
          created_at: new Date("2024-01-01"),
          updated_at: new Date("2024-01-02"),
        },
      ],
    });

    const rows = await service.listIssues({});
    expect(rows).toEqual([
      expect.objectContaining({ id: 1, title: "A", createdAt: expect.any(Date) }),
    ]);
    const [sql] = mockQuery.mock.calls[0];
    expect(sql).toContain("FROM issues");
    expect(sql).not.toContain("WHERE");
  });

  test("listIssues with filters builds WHERE and params order", async () => {
    mockQuery.mockResolvedValue({ rows: [] });
    await service.listIssues({ search: "foo", status: "open", severity: "major" });
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toContain("WHERE");
    expect(sql).toContain("title ILIKE $1");
    expect(sql).toContain("status = $2");
    expect(sql).toContain("severity = $3");
    expect(params).toEqual(["%foo%", "open", "major"]);
  });

  test("getIssue returns null when not found", async () => {
    mockQuery.mockResolvedValue({ rows: [] });
    const res = await service.getIssue(123);
    expect(res).toBeNull();
  });

  test("createIssue inserts and returns mapped issue; createdAt defaulted on bad date", async () => {
    const now = new Date("2024-05-05T00:00:00.000Z");
    jest.useFakeTimers().setSystemTime(now);

    mockQuery.mockResolvedValue({
      rows: [
        {
          id: 2,
          title: "New",
          description: "D",
          site: "S",
          severity: "critical",
          status: "open",
          created_at: now,
          updated_at: now,
        },
      ],
    });

    const result = await service.createIssue({
      title: "New",
      description: "D",
      site: "S",
      severity: "critical",
      status: "open",
      createdAt: "not-a-date",
    });

    expect(result).toMatchObject({ id: 2, title: "New" });
    const [sql, params] = mockQuery.mock.calls[0];
    expect(sql).toContain("INSERT INTO issues");
    expect(params[5]).toEqual(now); // created_at param
    jest.useRealTimers();
  });

  test("updateIssue returns null when no rows updated", async () => {
    mockQuery.mockResolvedValue({ rows: [] });
    const res = await service.updateIssue(1, { title: "X" });
    expect(res).toBeNull();
  });

  test("deleteIssue returns true/false based on rowCount", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 0 });
    const a = await service.deleteIssue(1);
    expect(a).toBe(false);
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    const b = await service.deleteIssue(1);
    expect(b).toBe(true);
  });

  test("resolveIssue returns null when not found", async () => {
    mockQuery.mockResolvedValue({ rows: [] });
    const res = await service.resolveIssue(7);
    expect(res).toBeNull();
  });

  test("getDashboardSummary maps counts", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ status: "open", count: 5 }] })
      .mockResolvedValueOnce({ rows: [{ severity: "major", count: 2 }] });

    const summary = await service.getDashboardSummary();
    expect(summary.statusCounts).toEqual({ open: 5, in_progress: 0, resolved: 0 });
    expect(summary.severityCounts).toEqual({ minor: 0, major: 2, critical: 0 });
  });

  describe("CSV import", () => {
    test("importIssuesFromCsv throws on empty csv", async () => {
      await expect(service.importIssuesFromCsv("")).rejects.toThrow(/empty/i);
    });

    test("importIssuesFromCsv parses rows and calls createIssue", async () => {
      const spy = jest.spyOn(service, "createIssue").mockResolvedValue({
        id: 10,
        title: "T",
        description: "D",
        site: "S",
        severity: "minor",
        status: "open",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const csv = `title,description,site,severity,status,createdAt\nA,desc,site-1,MAJOR,open,2024-01-01`;
      const res = await service.importIssuesFromCsv(csv);
      expect(Array.isArray(res)).toBe(true);
      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    test("importIssuesFromCsvBuffer converts buffer to text", async () => {
      const spy = jest.spyOn(service, "importIssuesFromCsv").mockResolvedValue([]);
      await service.importIssuesFromCsvBuffer(Buffer.from("title\nA"));
      expect(spy).toHaveBeenCalledWith(expect.any(String));
      spy.mockRestore();
    });
  });
});
