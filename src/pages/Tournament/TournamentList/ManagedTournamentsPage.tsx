import React from 'react';

import { useProgressiveContext } from 'components/ProgressiveContext';
import useGet from 'hooks/useGet';
import { TournamentsResponse } from 'utils/apiResponseShapes';
import { ScreenTypes } from 'utils/enums';
import {
  DesktopTournamentListTable,
  MobileTournamentListTable,
  TournamentListPageTitle,
} from './parts';

function ManagedTournamentPage() {
  const { data, refresh } = useGet<TournamentsResponse>(
    '/api/tournaments/managed_by_me/'
  );
  const { screenType } = useProgressiveContext();
  return (
    <>
      <TournamentListPageTitle
        title="Tournaments Managed by Me"
        onCreateNewTournament={refresh}
      />
      {data &&
        (screenType === ScreenTypes.Desktop ? (
          <DesktopTournamentListTable tournaments={data.tournaments} />
        ) : (
          <MobileTournamentListTable tournaments={data.tournaments} />
        ))}
    </>
  );
}

export default ManagedTournamentPage;
