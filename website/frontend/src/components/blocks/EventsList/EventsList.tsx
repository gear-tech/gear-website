import React, { useEffect, useState } from 'react';
import { Event } from '@polkadot/types/interfaces';
import { useApi } from 'hooks/useApi';
import { EventItem } from './children/EventItem/EventItem';
import { Filters } from './children/Filters/Filters';
import { FilterValues } from 'types/events-list';
import { LOCAL_STORAGE } from 'consts';
import * as init from './init';
import styles from './EventsList.module.scss';

const EventsList = () => {
  const [api] = useApi();
  const [events, setEvents] = useState<Event[]>([]);

  const localFilterValues = localStorage.getItem(LOCAL_STORAGE.EVENT_FILTERS);
  const initFilters = localFilterValues ? JSON.parse(localFilterValues) : init.filterValues;
  // TODO: init.filterValues to have it's own type?
  const [filterValues, setFilterValues] = useState<FilterValues>(initFilters);

  useEffect(() => {
    if (api) {
      api.allEvents((allEvents) => {
        // TODO: .map().filter() to single .reduce()
        const newEvents = allEvents
          .map(({ event }) => event)
          .filter((event) => event.section !== 'system')
          .reverse();

        setEvents((prevEvents) => [...newEvents, ...prevEvents]);
      });
    }
  }, [api]);

  const getEvents = () => events.map((event, index) => <EventItem key={index} value={event} />);

  return (
    <div className="block-list">
      <header className={styles.header}>
        <h3 className="block-list__header">Recent events: {events.length}</h3>
        <Filters values={filterValues} setValues={setFilterValues} />
      </header>
      <ul className="programs-list">{getEvents()}</ul>
    </div>
  );
};

export { EventsList };
