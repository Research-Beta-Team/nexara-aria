// ─────────────────────────────────────────────
//  Antarious — useWorkspace hook
//  Convenience hook consuming WorkspaceContext
// ─────────────────────────────────────────────

import { useWorkspaceContext } from '../context/WorkspaceContext';

export default function useWorkspace() {
  return useWorkspaceContext();
}
