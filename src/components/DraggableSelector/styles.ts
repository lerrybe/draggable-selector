import styled from 'styled-components';
import {
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_MARGIN,
  DEFAULT_PADDING,
  DEFAULT_MIN_WIDTH,
  DEFAULT_MAX_WIDTH,
  DEFAULT_MIN_HEIGHT,
  DEFAULT_MAX_HEIGHT,
  DEFAULT_SCROLL_COLOR,
  DEFAULT_SCROLL_WIDTH,
  DEFAULT_ROW_LABEL_WIDTH,
  DEFAULT_SCROLL_BG_COLOR,
  DEFAULT_COLUMN_LABELS_HEIGHT,
} from '../../constant/options';

interface ContainerProps {
  $width?: string;
  $height?: string;
  $margin?: string;
  $padding?: string;
  $minWidth?: string;
  $maxWidth?: string;
  $minHeight?: string;
  $maxHeight?: string;
  $scrollWidth?: string;
  $scrollColor?: string;
  $scrollBgColor?: string;
}
export const Container = styled.div<ContainerProps>(
  ({
    $width,
    $height,
    $margin,
    $padding,
    $minWidth,
    $maxWidth,
    $minHeight,
    $maxHeight,
    $scrollWidth,
    $scrollColor,
    $scrollBgColor,
  }) => `  
  display: flex;
  overflow: auto;

  margin: ${$margin || DEFAULT_MARGIN};
  padding: ${$padding || DEFAULT_PADDING};
  width: ${$width || DEFAULT_WIDTH};
  height: ${$height || DEFAULT_HEIGHT};
  min-width: ${$minWidth || DEFAULT_MIN_WIDTH};
  max-width: ${$maxWidth || DEFAULT_MAX_WIDTH};
  min-height: ${$minHeight || DEFAULT_MIN_HEIGHT};
  max-height: ${$maxHeight || DEFAULT_MAX_HEIGHT};
  
  &::-webkit-scrollbar {
    width: ${$scrollWidth || DEFAULT_SCROLL_WIDTH};  /* WIDTH, HEIGHT */
    height: ${$scrollWidth || DEFAULT_SCROLL_WIDTH};
  }
  &::-webkit-scrollbar-thumb {
    height: 30%; /* LENGTH */
    background: ${$scrollColor || DEFAULT_SCROLL_COLOR}; /* COLOR */
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: ${$scrollBgColor || DEFAULT_SCROLL_BG_COLOR};  /* BG COLOR */
  }
`,
);

interface LeftContainerProps {
  $rowLabelWidth?: string;
}
export const LeftContainer = styled.div<LeftContainerProps>(
  ({ $rowLabelWidth }) => `  
  width: ${$rowLabelWidth || DEFAULT_ROW_LABEL_WIDTH};
  min-width: ${$rowLabelWidth || DEFAULT_ROW_LABEL_WIDTH};
`,
);

interface RightContainerProps {}
export const RightContainer = styled.div<RightContainerProps>(
  () => `
  width: auto;
  flex-grow: 1;
`,
);

interface EmptySlotProps {
  height?: string;
}
export const EmptySlot = styled.li<EmptySlotProps>(
  ({ height }) => `  
  width: 100%;
  height: ${height || DEFAULT_COLUMN_LABELS_HEIGHT};
  
  display: flex;
  align-items: center;
  justify-content: center;
`,
);
