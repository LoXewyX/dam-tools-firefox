import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';

interface Event {
  from: string;
  to: string;
  uf: string;
  teacher: string;
  room: string;
}

interface EventCalendarProps {
  eventsData: Event[][];
}

const EventCalendar: React.FC<EventCalendarProps> = ({ eventsData }) => {
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const currentDayIndex = moment().isoWeekday() - 1;

  const currentDayEvents = useMemo(
    () => eventsData[currentDayIndex] || [],
    [eventsData, currentDayIndex]
  );

  useEffect(() => {
    const currentTime = moment().format('HH:mm');

    let matchingEvent: Event | null = null;
    let nextEventIndex = -1;

    currentDayEvents.forEach((event, index) => {
      const eventStartTime = moment(event.from, 'HH:mm');
      const eventEndTime = moment(event.to, 'HH:mm');
      if (
        moment(currentTime, 'HH:mm').isSameOrAfter(eventStartTime) &&
        moment(currentTime, 'HH:mm').isBefore(eventEndTime)
      ) {
        matchingEvent = event;
        nextEventIndex = index + 1;
      }
    });

    if (matchingEvent) {
      setCurrentEvent(matchingEvent);

      if (nextEventIndex < currentDayEvents.length) {
        setNextEvent(currentDayEvents[nextEventIndex]);
      } else {
        setNextEvent(null);
      }
    }
  }, [currentDayEvents]);

  return (
    <div className="event-calendar">
      {currentEvent ? (
        <div className="current-card">
          <div className="card">
            <div className="card-header">Ara</div>
            <div className="card-body">
              <div className="card-title">
                {currentEvent.uf} ({currentEvent.from} - {currentEvent.to})
              </div>
              <div className="card-text">{currentEvent.teacher}</div>
              <div className="card-text">{currentEvent.room}</div>
            </div>
          </div>
        </div>
      ) : (
        <p>No hi ha classe per ara.</p>
      )}

      {nextEvent && (
        <div className="next-card mt-3">
          <div className="card">
            <div className="card-header">Següent hora</div>
            <div className="card-body">
              <div className="card-title">
                {nextEvent.uf} ({nextEvent.from} - {nextEvent.to})
              </div>
              <div className="card-text">{nextEvent.teacher}</div>
              <div className="card-text">{nextEvent.room}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
