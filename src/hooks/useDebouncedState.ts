import { debounce, DebounceSettings } from 'lodash';
import { useCallback, useState } from 'react';

const useDebouncedState = <T>(
  curVal: T,
  updateFunc: (val: T) => void,
  wait: number,
  options?: DebounceSettings,
) => {
  const [val, setVal] = useState(curVal);

  const debounced = useCallback(debounce(updateFunc, wait, options), [curVal]);

  const updateVal = (newVal: React.SetStateAction<T>) => {
    setVal((prev) => (typeof newVal === 'function' ? (newVal as (prev: T) => T)(prev) : newVal));
    debounced(val);
  };

  return [val, updateVal];
};

export default useDebouncedState;
