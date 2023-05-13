import type { SearchFilters } from '../server/search.server';
import { Form, useSearchParams } from '@remix-run/react';
import { InputSearch } from '~/design-system/forms/InputSearch';

type Props = { filters: SearchFilters };

export function SearchEventsInput({ filters }: Props) {
  const { query, type } = filters;
  const [searchParams] = useSearchParams();
  const talkId = searchParams.get('talkId');

  return (
    <Form action="/" method="GET" className="mt-10 flex flex-1 justify-center lg:justify-center">
      {type && <input type="hidden" name="type" value={type} />}
      {talkId && <input type="hidden" name="talkId" value={talkId} />}

      <InputSearch
        name="query"
        label="Search conferences and meetups."
        placeholder="Search conferences and meetups..."
        size="l"
        defaultValue={query}
      />
    </Form>
  );
}
