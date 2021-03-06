
// --------------------------------- TEST FUNCTIONS -------------------------------
export const isArray = (x: any) => Array.isArray(x);

// --------------------------------- ARRAY FUNCTIONS -------------------------------

export const arraysEqual = (a: any[], b: any[], sort?: boolean,
  compareFunction?: (a: any, b: any) => boolean
) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  const aClone = [...a];
  const bClone = [...b];

  // Order function if specified
  if (sort) {
    aClone.sort();
    bClone.sort();
  }

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// --------------------------------- STRING FUNCTIONS -------------------------------

export const removeExtension = (str: string) => {
  let newString = str.split('.');
  newString.splice(-1);
  return newString.join('.');
}

/**
 * Will apply the match method without the global flag (so we can get details about index
 * and groups), to all of the possible matches in a string
 *
 * @param content  string  Content to search into
 * @param needle  string | RegExp  String or Regex to match
 */
export const matchAll = (content: string, needle: string | RegExp): any[] => {
  if (needle instanceof RegExp) {
    if (needle.flags.indexOf('g') !== -1) {
      return content.match(needle) || [];
    }
  }

  const results = [] as any[];
  let haystack = content;
  let sliceCount = 0;
  while (haystack) {
    const match = haystack.match(needle);
    if (match && match.index) {
      const sliceOffset = match.index + match[0].length;
      haystack = haystack.slice(sliceOffset);

      match.index += sliceCount;
      sliceCount += sliceOffset;
      results.push(match);
    } else {
      haystack = '';
    }
  }

  return results;
}

// --------------------------------- DOM FUNCTIONS -------------------------------

export const getAllContentsFromEl = (el: HTMLElement, els = [] as Text[]): Text[] => {
  Array.prototype.slice.call(el.childNodes).forEach((child) => {
    if (child.constructor.name === 'Text') {
      els.push(child);
    } else {
      els = getAllContentsFromEl(child, els);
    }
  });
  return els;
}

/**
 * Get elements by className and transform the resulting HTMLCollection into
 * an Array of HTMLElements, allowing use of Array native functions. This
 * way is IE11 compatible, contrary to the use of Array.from() function.
 *
 * @param className : string
 */
export const getArrayByClassName = (className: string): HTMLElement[] => {
  return Array.prototype.slice.call(document.getElementsByClassName(className));
};

export const getArrayByQuery = (query: string): HTMLElement[] => {
  return Array.prototype.slice.call(document.querySelectorAll(query));
};

export const getLegacyNodeWithClassName = (node: Element | null, needle: string | RegExp): Element | null => {
  if (!node) {
    return null;
  }
  return node.className.match(needle) ?
    node : getLegacyNodeWithClassName(node.parentElement, needle);
}
