import React, { useState } from 'react';
import styled from 'styled-components';
import flatten from 'lodash/flatten';
import difference from 'lodash/difference';
import without from 'lodash/without';

import { Button, Form, Radio, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { FormItem, FormLabel, Row, StyledInput } from 'components/common';
import useEventCallback from 'hooks/useEventCallback';
import useFetch from 'hooks/useFetch';
import useToastPushSubmit from 'hooks/useToastPushSubmit';
import { HttpErrorCodes, RoundTypes } from 'utils/enums';
import { HttpResponseError } from 'utils/interfaces';
import { MessageResponse, Player } from 'utils/apiResponseShapes';
import { PlayerButton } from './parts';
import { useTournamentPlayerContext } from '../TournamentPlayerContext';
import { useTournamentRoundContext } from '../TournamentRoundContext';
import { useTournamentInfoContext } from '../TournamentInfoContext';

const PlayerWrapper = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const PlayerRow = styled(Row)`
  margin-top: 15px;
`;

const ByeButton = styled(Button).attrs({ danger: true })`
  &[disabled],
  &[disabled]:hover,
  &[disabled]:focus,
  &[disabled]:active {
    background-color: white;
    border-color: #ff4d4f;
    color: #ff4d4f;
  }
`;

const SubmitButton = styled(Button).attrs({ type: 'primary' })`
  margin-bottom: 10px;
`;

function NewRoundSubpanel() {
  const [name, setName] = useState('');
  const [type, setType] = useState(RoundTypes.Automatic);
  const [pairedPlayers, setPairedPlayers] = useState<[Player, Player][]>([]);
  const [byePlayers, setByePlayers] = useState<Player[]>([]);
  const [currentSelected, setCurrentSelected] = useState(null);

  const { players } = useTournamentPlayerContext();
  const { tournament } = useTournamentInfoContext();

  const resetState = () => {
    setName('');
    setType(RoundTypes.Automatic);
    setPairedPlayers([]);
    setByePlayers([]);
    setCurrentSelected(null);
  };

  const handleSelectPlayer = useEventCallback((player: Player) => {
    if (currentSelected === player) {
      setCurrentSelected(null);
      return;
    }

    if (currentSelected === null) {
      setCurrentSelected(player);
    } else {
      setPairedPlayers(curr => [...curr, [currentSelected, player]]);
      setCurrentSelected(null);
    }
  });

  const handleSelectBye = useEventCallback(() => {
    if (currentSelected !== null) {
      setByePlayers(curr => [...curr, currentSelected]);
      setCurrentSelected(null);
    }
  });

  const { request, isLoading } = useFetch<MessageResponse>();
  const { refresh } = useTournamentRoundContext();
  const { pushError, pushSuccess } = useToastPushSubmit();
  const handleResponse = useEventCallback(
    (response: MessageResponse | '', error: HttpResponseError) => {
      if (response === '') {
        pushError(error.code);
      } else {
        pushSuccess('Round Created');
        resetState();
        refresh();
      }
    }
  );

  const handleSubmit = useEventCallback(async () => {
    if (type === RoundTypes.Automatic) {
      const {
        response,
        error,
      } = await request(
        `/api/tournaments/${tournament.id}/rounds/create_automatic`,
        'POST',
        { name }
      );
      handleResponse(response, error);
    } else if (type === RoundTypes.ManualNormal) {
      const { response, error } = await request(
        `/api/tournaments/${tournament.id}/rounds/create_manual_normal/`,
        'POST',
        {
          name,
          matchData: pairedPlayers.map(pair => pair.map(player => player.id)),
          byeMatchData: byePlayers.map(player => player.id),
        }
      );
      handleResponse(response, error);
    } else if (type === RoundTypes.ManualSpecial) {
      const { response, error } = await request(
        `/api/tournaments/${tournament.id}/rounds/create_manual_special/`,
        'POST',
        {
          name,
          matchData: pairedPlayers.map(pair => pair.map(player => player.id)),
          byeMatchData: byePlayers.map(player => player.id),
        }
      );
      handleResponse(response, error);
    } else {
      pushError(HttpErrorCodes.UnknownError);
    }
  });

  return (
    <Form>
      <FormItem label={<FormLabel>Round Name</FormLabel>}>
        <StyledInput
          placeholder="Round Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </FormItem>
      <FormItem label={<FormLabel>Pairing Type</FormLabel>}>
        <Radio.Group
          onChange={e => {
            setType(e.target.value);
            setCurrentSelected(null);
          }}
          value={type}
        >
          <Radio value={RoundTypes.Automatic}>
            <Tooltip title="Automatic pairing based on tournament's type">
              Automatic
            </Tooltip>
          </Radio>
          <Radio value={RoundTypes.ManualNormal}>
            <Tooltip title="Manual pairing for common rounds, results will be included for the next automatic pairing">
              Manual
            </Tooltip>
          </Radio>
          <Radio value={RoundTypes.ManualSpecial}>
            <Tooltip title="Manual pairing for special rounds (e.g. Final), results will not be included for the next automatic pairing">
              Special
            </Tooltip>
          </Radio>
        </Radio.Group>
      </FormItem>
      {(type === RoundTypes.ManualNormal ||
        type === RoundTypes.ManualSpecial) && (
        <>
          <FormItem label={<FormLabel>Pairings</FormLabel>}>
            Click two players to pair them. Left player will be black.
          </FormItem>
          {pairedPlayers.map(pair => (
            <PlayerRow key={pair[0].id}>
              <div>
                {pair.map(player => (
                  <PlayerButton disabled={true} player={player} />
                ))}
              </div>
              <div>
                <Button
                  danger
                  type="text"
                  onClick={() => setPairedPlayers(curr => without(curr, pair))}
                >
                  <DeleteOutlined />
                </Button>
              </div>
            </PlayerRow>
          ))}
          {byePlayers.map(player => (
            <PlayerRow>
              <div>
                <PlayerButton disabled={true} player={player} />
                <ByeButton danger disabled={true}>
                  BYE
                </ByeButton>
              </div>
              <div>
                <Button
                  danger
                  type="text"
                  onClick={() => setByePlayers(curr => without(curr, player))}
                >
                  <DeleteOutlined />
                </Button>
              </div>
            </PlayerRow>
          ))}
          {difference(players, [...flatten(pairedPlayers), ...byePlayers]).map(
            player => (
              <PlayerWrapper key={player.id}>
                <PlayerButton
                  onClick={() => handleSelectPlayer(player)}
                  type={player === currentSelected ? 'primary' : 'default'}
                  player={player}
                />
              </PlayerWrapper>
            )
          )}
          <PlayerWrapper>
            <ByeButton type="primary" onClick={() => handleSelectBye()}>
              BYE
            </ByeButton>
          </PlayerWrapper>
        </>
      )}
      <SubmitButton loading={isLoading} onClick={handleSubmit}>
        Create New Round
      </SubmitButton>
    </Form>
  );
}

export default NewRoundSubpanel;
