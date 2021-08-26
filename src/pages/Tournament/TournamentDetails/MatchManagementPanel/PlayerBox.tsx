import React from 'react';
import styled from 'styled-components';
import { PlayerColor, SpecialConditionScores } from 'utils/enums';
import { useTournamentPlayerContext } from '../TournamentPlayerContext';
import { PLAYER_BYE_ID } from './constants';

interface PlayerBoxProps {
  playerId: number;
  score: number;
  color: PlayerColor;
}

const PlayerBoxDiv = styled.div`
  box-sizing: content-box;
  border: 1px solid black;
  width: 275px;
  display: grid;
  grid-template-columns: 8fr 1fr 1fr;
  padding-left: 5px;

  &:nth-child(2) {
    border-top: 0;
  }
`;

const PlayerBoxNameDiv = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PlayerBoxPartDiv = styled.div`
  border-left: 1px solid black;
  text-align: center;
`;

function PlayerBox({ playerId, score, color }: PlayerBoxProps) {
  const { playersById } = useTournamentPlayerContext();

  const playerNameDisplay =
    playerId === PLAYER_BYE_ID
      ? 'BYE'
      : `${playersById[playerId].lastName} ${playersById[playerId].firstName}`;

  const playerScoreDisplay =
    score === SpecialConditionScores.Bye
      ? '-'
      : score === SpecialConditionScores.NotFinished
      ? '?'
      : score.toString();

  const playerColor = color === PlayerColor.Black ? '#000000' : '#FFFFFF';

  return (
    <PlayerBoxDiv>
      <PlayerBoxNameDiv>{playerNameDisplay}</PlayerBoxNameDiv>
      <PlayerBoxPartDiv>{playerScoreDisplay}</PlayerBoxPartDiv>
      <PlayerBoxPartDiv style={{ backgroundColor: playerColor }} />
    </PlayerBoxDiv>
  );
}

export default PlayerBox;
