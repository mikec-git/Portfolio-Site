// GENERAL UTILITY FUNCTION
export const isArrayGt = (array, length) => {
  return Array.isArray(array) && array.length > length;
};

export const isObject = (object) => {
  if(object === null) return false;
  return (typeof(object) === 'object' || typeof(object) === 'function');
};

export const isWindowMobile = () => {
  const dpi = window.devicePixelRatio;
  return window.innerWidth/dpi <= 750 && window.innerHeight/dpi <= 700;
}

export const isWindowDesktop = () => {
  const dpi = window.devicePixelRatio;
  return window.innerWidth/dpi > 750 || window.innerHeight/dpi > 700;
}

export const mergeSortImages = (images) => {
  const n = images.length;
  if(n <= 1) {
    return;
  }

  const left  = [];
  const right = [];
  const mid = Math.floor(n/2);

  for(let i = 0; i < mid; i++) {
    left.push(images[i]);
  }

  for(let j = mid; j < n; j++) {
    right.push(images[j]);
  }
  
  mergeSortImages(left);
  mergeSortImages(right);
  merge(images, left, right);
}

const merge = (images, left, right) => {
  const leftLength  = left.length;
  const rightLength = right.length;
  let counter = 0;
  let i = 0;
  let j = 0;

  while(i < leftLength && j < rightLength) {
    const leftNum = parseInt(/\d+/.exec(left[i].key)[0]);
    const rightNum = parseInt(/\d+/.exec(right[j].key)[0]);
    if(leftNum <= rightNum) {
      images[counter] = left[i];
      i++;
    } else {
      images[counter] = right[j];
      j++;
    }

    counter++;
  }

  while(i < leftLength) {
    images[counter] = left[i];
    counter++;
    i++;
  }
  
  while(j < rightLength) {
    images[counter] = right[j];
    counter++;
    j++;
  }
}

export const getTechnologyName = (fileName) => {  
  let skillName = /[\d\w_]+(?=\.(svg|png|jpg))/.exec(fileName)[0];
  skillName = skillName.replace(/__/g, ' ');
  skillName = skillName.replace('_', '.');
  skillName = skillName.replace('Sharp', '#');

  return skillName;
}

// APP UTILITY
export const splitPathname = (pathname) => {
  if(pathname === '/') return ['landing'];

  const regex = /[^/]+/g;
  return pathname.match(regex);
};

// ROUTE ANIMATION DICTIONARY
export const routeAnimationStyle = (from, to) => {
  const dictFromTo = {
    landing: {
      portfolio: {
        leave: 'leaveTop', 
        appear: 'appearBottom'
      },
      about: {
        leave: 'leaveOut', 
        appear: 'appearOut'
      }
    },
    portfolio: {
      landing: {
        leave: 'leaveBottom', 
        appear: 'appearTop'
      },
      about: {
        leave: 'leaveOut', 
        appear: 'appearOut'
      }
    },
    about: {
      [to]: {
        leave: 'leaveIn', 
        appear: 'appearIn'
      },
    }
  };
  
  return dictFromTo[from][to];
};

export const projectAnimationStyle = (from, to, scrollDir) => {
  const fromWord  = numToWord(from);
  const toWord    = numToWord(to);

  const dictFromTo = {
    one: {
      two: {
        [scrollDir]: {
          leave: 'leaveLeft', 
          appear: 'appearRight'
        }
      },
      three: {
        [scrollDir]: {
          leave: 'leaveLeft', 
          appear: 'appearRight'
        }
      },
      four:{
        down: {
          leave: 'leaveLeft',
          appear: 'appearRight'
        },
        up: {
          leave: 'leaveRight', 
          appear: 'appearLeft'
        }
      }
    },
    two: {
      one: {
        [scrollDir]: {
          leave: 'leaveRight', 
          appear: 'appearLeft'
        }
      },
      three: {
        [scrollDir]: {
          leave: 'leaveLeft', 
          appear: 'appearRight'
        }
      },
      four: {
        [scrollDir]: {
          leave: 'leaveLeft', 
          appear: 'appearRight'
        }
      }
    },
    three: {
      one: {
        [scrollDir]: {
          leave: 'leaveRight', 
          appear: 'appearLeft'
        }
      },
      two: {
        [scrollDir]: {
          leave: 'leaveRight', 
          appear: 'appearLeft'
        }
      },
      four: {
        [scrollDir]: {
          leave: 'leaveLeft', 
          appear: 'appearRight'
        }
      }
    },
    four: {
      one: {
        up: {
          leave: 'leaveRight', 
          appear: 'appearLeft'
        },
        down: {
          leave: 'leaveLeft', 
          appear: 'appearRight'
        }
      },
      two: {
        [scrollDir]: {
          leave: 'leaveRight', 
          appear: 'appearLeft'
        }
      },
      three: {
        [scrollDir]: {
          leave: 'leaveRight', 
          appear: 'appearLeft'
        }
      }
    }
  };
  
  if(fromWord && toWord && fromWord !== toWord) {
    return dictFromTo[fromWord][toWord][scrollDir];
  }

  return null;
};

const numToWord = function(num) {
  switch(+num) {
    case 1:
      return 'one';
    case 2:
      return 'two';
    case 3:
      return 'three';
    case 4:
      return 'four';
    case 5:
      return 'five';
    default:
      return null;
  }
};