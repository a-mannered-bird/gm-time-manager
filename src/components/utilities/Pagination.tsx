
import * as React from 'react'

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
 import { useTheme } from '@material-ui/core/styles';

import {times} from '../../helpers/utils'

export interface PaginationProps {
  pageCount: number;
  onPageChange: (pageSelected: number) => void;
  selectedPage: number;
}

export default function Pagination({pageCount, onPageChange, selectedPage}: PaginationProps) {
  const theme = useTheme();

  const displayLink = (label: string | number, newPage: number, selected: boolean, disabled?: boolean) => <Box
    mr={1}
  >
    <Link
      color={selected ? "inherit" : "secondary"}
      component="button"
      disabled={disabled}
      onClick={() => onPageChange(newPage)}
      style={{
        color: disabled ? theme.palette.grey.A700 : undefined,
      }}
      underline={!disabled && !selected ? 'hover' : 'none'}
      variant="h6"
    >
      {label}
    </Link>
  </Box>

  const displayPageNumber = (_: any, i: number) => {
    return <React.Fragment key={`page-${i}`}>
      {displayLink(i + 1, i, i === selectedPage)}
    </React.Fragment>
  }

  return <Box display="flex" alignItems="center" justifyContent="center" flexWrap="wrap">
    {displayLink('<', selectedPage - 1, false, selectedPage === 0)}
    {times(pageCount).map(displayPageNumber)}
    {displayLink('>', selectedPage + 1, false, selectedPage >= pageCount - 1)}
  </Box>
}
