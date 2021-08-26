import React, { useState } from 'react';

import { Button, Form, InputNumber, Modal } from 'antd';

import useFetch from 'hooks/useFetch';
import {
  MatchDetails,
  MessageResponse,
  RoundDetails,
} from 'utils/apiResponseShapes';
import useToastPushSubmit from 'hooks/useToastPushSubmit';
import { SpecialConditionScores } from 'utils/enums';
import useEventCallback from 'hooks/useEventCallback';
import { FormItem, FormLabel, FormText } from 'components/common';
import { ClosableComponentProps } from 'utils/interfaces';
import { PLAYER_BYE_ID } from './constants';
import { useTournamentPlayerContext } from '../TournamentPlayerContext';
import { useTournamentInfoContext } from '../TournamentInfoContext';

interface UpdateScoreDialogProps extends ClosableComponentProps {
  match: MatchDetails;
  round: RoundDetails;
  onSuccess: () => void;
}

function UpdateScoreDialog({
  match,
  isOpen,
  handleClose,
  round,
  onSuccess,
}: UpdateScoreDialogProps) {
  const { playersById } = useTournamentPlayerContext();
  const { tournament } = useTournamentInfoContext();
  const { request, isLoading } = useFetch<MessageResponse>();
  const { pushError, pushSuccess } = useToastPushSubmit();
  const [blackScore, setBlackScore] = useState(
    match.blackScore === SpecialConditionScores.NotFinished
      ? 32
      : match.blackScore
  );

  const onClose = useEventCallback(() => {
    handleClose();
    setBlackScore(32);
  });

  const handleSubmit = useEventCallback(async () => {
    const {
      response,
      error,
    } = await request(
      `/api/tournaments/${tournament.id}/rounds/${round.id}/matches/${match.id}/`,
      'PATCH',
      { blackScore, whiteScore: 64 - blackScore }
    );

    if (response === '') {
      pushError(error.code);
    } else {
      pushSuccess('Match Updated');
      onSuccess();
      onClose();
    }
  });

  const getPlayerName = (playerId: number) =>
    playerId === PLAYER_BYE_ID
      ? 'BYE'
      : `${playersById[playerId].lastName} ${playersById[playerId].firstName}`;

  return (
    <Modal
      centered
      title="Update Match Score"
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button onClick={onClose}>Cancel</Button>,
        <Button type="primary" onClick={handleSubmit} loading={isLoading}>
          Submit
        </Button>,
      ]}
    >
      <Form>
        <FormItem label={<FormLabel>Black Player Name</FormLabel>}>
          <FormText>{getPlayerName(match.blackPlayerId)}</FormText>
        </FormItem>
        <FormItem label={<FormLabel>Black Score</FormLabel>}>
          <InputNumber
            min={0}
            max={64}
            value={blackScore}
            onChange={value => setBlackScore(value)}
          />
        </FormItem>
        <FormItem label={<FormLabel>White Player Name</FormLabel>}>
          <FormText>{getPlayerName(match.whitePlayerId)}</FormText>
        </FormItem>
        <FormItem label={<FormLabel>White Score</FormLabel>}>
          <InputNumber
            min={0}
            max={64}
            value={64 - blackScore}
            onChange={value => setBlackScore(64 - value)}
          />
        </FormItem>
      </Form>
    </Modal>
  );
}

export default UpdateScoreDialog;
