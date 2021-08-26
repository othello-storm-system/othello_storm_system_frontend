import React, { useState } from 'react';
import styled from 'styled-components';

import { Button, Modal } from 'antd';
import { LaptopOutlined } from '@ant-design/icons';

import { Row } from 'components/common';
import {
  MatchDetails,
  MessageResponse,
  Player,
  RoundDetails,
} from 'utils/apiResponseShapes';
import { ClosableComponentProps } from 'utils/interfaces';
import useFetch from 'hooks/useFetch';
import useToastPushSubmit from 'hooks/useToastPushSubmit';
import useEventCallback from 'hooks/useEventCallback';
import { PlayerColor, SpecialConditionScores } from 'utils/enums';
import UpdateScoreDialog from './UpdateScoreDialog';
import PlayerBox from './PlayerBox';
import { useTournamentInfoContext } from '../TournamentInfoContext';

interface PlayerButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  type?: 'default' | 'primary';
  player: Player;
}

const StyledPlayerButton = styled(Button)`
  max-width: 250px;

  &[disabled],
  &[disabled]:hover,
  &[disabled]:focus,
  &[disabled]:active {
    background-color: white;
    color: rgba(0, 0, 0, 0.85);
  }
`;

const PlayerNameDiv = styled.div`
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export function PlayerButton({
  onClick = () => {},
  player,
  disabled = false,
  type = 'default',
}: PlayerButtonProps) {
  return (
    <StyledPlayerButton
      onClick={onClick}
      disabled={disabled}
      type={type}
      key={player.id}
    >
      <PlayerNameDiv>
        {player.lastName} {player.firstName}
      </PlayerNameDiv>
    </StyledPlayerButton>
  );
}

interface DeleteRoundButtonProps {
  onSuccess: () => void;
  round: RoundDetails;
}

const StyledButton = styled(Button)`
  margin-bottom: 12px;
`;

export function DeleteRoundButton({
  round,
  onSuccess,
}: DeleteRoundButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <StyledButton danger type="primary" onClick={() => setIsOpen(true)}>
        Delete Round
      </StyledButton>
      <DeleteRoundDialog
        isOpen={isOpen}
        handleClose={() => setIsOpen(false)}
        onSuccess={onSuccess}
        round={round}
      />
    </>
  );
}

interface DeleteRoundDialogProps extends ClosableComponentProps {
  round: RoundDetails;
  onSuccess: () => void;
}

function DeleteRoundDialog({
  round,
  onSuccess,
  isOpen,
  handleClose,
}: DeleteRoundDialogProps) {
  const { tournament } = useTournamentInfoContext();
  const { request, isLoading } = useFetch<MessageResponse>();
  const { pushError, pushSuccess } = useToastPushSubmit();

  const handleSubmit = useEventCallback(async () => {
    const { response, error } = await request(
      `/api/tournaments/${tournament.id}/rounds/${round.id}/`,
      'DELETE'
    );

    if (response === '') {
      pushError(error.code);
    } else {
      pushSuccess('Round deleted');
      onSuccess();
      handleClose();
    }
  });

  return (
    <Modal
      centered
      title="Delete round"
      visible={isOpen}
      onCancel={handleClose}
      footer={[
        <Button onClick={handleClose}>Cancel</Button>,
        <Button
          danger
          type="primary"
          onClick={handleSubmit}
          loading={isLoading}
        >
          Delete
        </Button>,
      ]}
    >
      Are you sure you want to delete round {round.name}? This action is not
      reversible.
    </Modal>
  );
}

interface MatchEditDisplayProps {
  match: MatchDetails;
  onUpdate: () => void;
  round: RoundDetails;
}

const PlayerBoxPair = styled(Row)`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const StyledMatchEditButton = styled(Button)``;

export function MatchEditDisplay({
  round,
  match,
  onUpdate,
}: MatchEditDisplayProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <PlayerBoxPair>
      <div>
        <PlayerBox
          playerId={match.blackPlayerId}
          score={match.blackScore}
          color={PlayerColor.Black}
        />
        <PlayerBox
          playerId={match.whitePlayerId}
          score={match.whiteScore}
          color={PlayerColor.White}
        />
      </div>
      {match.blackScore !== SpecialConditionScores.Bye && (
        <>
          <StyledMatchEditButton
            type="text"
            disabled={false}
            onClick={() => setIsOpen(true)}
          >
            <LaptopOutlined />
          </StyledMatchEditButton>
          <UpdateScoreDialog
            isOpen={isOpen}
            round={round}
            match={match}
            handleClose={() => setIsOpen(false)}
            onSuccess={onUpdate}
          />
        </>
      )}
    </PlayerBoxPair>
  );
}
