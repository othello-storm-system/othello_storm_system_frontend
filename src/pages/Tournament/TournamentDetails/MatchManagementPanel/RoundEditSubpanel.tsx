import React from 'react';
import styled from 'styled-components';

import { Form } from 'antd';

import useGet from 'hooks/useGet';
import useFetch from 'hooks/useFetch';
import useEventCallback from 'hooks/useEventCallback';
import useToastPushSubmit from 'hooks/useToastPushSubmit';
import { Row, FormItem, FormLabel, FormText } from 'components/common';
import {
  MessageResponse,
  RoundDetailsResponse,
  RoundMatchesResponse,
} from 'utils/apiResponseShapes';
import { RoundTypeDisplays } from './displays';
import { useTournamentInfoContext } from '../TournamentInfoContext';
import { DeleteRoundButton, MatchEditDisplay } from './parts';

interface RoundEditSubpanelProps {
  roundId: number;
  refreshRounds: () => void;
}

const StyledRow = styled(Row)`
  flex-wrap: wrap;
`;

const Column = styled.div`
  margin-top: 10px;
  min-width: 300px;
  flex-grow: 1;
`;

function RoundEditSubpanel({ roundId, refreshRounds }: RoundEditSubpanelProps) {
  const { tournament } = useTournamentInfoContext();
  const {
    data: roundData,
    refresh: refreshRoundData,
  } = useGet<RoundDetailsResponse>(
    `/api/tournaments/${tournament.id}/rounds/${roundId}/`
  );
  const {
    data: matchesData,
    refresh: refreshMatchesData,
  } = useGet<RoundMatchesResponse>(
    `/api/tournaments/${tournament.id}/rounds/${roundId}/matches/`
  );
  const { request } = useFetch<MessageResponse>();
  const { pushError, pushSuccess } = useToastPushSubmit();

  const handleNameChange = useEventCallback(async (updatedName: string) => {
    const {
      response,
      error,
    } = await request(
      `/api/tournaments/${tournament.id}/rounds/${roundId}/`,
      'PATCH',
      { updatedName }
    );

    if (response === '') {
      pushError(error.code);
    } else {
      refreshRounds();
      refreshRoundData();
    }
  });

  return (
    roundData &&
    matchesData && (
      <StyledRow>
        <Column>
          <DeleteRoundButton
            onSuccess={refreshRounds}
            round={roundData.round}
          />
          <Form>
            <FormItem label={<FormLabel>Round Name</FormLabel>}>
              <FormText editable={{ onChange: handleNameChange }}>
                {roundData.round.name}
              </FormText>
            </FormItem>
            <FormItem label={<FormLabel>Round Type</FormLabel>}>
              <FormText>{RoundTypeDisplays[roundData.round.type]}</FormText>
            </FormItem>
          </Form>
          {matchesData.matches.map(match => (
            <MatchEditDisplay
              match={match}
              key={match.id}
              onUpdate={refreshMatchesData}
              round={roundData.round}
            />
          ))}
        </Column>
        <Column>This is second column</Column>
      </StyledRow>
    )
  );
}

export default RoundEditSubpanel;
