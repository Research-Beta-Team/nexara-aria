// ─────────────────────────────────────────────
//  Antarious — Workspace Preview (admin "view as client")
//  Sets store to view as the given client and redirects to dashboard.
//  Banner and Exit are handled in AppLayout.
// ─────────────────────────────────────────────

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';
import { getProfileByClientId } from '../../data/clientWorkspaceProfiles';

export default function WorkspacePreview() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const setPreviewAsClient = useStore((s) => s.setPreviewAsClient);

  useEffect(() => {
    const profile = getProfileByClientId(clientId);
    if (profile) {
      setPreviewAsClient(clientId);
      navigate('/', { replace: true });
    } else {
      navigate('/admin/clients', { replace: true });
    }
  }, [clientId, setPreviewAsClient, navigate]);

  return null;
}
