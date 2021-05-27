
import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

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
        <div>
          {(selectedIds as string[]).map((id) => {
            const item = items.find((t) => t.id === parseInt(id))
            if (!item) return null;
            return <Chip key={`chip-${id}`} label={item.name} />
          })}
        </div>
      )}
    >
      {items.map((item) => <MenuItem
        key={'selector-item-' + item.id}
        value={item.id}
      >
        <Checkbox
          checked={value.indexOf(item.id) > -1}
          style={{color: hasColor ? item.color : undefined}}
        />
        <ListItemText primary={item.name} />
      </MenuItem>)}
    </Select>
  </FormControl>
}
