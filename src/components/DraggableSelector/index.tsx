import React, { useCallback, useEffect, useState } from 'react';
import * as S from './styles';

import {
  areTimeSlotsEqual,
  getTimeSlotMatrix,
  updateCachedSelectedTimeSlots,
} from '../../utils/time';
import {
  getTimeSlotMatrixByDay,
  removeDuplicatesAndSortByDate,
} from '../../utils/date';

import RowLabel from './RowLabel';
import TimeSlots from './TimeSlots';
import ColumnLabel from './ColumnLabel';

import { sampleDates } from '../../data/date';
import { type TimeSlot } from '../../types/time';
import { type DragEventStates, Selection } from '../../types/event';

interface DraggableSelectorProps {
  /* REQUIRED */
  dates: Date[]; // Required default value: []
  endTime: string;
  startTime: string;
  selectedTimeSlots: TimeSlot[]; // Required default value: []
  setSelectedTimeSlots: React.Dispatch<React.SetStateAction<TimeSlot[]>>;

  /* OPTIONAL */
  timeUnit?: 5 | 10 | 15 | 20 | 30 | 60; // default: 30
  dateFormat?: string;
  timeFormat?: string;
  mode?: 'date' | 'day';
  language?: 'en' | 'ko';

  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  slotHeight?: string;
  slotMinWidth?: string;
  slotRowGap?: string;
  slotColumnGap?: string;
  defaultSlotColor?: string;
  hoveredSlotColor?: string;
  selectedSlotColor?: string;
  slotBorderStyle?: string;
  slotBorderRadius?: string;

  rowLabelWidth?: string;
  rowLabelBgColor?: string;
  rowLabelPadding?: string;
  rowLabelBorderRadius?: string;
  rowLabelsColor?: string;
  rowLabelsMargin?: string;
  rowLabelsBgColor?: string;
  rowLabelsFontSize?: string;
  rowLabelsFontWeight?: number;
  rowLabelsFontFamily?: string;
  rowLabelsBorderRadius?: string;
  isRowLabelInvisible?: boolean;

  columnLabelBgColor?: string;
  columnLabelPadding?: string;
  columnLabelBorderRadius?: string;
  columnLabelsColor?: string;
  columnLabelsMargin?: string;
  columnLabelsBgColor?: string;
  columnLabelsFontSize?: string;
  columnLabelsFontFamily?: string;
  columnLabelsFontWeight?: number;
  columnLabelsBorderRadius?: string;
  isColumnLabelInVisible?: boolean;

  scrollWidth?: string;
  scrollColor?: string;
  scrollBgColor?: string;
}

export default function DraggableSelector({
  dates,
  endTime,
  startTime,
  selectedTimeSlots,
  setSelectedTimeSlots,

  mode,
  language,
  timeUnit,
  dateFormat,
  timeFormat,

  width,
  height,
  maxWidth,
  maxHeight,
  slotHeight,
  slotMinWidth,
  slotRowGap,
  slotColumnGap,
  slotBorderStyle,
  slotBorderRadius,
  defaultSlotColor,
  hoveredSlotColor,
  selectedSlotColor,

  rowLabelBgColor,
  rowLabelPadding,
  rowLabelBorderRadius,
  rowLabelWidth,
  rowLabelsColor,
  rowLabelsMargin,
  rowLabelsBgColor,
  rowLabelsFontSize,
  rowLabelsFontFamily,
  rowLabelsFontWeight,
  rowLabelsBorderRadius,
  isRowLabelInvisible,

  columnLabelBgColor,
  columnLabelPadding,
  columnLabelBorderRadius,
  columnLabelsColor,
  columnLabelsMargin,
  columnLabelsBgColor,
  columnLabelsFontSize,
  columnLabelsFontFamily,
  columnLabelsFontWeight,
  columnLabelsBorderRadius,
  isColumnLabelInVisible,

  scrollWidth,
  scrollColor,
  scrollBgColor,
}: DraggableSelectorProps) {
  /* ----- STATES ----- */
  const [timeSlotMatrix, setTimeSlotMatrix] = useState<TimeSlot[][]>([]);
  const [dragEventStates, setDragEventStates] = useState<DragEventStates>({
    selectionType: null,
    startedTimeSlot: null,
    cachedSelectedTimeSlots: [...selectedTimeSlots],
  });
  const [selectedDates, setSelectedDates] = useState<Date[]>(
    removeDuplicatesAndSortByDate(dates),
  );
  const [mockTimeSlotMatrix, setMockTimeSlotMatrix] = useState<TimeSlot[][]>(
    [],
  );
  const [timeSlotMatrixByDay, setTimeSlotMatrixByDay] = useState<TimeSlot[][]>(
    [],
  );
  /* ----- STATES ----- */

  /* ----- FUNC related with SELECTION & UPDATING ----- */
  const startSelection = useCallback(
    (startedTimeSlot: TimeSlot, selectedTimeSlots: TimeSlot[]) => {
      const selectedTimeSlot = selectedTimeSlots.find(slot =>
        areTimeSlotsEqual(startedTimeSlot, slot, mode || 'date'),
      );
      setDragEventStates(prev => ({
        ...prev,
        startedTimeSlot: startedTimeSlot,
        selectionType: selectedTimeSlot ? Selection.REMOVE : Selection.ADD,
      }));
    },
    [mode],
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
      if (mode === 'day') {
        updateCachedSelectedTimeSlots({
          mode: 'day',
          endedTimeSlot,
          timeSlotMatrix: mockTimeSlotMatrix,
          dragEventStates,
          selectedTimeSlots,
          setDragEventStates,
          timeSlotMatrixByDay,
        });
      } else {
        updateCachedSelectedTimeSlots({
          mode: 'date',
          endedTimeSlot,
          timeSlotMatrix,
          dragEventStates,
          selectedTimeSlots,
          setDragEventStates,
          timeSlotMatrixByDay,
        });
      }
    },
    [dragEventStates, selectedTimeSlots, timeSlotMatrix],
  );
  /* ----- FUNC related with SELECTION & UPDATING ----- */

  /* ----- EVENT HANDLERS ----- */
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
  /* ----- EVENT HANDLERS ----- */

  /* ----- EFFECTS ----- */
  useEffect(() => {
    setSelectedDates(removeDuplicatesAndSortByDate(dates));
  }, [dates]);

  // Initialize data when options changed
  useEffect(() => {
    setSelectedTimeSlots([]);
    setDragEventStates({
      selectionType: null,
      startedTimeSlot: null,
      cachedSelectedTimeSlots: [],
    });
  }, [mode, startTime, endTime, timeUnit]);

  // Remove timeSlots if date is not in the selectedDates
  useEffect(() => {
    const filteredTimeSlots = selectedTimeSlots.filter(slot => {
      return selectedDates.some(date => {
        const standardDate = new Date(slot.date);
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
    const matrix = getTimeSlotMatrix({
      timeUnit: timeUnit || 30,
      dates: selectedDates,
      startTime: startTime,
      endTime: endTime,
    });
    if (matrix) {
      setTimeSlotMatrix(matrix);
    }
  }, [mode, startTime, endTime, timeUnit, selectedDates]);

  useEffect(() => {
    const sortedMatrix = getTimeSlotMatrixByDay(timeSlotMatrix);
    if (sortedMatrix) {
      setTimeSlotMatrixByDay(sortedMatrix);
    }
  }, [timeSlotMatrix]);

  useEffect(() => {
    const mockMatrix = getTimeSlotMatrix({
      timeUnit: timeUnit || 30,
      dates: removeDuplicatesAndSortByDate(sampleDates),
      startTime: startTime,
      endTime: endTime,
    });
    if (mockMatrix) {
      setMockTimeSlotMatrix(mockMatrix);
    }
  }, [mode, startTime, endTime, timeUnit, selectedDates]);

  useEffect(() => {
    document.addEventListener('mouseup', updateSlots);
    return () => {
      document.removeEventListener('mouseup', updateSlots);
    };
  }, [updateSlots]);
  /* ----- EFFECTS ----- */

  return (
    <>
      <S.Container
        $width={width}
        $height={height}
        $maxWidth={maxWidth}
        $maxHeight={maxHeight}
        $scrollWidth={scrollWidth}
        $scrollColor={scrollColor}
        $scrollBgColor={scrollBgColor}
      >
        {selectedDates && startTime && endTime && (
          <>
            {!isRowLabelInvisible && (
              <S.LeftContainer $rowLabelWidth={rowLabelWidth}>
                {!isColumnLabelInVisible && <S.EmptySlot height={slotHeight} />}
                <RowLabel
                  gap={slotRowGap}
                  slotHeight={slotHeight}
                  timeFormat={timeFormat}
                  timeSlots={timeSlotMatrix[0]}
                  rowLabelsColor={rowLabelsColor}
                  rowLabelsMargin={rowLabelsMargin}
                  rowLabelBgColor={rowLabelBgColor}
                  rowLabelPadding={rowLabelPadding}
                  rowLabelsBgColor={rowLabelsBgColor}
                  rowLabelsFontSize={rowLabelsFontSize}
                  rowLabelsFontWeight={rowLabelsFontWeight}
                  rowLabelsFontFamily={rowLabelsFontFamily}
                  rowLabelBorderRadius={rowLabelBorderRadius}
                  rowLabelsBorderRadius={rowLabelsBorderRadius}
                />
              </S.LeftContainer>
            )}

            <S.RightContainer>
              {!isColumnLabelInVisible && (
                <ColumnLabel
                  mode={mode || 'date'}
                  dates={selectedDates}
                  dateFormat={dateFormat}
                  language={language || 'en'}
                  gap={slotColumnGap}
                  slotHeight={slotHeight}
                  slotMinWidth={slotMinWidth}
                  columnLabelsColor={columnLabelsColor}
                  columnLabelsMargin={columnLabelsMargin}
                  columnLabelBgColor={columnLabelBgColor}
                  columnLabelPadding={columnLabelPadding}
                  columnLabelsBgColor={columnLabelsBgColor}
                  columnLabelsFontSize={columnLabelsFontSize}
                  columnLabelsFontFamily={columnLabelsFontFamily}
                  columnLabelsFontWeight={columnLabelsFontWeight}
                  columnLabelBorderRadius={columnLabelBorderRadius}
                  columnLabelsBorderRadius={columnLabelsBorderRadius}
                />
              )}
              <TimeSlots
                mode={mode || 'date'}
                slotRowGap={slotRowGap}
                slotHeight={slotHeight}
                slotMinWidth={slotMinWidth}
                slotColumnGap={slotColumnGap}
                timeSlotMatrix={timeSlotMatrix}
                slotBorderStyle={slotBorderStyle}
                hoveredSlotColor={hoveredSlotColor}
                defaultSlotColor={defaultSlotColor}
                slotBorderRadius={slotBorderRadius}
                selectedSlotColor={selectedSlotColor}
                mockTimeSlotMatrix={mockTimeSlotMatrix}
                timeSlotMatrixByDay={timeSlotMatrixByDay}
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
