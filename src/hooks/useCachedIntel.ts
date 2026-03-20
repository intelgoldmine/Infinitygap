import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { buildIntelSnapshotScopeKey } from "@/lib/intelScopeKey";

interface CachedReport {
  summary: string | null;
  analysis: string | null;
  gaps: any[];
  alerts: any[];
  connections: any[];
  news: any[];
  live_data: any;
  created_at: string;
}

export function useCachedIntel(scopeType: "industry" | "subflow", scopeKey: string, geoScopeId: string) {
  const [report, setReport] = useState<CachedReport | null>(null);
  const [history, setHistory] = useState<CachedReport[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    if (!scopeKey) return;
    setLoading(true);
    setReport(null);
    setHistory([]);
    try {
      const compositeKey = buildIntelSnapshotScopeKey(scopeKey, geoScopeId || "global");

      const loadLatest = async (key: string) => {
        return supabase
          .from("intel_snapshots")
          .select("*")
          .eq("scope_type", scopeType)
          .eq("scope_key", key)
          .order("created_at", { ascending: false })
          .limit(1);
      };

      let { data: latest } = await loadLatest(compositeKey);

      // Legacy rows (no ::geo suffix) only when viewing global
      if ((!latest?.length) && (geoScopeId === "global" || !geoScopeId)) {
        const legacy = await loadLatest(scopeKey);
        latest = legacy.data;
      }

      if (latest?.[0]) {
        setReport({
          summary: latest[0].summary,
          analysis: latest[0].analysis,
          gaps: (latest[0].gaps as any[]) || [],
          alerts: (latest[0].alerts as any[]) || [],
          connections: (latest[0].connections as any[]) || [],
          news: (latest[0].news as any[]) || [],
          live_data: latest[0].live_data || {},
          created_at: latest[0].created_at,
        });
      } else {
        setReport(null);
      }

      const { data: hist } = await supabase
        .from("intel_snapshots")
        .select("*")
        .eq("scope_type", scopeType)
        .eq("scope_key", compositeKey)
        .order("created_at", { ascending: false })
        .limit(10);

      let rows = hist;
      if ((!rows?.length) && (geoScopeId === "global" || !geoScopeId)) {
        const { data: leg } = await supabase
          .from("intel_snapshots")
          .select("*")
          .eq("scope_type", scopeType)
          .eq("scope_key", scopeKey)
          .order("created_at", { ascending: false })
          .limit(10);
        rows = leg;
      }

      if (rows) {
        setHistory(rows.map(h => ({
          summary: h.summary,
          analysis: h.analysis,
          gaps: (h.gaps as any[]) || [],
          alerts: (h.alerts as any[]) || [],
          connections: (h.connections as any[]) || [],
          news: (h.news as any[]) || [],
          live_data: h.live_data || {},
          created_at: h.created_at,
        })));
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.error("Cached intel fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [scopeType, scopeKey, geoScopeId]);

  useEffect(() => {
    fetchReport();
    // Refresh every 5 minutes to pick up new auto-generated reports
    const id = setInterval(fetchReport, 300_000);
    return () => clearInterval(id);
  }, [fetchReport]);

  return { report, history, loading, refresh: fetchReport };
}
