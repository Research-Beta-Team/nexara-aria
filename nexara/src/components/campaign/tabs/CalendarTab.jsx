import { CALENDAR_EVENTS } from '../../../data/calendar';
import SharedCalendar from '../../calendar/SharedCalendar';

/**
 * Campaign-scoped calendar tab: shows events for the current campaign context.
 * Uses shared calendar UI; events come from campaign/calendar data.
 */
export default function CalendarTab() {
  return <SharedCalendar events={CALENDAR_EVENTS} />;
}
