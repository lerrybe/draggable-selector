import dayjs from 'dayjs';
import * as S from './styles';

interface ColumnLabelProps {
  dates?: Date[];

  gap?: string;
  slotHeight?: string;
  slotMinWidth?: string;
  columnLabelsBgColor?: string;
  columnLabelsBorderRadius?: string;
  columnLabelsColor?: string;
  columnLabelsFontWeight?: number;
  columnLabelsMargin?: string;
  columnLabelsFontSize?: string;
  columnLabelsFontFamily?: string;
  columnLabelBorderRadius?: string;
  columnLabelBgColor?: string;
  columnLabelPadding?: string;
}

/*
  "ColumnLabel" component is used to display the "date or day" of the column.
*/
export default function ColumnLabel({
  gap,
  dates,
  slotHeight,
  slotMinWidth,
  columnLabelsBgColor,
  columnLabelsBorderRadius,
  columnLabelsColor,
  columnLabelsFontWeight,
  columnLabelsMargin,
  columnLabelsFontSize,
  columnLabelsFontFamily,
  columnLabelBorderRadius,
  columnLabelBgColor,
  columnLabelPadding,
}: ColumnLabelProps) {
  if (!dates || dates.length === 0) {
    return <></>;
  }

  return (
    <S.Items
      $gap={gap}
      $columnLabelsBgColor={columnLabelsBgColor}
      $columnLabelsBorderRadius={columnLabelsBorderRadius}
      $columnLabelsColor={columnLabelsColor}
      $columnLabelsFontWeight={columnLabelsFontWeight}
      $columnLabelsMargin={columnLabelsMargin}
      $columnLabelsFontSize={columnLabelsFontSize}
      $columnLabelsFontFamily={columnLabelsFontFamily}
    >
      {dates.map(date => {
        const key = date.getDate();
        return (
          <S.Item key={key} $height={slotHeight} $width={slotMinWidth}>
            <S.Label
              $padding={columnLabelPadding}
              $columnLabelBgColor={columnLabelBgColor}
              $columnLabelBorderRadius={columnLabelBorderRadius}
            >
              {dayjs(date).format('M/D')}
            </S.Label>
          </S.Item>
        );
      })}
    </S.Items>
  );
}
