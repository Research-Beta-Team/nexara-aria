import useToast from '../../hooks/useToast';
import { CP } from '../../data/clientPortal';

const fontBody = "'DM Sans', sans-serif";

export default function ClientApprovals({ approvals }) {
  const toast = useToast();
  const list = approvals || [];

  return (
    <section
      style={{
        backgroundColor: CP.surface,
        border: `1px solid ${CP.border}`,
        borderRadius: 12,
        padding: 24,
        height: '100%',
      }}
    >
      <h2 style={{ fontFamily: fontBody, fontSize: 16, fontWeight: 700, color: CP.text, margin: '0 0 16px' }}>
        Pending your approval
      </h2>
      {list.length === 0 ? (
        <p style={{ fontFamily: fontBody, fontSize: 14, color: CP.textSecondary }}>
          All caught up! No approvals needed.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {list.map((item) => (
            <div
              key={item.id}
              style={{
                padding: 16,
                backgroundColor: CP.bg,
                border: `1px solid ${CP.border}`,
                borderRadius: 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: fontBody,
                    backgroundColor: `${CP.primary}18`,
                    color: CP.primary,
                  }}
                >
                  {item.type}
                </span>
                {item.urgency === 'high' && (
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontFamily: fontBody,
                      backgroundColor: `${CP.warning}20`,
                      color: CP.warning,
                    }}
                  >
                    High priority
                  </span>
                )}
                <span style={{ fontFamily: fontBody, fontSize: 12, color: CP.textSecondary }}>
                  Created {item.createdAtDaysAgo} days ago
                </span>
              </div>
              <div style={{ fontFamily: fontBody, fontSize: 14, fontWeight: 600, color: CP.text, marginBottom: 6 }}>
                {item.title}
              </div>
              <p style={{ fontFamily: fontBody, fontSize: 13, color: CP.textSecondary, margin: '0 0 12px', lineHeight: 1.5 }}>
                {item.description}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  style={{
                    padding: '8px 16px',
                    borderRadius: 7,
                    border: 'none',
                    backgroundColor: CP.primary,
                    color: '#fff',
                    fontFamily: fontBody,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onClick={() => toast.success('Approved')}
                >
                  Approve
                </button>
                <button
                  style={{
                    padding: '8px 16px',
                    borderRadius: 7,
                    border: `1px solid ${CP.border}`,
                    backgroundColor: CP.surface,
                    color: CP.text,
                    fontFamily: fontBody,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                  onClick={() => toast.info('Request changes flow coming soon')}
                >
                  Request changes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
