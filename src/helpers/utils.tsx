
// --------------------------------- TEST FUNCTIONS -------------------------------
export const isArray = (x: any) => Array.isArray(x);

export const sortByName = (items: any[], isAsc: boolean) => {
  const newItems = [...items];
  newItems.sort((a, b) => {
    if(a.name < b.name) { return isAsc ? -1 : 1; }
    if(a.name > b.name) { return isAsc ? 1 : -1; }
    return 0;
  })
  return newItems;
}