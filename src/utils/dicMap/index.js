import store from "@/store";

/** 通过key查询类型表 */
export const getDicTypeValue = (key, refresh = false) => {
  if (store.getters.dicHashMap && store.getters.dicHashMap[key] && !refresh) {
    return Promise.resolve(store.getters.dicHashMap[key]);
  } else {
    return store
      .dispatch("dictionaries/ac_getDic", key)
      .then((res) => {
        return Promise.resolve(res);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
};
