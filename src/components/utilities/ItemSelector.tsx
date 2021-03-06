
import * as React from 'react';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';

import {hexToRgb, getTextColorOnBg} from '../../helpers/utils'

export interface ItemSelectorProps {
  label?: string
  hasColor?: boolean
  items: any[]
  onChange: (e: React.ChangeEvent<{
    name?: string | undefined,
    value: unknown,
  }>) => void
  value: any[]
}

export default function ItemSelector({items, hasColor, label, onChange, value}: ItemSelectorProps) {
  return <FormControl fullWidth>
    {label && <InputLabel id="categories">{label}</InputLabel>}
    <Select
      labelId="categories"
      multiple
      value={value}
      onChange={onChange}
      renderValue={(selectedIds) => (
        <Box display="flex" flexWrap="wrap" maxWidth="300px">
          {(selectedIds as string[]).map((id) => {
            const item = items.find((t) => t.id === parseInt(id))
            if (!item) return null;
            return <Chip
              key={`chip-${id}`}
              label={item.name}
              style={{
                backgroundColor: hasColor ? item.color : undefined,
                color: hasColor ? getTextColorOnBg(hexToRgb(item.color || '#ffffff')) : undefined,
                marginRight: 5,
                marginBottom: 5,
              }}
            />
          })}
        </Box>
      )}
    >
      {items.map((item) => 
        <MenuItem
          key={'selector-item-' + item.id}
          value={item.id}
        >
          <Tooltip title={item.description} style={{width: "100%"}}>
            <Box display="flex" alignItems="center" width="1OO%">
              <Checkbox
                checked={value.indexOf(item.id) > -1}
                style={{color: hasColor ? item.color : undefined}}
              />
              <ListItemText primary={item.name} />
            </Box>
          </Tooltip>
        </MenuItem>
      )}
    </Select>
  </FormControl>
}
