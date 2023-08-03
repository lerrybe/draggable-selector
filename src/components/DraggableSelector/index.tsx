import React, { useCallback, useEffect, useState } from 'react';
import * as S from './styles';
import { type TimeSlot } from '../../types/time';
import { type DragEventStates, Selection } from '../../types/event';

import {
  areTimeSlotsEqual,
  getTimeSlotMatrix,
  updateCachedSelectedTimeSlots,
} from '../../utils/time';
import { changeDateStringFormat, getSortedDates } from '../../utils/date.ts';

import RowLabel from './RowLabel';
import TimeSlots from './TimeSlots';
import ColumnLabel from './ColumnLabel';

interface DraggableSelectorProps {
  /* REQUIRED */
  startTime: string;
  endTime: string;
  selectedDates: Date[]; // Required default value: []
  selectedTimeSlots: TimeSlot[]; // Required default value: []
  setSelectedTimeSlots: React.Dispatch<React.SetStateAction<TimeSlot[]>>;

  /* OPTIONAL */
  timeUnit?: 5 | 10 | 15 | 20 | 30 | 60; // opt, default: 30
  slotHeight?: number;
  slotMinWidth?: number;
  slotRowGap?: number;
  slotColumnGap?: number;
}

export default function DraggableSelector({
  startTime,
  endTime,
  selectedDates,
  selectedTimeSlots,
  setSelectedTimeSlots,

  timeUnit,
  slotHeight,
  slotMinWidth,
  slotRowGap,
  slotColumnGap,
}: DraggableSelectorProps) {
  /* STATES */
  const [timeSlotMatrix, setTimeSlotMatrix] = useState<TimeSlot[][]>([]);
  const [dragEventStates, setDragEventStates] = useState<DragEventStates>({
    selectionType: null,
    startedTimeSlot: null,
    cachedSelectedTimeSlots: [...selectedTimeSlots],
  });

  /* FUNCTIONS */
  const startSelection = useCallback(
    (startedTimeSlot: TimeSlot, selectedTimeSlots: TimeSlot[]) => {
      const selectedTimeSlot = selectedTimeSlots.find(slot =>
        areTimeSlotsEqual(startedTimeSlot, slot),
      );
      setDragEventStates(prev => ({
        ...prev,
        startedTimeSlot: startedTimeSlot,
        selectionType: selectedTimeSlot ? Selection.REMOVE : Selection.ADD,
      }));
    },
    [],
  );
  const updateSlots = useCallback(() => {
    setSelectedTimeSlots(dragEventStates.cachedSelectedTimeSlots);
    setDragEventStates(prev => ({
      ...prev,
      selectionType: null,
      startedTimeSlot: null,
    }));
  }, [dragEventStates.cachedSelectedTimeSlots, setSelectedTimeSlots]);
  const updateCache = useCallback(
    (endedTimeSlot: TimeSlot) => {
      updateCachedSelectedTimeSlots({
        endedTimeSlot,
        timeSlotMatrix,
        dragEventStates,
        selectedTimeSlots,
        setDragEventStates,
      });
    },
    [dragEventStates, selectedTimeSlots, timeSlotMatrix],
  );

  /* HANDLERS */
  const handleMouseUp = useCallback(
    (endedTimeSlot: TimeSlot) => {
      updateCache(endedTimeSlot);
    },
    [updateCache],
  );
  const handleMouseEnter = useCallback(
    (endedTimeSlot: TimeSlot) => {
      updateCache(endedTimeSlot);
    },
    [updateCache],
  );
  const handleMouseDown = useCallback(
    (startedTimeSlot: TimeSlot) => {
      startSelection(startedTimeSlot, selectedTimeSlots);
    },
    [selectedTimeSlots, startSelection],
  );

  /* EFFECTS */

  /* DATA INITIALIZE for OPTIONS */
  useEffect(() => {
    setSelectedTimeSlots([]);
    setDragEventStates({
      selectionType: null,
      startedTimeSlot: null,
      cachedSelectedTimeSlots: [],
    });
  }, [startTime, endTime, timeUnit]);

  /* filter timeSlots if dates changed */
  useEffect(() => {
    // If the date of the corresponding slot is not in the selectedDates
    // it is removed while rotating the elements in the selectedTimeSlot array.
    const filteredTimeSlots = selectedTimeSlots.filter(slot => {
      return selectedDates.some(date => {
        const standardDate = new Date(changeDateStringFormat(slot.date));
        return (
          standardDate.getFullYear() === date.getFullYear() &&
          standardDate.getMonth() === date.getMonth() &&
          standardDate.getDate() === date.getDate()
        );
      });
    });
    setSelectedTimeSlots(filteredTimeSlots);
    setDragEventStates(prev => ({
      ...prev,
      cachedSelectedTimeSlots: filteredTimeSlots,
    }));
  }, [selectedDates]);

  useEffect(() => {
    document.addEventListener('mouseup', updateSlots);
    return () => {
      document.removeEventListener('mouseup', updateSlots);
    };
  }, [updateSlots]);

  useEffect(() => {
    const matrix = getTimeSlotMatrix({
      timeUnit: timeUnit || 30,
      dates: getSortedDates(selectedDates),
      startTime: startTime,
      endTime: endTime,
    });
    if (matrix) {
      setTimeSlotMatrix(matrix);
    }
  }, [selectedDates, startTime, endTime, timeUnit]);

  return (
    <>
      <S.Container>
        {selectedDates && startTime && endTime && (
          <>
            <S.LeftContainer>
              <S.EmptySlot height={slotHeight} />
              <RowLabel
                gap={slotRowGap}
                slotHeight={slotHeight}
                timeSlots={timeSlotMatrix[0]}
              />
            </S.LeftContainer>

            <S.RightContainer>
              <ColumnLabel
                gap={slotColumnGap}
                slotHeight={slotHeight}
                slotMinWidth={slotMinWidth}
                dates={getSortedDates(selectedDates)}
              />
              <TimeSlots
                slotRowGap={slotRowGap}
                slotColumnGap={slotColumnGap}
                slotHeight={slotHeight}
                slotMinWidth={slotMinWidth}
                timeSlotMatrix={timeSlotMatrix}
                handleMouseUp={handleMouseUp}
                handleMouseDown={handleMouseDown}
                handleMouseEnter={handleMouseEnter}
                cachedSelectedTimeSlots={
                  dragEventStates.cachedSelectedTimeSlots
                }
              />
            </S.RightContainer>
          </>
        )}
      </S.Container>
    </>
  );
}
