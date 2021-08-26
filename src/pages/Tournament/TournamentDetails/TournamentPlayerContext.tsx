import React, { useContext, createContext, ReactNode } from 'react';
import differenceBy from 'lodash/differenceBy';
import keyBy from 'lodash/keyBy';

import useGet from 'hooks/useGet';
import {
  TournamentPlayerListResponse,
  TournamentJoueursPlayerListResponse,
  TournamentDetails,
  Player,
  JoueursPlayer,
} from 'utils/apiResponseShapes';

export interface PlayersById {
  [id: number]: Player;
}

interface TournamentPlayerContextShape {
  players: Player[];
  joueursPlayers: JoueursPlayer[];
  refresh: () => void;
  playersById: PlayersById;
}

const TournamentPlayerContext = createContext<TournamentPlayerContextShape>(
  null
);
export const useTournamentPlayerContext = () =>
  useContext(TournamentPlayerContext);

interface TournamentPlayerProviderProps {
  tournament: TournamentDetails;
  children: ReactNode;
}

function TournamentPlayerProvider({
  tournament,
  children,
}: TournamentPlayerProviderProps) {
  const {
    data: playerListData,
    refresh: refreshPlayers,
  } = useGet<TournamentPlayerListResponse>(
    `/api/tournaments/${tournament.id}/players/`
  );

  const {
    data: joueursPlayerListData,
    refresh: refreshJoueursPlayers,
  } = useGet<TournamentJoueursPlayerListResponse>(
    `/api/tournaments/${tournament.id}/joueurs_players/`
  );

  return (
    playerListData &&
    joueursPlayerListData && (
      <TournamentPlayerContext.Provider
        value={{
          players: playerListData.players,
          joueursPlayers: differenceBy(
            joueursPlayerListData.joueursPlayers,
            playerListData.players,
            player => player.joueursId
          ),
          refresh: () => {
            refreshPlayers();
            refreshJoueursPlayers();
          },
          playersById: keyBy(playerListData.players, player => player.id),
        }}
      >
        {children}
      </TournamentPlayerContext.Provider>
    )
  );
}

export default TournamentPlayerProvider;
