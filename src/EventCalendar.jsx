// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const EventCalendar = ({ eventsData }) => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);
  const currentDayIndex = moment().isoWeekday() - 1;

  const currentDayEvents = useMemo(
    () => eventsData[currentDayIndex] || [],
    [eventsData, currentDayIndex]
  );

  useEffect(() => {
    const currentTime = moment().format('HH:mm');

    let matchingEvent = null;
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

EventCalendar.propTypes = {
  eventsData: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        uf: PropTypes.string.isRequired,
        teacher: PropTypes.string.isRequired,
        room: PropTypes.string.isRequired,
      })
    )
  ).isRequired,
};

export default EventCalendar;
