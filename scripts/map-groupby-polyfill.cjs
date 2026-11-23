if (typeof Map.groupBy !== "function") {
  Object.defineProperty(Map, "groupBy", {
    configurable: true,
    writable: true,
    value(items, callbackFn) {
      if (typeof callbackFn !== "function") {
        throw new TypeError("Map.groupBy callback must be a function");
      }

      const groups = new Map();
      let index = 0;

      for (const item of items) {
        const key = callbackFn(item, index++);
        const group = groups.get(key);
        if (group) {
          group.push(item);
        } else {
          groups.set(key, [item]);
        }
      }

      return groups;
    },
  });
}
