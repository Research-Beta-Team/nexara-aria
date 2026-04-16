/**
 * ModeShowcase — Dev page demonstrating mode-aware component designs.
 * Access at /dev/modes to see how components adapt per command mode.
 */
import { Activity, AlertCircle, CheckCircle, FileText, Inbox, TrendingUp, Users, Zap } from 'lucide-react';
import useStore from '../../store/useStore';
import { useCommandMode } from '../../hooks/useCommandModeDesign';
import {
  ModePageShell,
  ModeSection,
  ModeCard,
  ModeButton,
  ModeBadge,
  ModeInput,
  ModeStatusDot,
  ModeMetric,
  ModeListItem,
  ModeProgress,
  ModeEmptyState,
  ModeAlert,
  ModeTable,
} from '../../components/mode';
import CommandModeToggle from '../../components/ui/CommandModeToggle';
import { C } from '../../tokens';

export default function ModeShowcase() {
  const { mode, design } = useCommandMode();

  const sampleData = [
    { id: 1, name: 'Campaign Alpha', status: 'active', leads: 142, conversion: '3.2%' },
    { id: 2, name: 'Campaign Beta', status: 'pending', leads: 89, conversion: '2.8%' },
    { id: 3, name: 'Campaign Gamma', status: 'success', leads: 234, conversion: '4.1%' },
  ];

  const columns = [
    { key: 'name', label: 'Campaign', width: '40%' },
    { key: 'status', label: 'Status', render: (val) => <ModeBadge color={val === 'active' ? 'info' : val === 'success' ? 'success' : 'warning'} dot>{val}</ModeBadge> },
    { key: 'leads', label: 'Leads' },
    { key: 'conversion', label: 'Conv. Rate' },
  ];

  return (
    <ModePageShell
      title="Mode Design System"
      subtitle={`Currently viewing: ${design.label} — Components adapt their appearance based on the selected command mode.`}
      actions={<CommandModeToggle />}
    >
      <ModeAlert
        variant="info"
        icon={<Zap size={16} />}
        title="Design System Demo"
      >
        Switch between Manual, Semi-Auto, and Agentic modes using the toggle above to see how components adapt.
      </ModeAlert>

      {/* Metrics Row */}
      <ModeSection title="Metrics">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: design.spacing.itemGap }}>
          <ModeMetric
            label="Total Leads"
            value="2,847"
            icon={<Users size={16} />}
            change={{ value: '+12%', positive: true }}
            trend="up"
          />
          <ModeMetric
            label="Conversion"
            value="3.4%"
            icon={<TrendingUp size={16} />}
            change={{ value: '+0.3%', positive: true }}
            trend="up"
          />
          <ModeMetric
            label="Active Campaigns"
            value="8"
            icon={<Activity size={16} />}
          />
          <ModeMetric
            label="Pending Review"
            value="3"
            icon={<FileText size={16} />}
            color={C.amber}
          />
        </div>
      </ModeSection>

      {/* Cards */}
      <ModeSection title="Cards">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: design.spacing.itemGap }}>
          <ModeCard
            title="Standard Card"
            subtitle="Basic card component"
            icon={<FileText size={14} />}
          >
            <p style={{ margin: 0, color: C.textSecondary, fontSize: '13px', lineHeight: 1.5 }}>
              Cards adapt their background, border, radius, and shadow based on the current mode.
            </p>
          </ModeCard>

          <ModeCard
            title="Accented Card"
            subtitle="With accent color"
            icon={<CheckCircle size={14} />}
            accent={C.green}
          >
            <ModeProgress value={75} label="Progress" animated />
          </ModeCard>

          <ModeCard
            title="Interactive Card"
            subtitle="Click to interact"
            icon={<Zap size={14} />}
            onClick={() => alert('Card clicked!')}
          >
            <ModeButton variant="primary" size="sm">
              Take Action
            </ModeButton>
          </ModeCard>
        </div>
      </ModeSection>

      {/* Buttons */}
      <ModeSection title="Buttons">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: design.spacing.itemGap, alignItems: 'center' }}>
          <ModeButton variant="primary">Primary</ModeButton>
          <ModeButton variant="secondary">Secondary</ModeButton>
          <ModeButton variant="ghost">Ghost</ModeButton>
          <ModeButton variant="danger">Danger</ModeButton>
          <ModeButton variant="primary" icon={<Zap size={14} />}>With Icon</ModeButton>
          <ModeButton variant="secondary" loading>Loading</ModeButton>
          <ModeButton variant="secondary" disabled>Disabled</ModeButton>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: design.spacing.itemGap, alignItems: 'center', marginTop: design.spacing.itemGap }}>
          <ModeButton variant="primary" size="sm">Small</ModeButton>
          <ModeButton variant="primary" size="md">Medium</ModeButton>
          <ModeButton variant="primary" size="lg">Large</ModeButton>
        </div>
      </ModeSection>

      {/* Badges */}
      <ModeSection title="Badges & Status">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: design.spacing.itemGap, alignItems: 'center' }}>
          <ModeBadge>Default</ModeBadge>
          <ModeBadge color="success" dot>Success</ModeBadge>
          <ModeBadge color="warning" dot>Warning</ModeBadge>
          <ModeBadge color="error" dot>Error</ModeBadge>
          <ModeBadge color="info">Info</ModeBadge>
          <ModeBadge color="purple">Custom</ModeBadge>
          <ModeBadge color="success" dot pulse>Pulsing</ModeBadge>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: design.spacing.sectionGap, alignItems: 'center', marginTop: design.spacing.itemGap }}>
          <ModeStatusDot status="active" label="Active" />
          <ModeStatusDot status="pending" label="Pending" />
          <ModeStatusDot status="success" label="Complete" />
          <ModeStatusDot status="error" label="Error" />
          <ModeStatusDot status="idle" label="Idle" />
        </div>
      </ModeSection>

      {/* Inputs */}
      <ModeSection title="Form Inputs">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: design.spacing.itemGap }}>
          <ModeInput
            label="Standard Input"
            placeholder="Enter value..."
          />
          <ModeInput
            label="With Icon"
            placeholder="Search..."
            icon={<Inbox size={14} />}
          />
          <ModeInput
            label="Required Field"
            placeholder="Required"
            required
            hint="This field is required"
          />
          <ModeInput
            label="Error State"
            placeholder="Invalid"
            error="This field has an error"
          />
        </div>
      </ModeSection>

      {/* Progress */}
      <ModeSection title="Progress Indicators">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: design.spacing.sectionGap }}>
          <ModeProgress value={25} label="Quarter Complete" size="sm" />
          <ModeProgress value={50} label="Half Complete" />
          <ModeProgress value={75} label="Almost Done" size="lg" animated />
          <ModeProgress value={100} label="Complete" color={C.green} />
        </div>
      </ModeSection>

      {/* List Items */}
      <ModeSection title="List Items">
        <ModeCard noPadding>
          <ModeListItem
            icon={<FileText size={16} />}
            title="Draft Campaign Brief"
            subtitle="Created 2 hours ago"
            meta="2.4 KB"
            status={<ModeStatusDot status="pending" />}
          />
          <ModeListItem
            icon={<CheckCircle size={16} />}
            title="Approved Content Pack"
            subtitle="Ready for launch"
            meta="Yesterday"
            status={<ModeStatusDot status="success" />}
            selected
          />
          <ModeListItem
            icon={<AlertCircle size={16} />}
            title="Flagged for Review"
            subtitle="Requires attention"
            meta="3 days ago"
            status={<ModeStatusDot status="warning" />}
          />
        </ModeCard>
      </ModeSection>

      {/* Table */}
      <ModeSection title="Data Table">
        <ModeCard noPadding>
          <ModeTable
            columns={columns}
            data={sampleData}
            onRowClick={(row) => alert(`Clicked: ${row.name}`)}
          />
        </ModeCard>
      </ModeSection>

      {/* Alerts */}
      <ModeSection title="Alerts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: design.spacing.itemGap }}>
          <ModeAlert variant="info" icon={<Zap size={16} />} title="Information">
            This is an informational alert message.
          </ModeAlert>
          <ModeAlert variant="success" icon={<CheckCircle size={16} />} title="Success">
            Operation completed successfully.
          </ModeAlert>
          <ModeAlert variant="warning" icon={<AlertCircle size={16} />} title="Warning" onDismiss={() => {}}>
            Please review before proceeding.
          </ModeAlert>
          <ModeAlert variant="error" icon={<AlertCircle size={16} />} title="Error">
            Something went wrong.
          </ModeAlert>
        </div>
      </ModeSection>

      {/* Empty State */}
      <ModeSection title="Empty State">
        <ModeCard>
          <ModeEmptyState
            icon={<Inbox size={24} />}
            title="No items yet"
            description="Get started by creating your first campaign or importing existing data."
            actionLabel="Create Campaign"
            onAction={() => alert('Create clicked')}
          />
        </ModeCard>
      </ModeSection>
    </ModePageShell>
  );
}
