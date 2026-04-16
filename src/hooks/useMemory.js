import { useState, useCallback } from 'react';
import useStore from '../store/useStore';
import { MemoryLayer } from '../memory/MemoryLayer';

export function useMemory(namespace) {
  const health = useStore(s => s.memoryHealth[namespace]);
  const [data, setData] = useState(() => MemoryLayer.getNamespaceData(namespace));

  const read = useCallback((query) => MemoryLayer.read(namespace, query), [namespace]);
  const write = useCallback((key, value, metadata) => {
    MemoryLayer.write(namespace, key, value, metadata);
    setData(MemoryLayer.getNamespaceData(namespace));
  }, [namespace]);
  const search = useCallback((query) => MemoryLayer.search(query, [namespace]), [namespace]);

  return { data, health, read, write, search };
}
