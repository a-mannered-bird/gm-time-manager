
import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage'
import defaultDb from './defaultdb';
import {isArray} from '../helpers/utils';
import { projectTitleKebabCase } from '../general-settings.json';

const adapter = new LocalStorage(projectTitleKebabCase + '-db')
const db = low(adapter)

/******** DEFAULT DB ********/

db.defaults(defaultDb)
  .write()


// Data is automatically saved to localStorage
const cleanItem = (item: any): any => {
  delete item.tableData;
  return item;
}

export const getDb = (callback: (data: any) => void) => {
  callback(db.value());
}

export const putDb = (data: any, callback: (datas: any) => void) => {
  callback(
    db.setState(data)
      .write()
  );
}

export const getAll = (itemName: string, callback: (data: any) => void) => {
  callback(
    db.get(itemName)
      .value().items
  );
}

export const getAllFromProject = (itemName: string, projectId: number, callback: (data: any) => void) => {
  callback(
    db.get(itemName + '.items')
      // @ts-ignore
      .filter((n: any) => n.projectId === projectId)
      .value()
  );
}

export const getItem = (itemName: string, itemId: number, callback: (data: any) => void) => {
  callback(
    db.get(itemName + '.items')
      // @ts-ignore
      .find({id: itemId})
      .value()
  );
}

export const getItems = (itemName: string, filterObject: any, callback: (data: any) => void) => {
  callback(
    db.get(itemName + '.items')
      // @ts-ignore
      .filter(filterObject)
      .value()
  );
}

export const postItem = (itemName: string, item: any, callback: (data: any) => void) => {
  let id: number;
  callback(
    db.get(itemName)
      .update('count', (n) => {
        id = n + 1;
        return id;
      })
      .update('items', (items: any[]) => {
        return items
          .concat({...item, id})
          // TODO - Solve this bug in a more performant way
          .map((n) => cleanItem(n))
      })
      .write()
  );
}

export const postItems = (itemName: string, newItems: any[], callback: (data: any) => void) => {
  getValue(`${itemName}.count`, (count: number) => {
    let id = count;
    newItems = newItems.map((item) => {
      id++;
      item.id = id;
      return item;
    });

    callback(
      db.get(itemName)
        .update('count', (n) => id)
        .update('items', (items: any[]) => {
          return items.concat(newItems);
        })
        .write()
    );
  });
}

export const putItem = (itemName: string, item: any, callback: (data: any) => void) => {
  callback(
    db.get(itemName)
      .update('items', (items: any[]) => {
        const i = items.findIndex((n) => n.id === item.id);
        items[i] = item;
        items.map((n) => cleanItem(n))
        return items;
      })
      .write()
  );
}

export const putItems = (itemName: string, params: any, callback: (data: any) => void) => {
  callback(
    db.get(itemName)
      .update('items', (items: any[]) => {
        if (isArray(params)) {
          return items.map((item) => params.find((n: any) => n.id === item.id) || item);
        } else {
          return items.map(params);
        }
      })
      .write()
  );
}

export const deleteItem = (itemName: string, itemId: number, callback: (data: any) => void) => {
  callback(
    db.get(itemName +'.items')
      // @ts-ignore
      .remove({id: itemId})
      .write()
  );
}

export const deleteItems = (itemName: string, params: any, callback: (data: any) => void) => {
  if (isArray(params)) {
    callback(
      db.get(itemName +'.items')
        // @ts-ignore
        .remove((n) => {
          return params.find((i: any) => i.id === n.id);
        })
        .write()
    );
  } else {
    callback(
      db.get(itemName +'.items')
        // @ts-ignore
        .remove(params)
        .write()
    );
  }
}

export const getValue = (key: string, callback: (data: any) => void) => {
  callback(
    db.get(key)
      .value()
  );
}

export const putValue = (key: string, value: any, callback: (data: any) => void) => {
  callback(
    db.set(key, value)
      .write()
  );
}

export const removeItemLinks = (itemName: string, linkKey: string, filteredItems: any[], callback: (data: any) => void) => {
  putItems(itemName, (item: any) => {
    const links = item[linkKey];

    // If it's an array of ids
    if (isArray(links)) {
      item[linkKey] = links.filter((id: number) => 
        !filteredItems.find((filteredItem: any) => filteredItem.id === id)
      );

    // If it's a simple id
    } else if (links && filteredItems.find((filteredItem) => filteredItem.id === links)) {
      delete item[linkKey];
    }
    return item;
  }, callback)
}

/**
 * Delete all items linked to a specific item id
 *
 * @param itemName  string  name of item that will be deleted
 * @param linkKey  string  name of parameter containing the link id we want to check
 * @param filteredItems  number[]  Items linked to these items will be deleted
 */
export const removeLinkedItems = (itemName: string, linkKey: string, filteredItems: any[], callback: (data: any) => void) => {
  deleteItems(itemName, (item: any) => {
    const links = item[linkKey];
    return links && filteredItems.find((filteredItem) => filteredItem.id === links);
  }, callback)
}
