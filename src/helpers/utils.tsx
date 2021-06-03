
// --------------------------------- TEST FUNCTIONS -------------------------------
export const isArray = (x: any) => Array.isArray(x);

// --------------------------------- ARRAY FUNCTIONS -------------------------------

export const times = (n: number) => Array.from({length: n}, (_,x) => x)

export const duplicateArray = (items: any[]) => items.map((e) => {return {...e}})

export const sortByName = (items: any[], isAsc: boolean) => {
  const newItems = [...items];
  newItems.sort((a, b) => {
    if(a.name < b.name) { return isAsc ? -1 : 1; }
    if(a.name > b.name) { return isAsc ? 1 : -1; }
    return 0;
  })
  return newItems;
}

export const sortByTypeThenName = (items: any[], types: any[], isAsc: boolean = true) => {
  const newItems = [...items];
  const noType = {name: 'Untyped'};
  newItems.sort((a, b) => {
    const typeA = types.find((t) => t.id === a.typeIds[0]) || noType;
    const typeB = types.find((t) => t.id === b.typeIds[0]) || noType;
    if(typeA.name < typeB.name) { return isAsc ? -1 : 1; }
    if(typeA.name > typeB.name) { return isAsc ? 1 : -1; }
    if(a.name < b.name) { return isAsc ? -1 : 1; }
    if(a.name > b.name) { return isAsc ? 1 : -1; }
    return 0;
  })
  return newItems;
}

// --------------------------------- COLORS -------------------------------

export const hexToRgb = (hex: string): {r: number, g: number, b: number} => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : {r: 0, g: 0, b: 0}
}

export const getTextColorOnBg = (color: {r: number, g: number, b: number}): string => {
  const {r, g, b} = color
  return (r*0.299 + g*0.587 + b*0.114) > 186 ? '#000000' : '#ffffff'
}
