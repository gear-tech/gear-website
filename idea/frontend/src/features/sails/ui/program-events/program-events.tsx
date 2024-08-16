import { HexString } from '@gear-js/api';
import { useEffect, useMemo, useState } from 'react';
import { Sails } from 'sails-js';

import { FilterGroup, Filters, Radio } from '@/features/filters';
import { List, ProgramTabLayout, SearchForm, Skeleton } from '@/shared/ui';
import CardPlaceholderSVG from '@/shared/assets/images/placeholders/card.svg?react';

import { useEvents, EventType } from '../../api';
import { getEventMethod } from '../../utils';
import { EventCard } from '../event-card';

type Props = {
  programId: HexString;
  sails: Sails | undefined;
};

const FILTER_NAME = {
  METHOD: 'method',
} as const;

const DEFAULT_FILTER_VALUES = {
  [FILTER_NAME.METHOD]: '',
};

function ProgramEvents({ programId, sails }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const [filterValues, setFilterValues] = useState(DEFAULT_FILTER_VALUES);
  const filterParams = useMemo(() => {
    const [service, name] = filterValues[FILTER_NAME.METHOD].split('.');

    return { service, name };
  }, [filterValues]);

  const events = useEvents({ source: programId, ...filterParams });
  const [methods, setMethods] = useState<string[]>();

  useEffect(() => {
    if (!events.data || methods) return;

    const result = events.data.result.map(getEventMethod).filter(Boolean) as string[];
    const unqiueMethods = Array.from(new Set(result));

    setMethods(unqiueMethods);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const renderEvent = (event: EventType) => <EventCard event={event} sails={sails} />;
  const renderEventSkeleton = () => <Skeleton SVG={CardPlaceholderSVG} disabled />;

  const renderList = () => (
    <List
      items={events.data?.result}
      hasMore={events.hasNextPage}
      isLoading={events.isLoading}
      noItems={{ heading: 'There are no events yet.' }}
      size="small"
      fetchMore={events.fetchNextPage}
      renderItem={renderEvent}
      renderSkeleton={renderEventSkeleton}
    />
  );

  const renderSearch = () => <SearchForm placeholder="Search by name..." onSubmit={setSearchQuery} />;

  const renderFilters = () =>
    methods?.length ? (
      <Filters initialValues={filterValues} onSubmit={setFilterValues}>
        <FilterGroup name={FILTER_NAME.METHOD} onSubmit={setFilterValues}>
          <Radio label="All" name={FILTER_NAME.METHOD} value="" onSubmit={setFilterValues} />

          {methods.map((method) => (
            <Radio key={method} name={FILTER_NAME.METHOD} value={method} label={method} onSubmit={setFilterValues} />
          ))}
        </FilterGroup>
      </Filters>
    ) : null;

  return (
    <ProgramTabLayout
      heading="Events"
      count={events.data?.count}
      renderList={renderList}
      renderSearch={renderSearch}
      renderFilters={renderFilters}
    />
  );
}

export { ProgramEvents };
