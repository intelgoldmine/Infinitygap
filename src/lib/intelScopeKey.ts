/** Composite key for intel_snapshots — must match industry-intel + auto-intel. */
export function buildIntelSnapshotScopeKey(baseScopeKey: string, geoScopeId: string): string {
  return `${baseScopeKey}::${geoScopeId}`;
}
