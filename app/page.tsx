"use client";

import { useEffect, useState, useCallback } from "react";
import type { Lead } from "@/types/lead";

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch");
      const data: Lead[] = await res.json();
      setLeads(data);
    } catch {
      setError("リードの取得に失敗しました");
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!res.ok) throw new Error("Failed to create");

      setName("");
      await fetchLeads();
    } catch {
      setError("リードの追加に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h1>CRM Leads</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="顧客名を入力"
          disabled={loading}
          style={{ padding: 8, marginRight: 8, width: 300 }}
        />
        <button type="submit" disabled={loading || !name.trim()} style={{ padding: 8 }}>
          {loading ? "追加中..." : "追加"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>ID</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>顧客名</th>
            <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: 8 }}>作成日時</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{lead.id}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>{lead.name}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                {new Date(lead.created_at).toLocaleString("ja-JP")}
              </td>
            </tr>
          ))}
          {leads.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: 8, textAlign: "center" }}>
                データがありません
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
