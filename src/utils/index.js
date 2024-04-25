
/**
 * @description {常用工具函数}
 */
import {
  MessageBox
} from "element-ui";
/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function () {
    context = this;
    args = arguments;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 *
 * 对象数据筛选
 * @export {object}
 */
export function pick(model) {
  let arg = [...arguments];
  let res = {};
  for (let key in model) {
    if (arg.indexOf(key) > -1) {
      res[key] = model[key];
    }
  }
  return res;
}

/**
 *
 * 返回类型
 * @export
 * @param {any} target
 * @return {type}
 */
export function checkType(target) {
  return Object.prototype.toString.call(target).slice(8, -1);
}

/**
 * 深拷贝 deepClone
 * @export
 * @param {*} target
 */
export function deepClone(target) {
  var type = checkType(target);
  var result;

  if (type === "Object") {
    result = {};
  } else if (type === "Array") {
    result = [];
  } else {
    return target;
  }
  for (let key in target) {
    if (
      checkType(target[key]) === "Object" ||
      checkType(target[key]) === "Array"
    ) {
      result[key] = deepClone(target[key]);
    } else {
      result[key] = target[key];
    }
  }
  return result;
}

/**
 * 对象转url参数
 * @param {*} data,对象
 * @param {*} isPrefix,是否自动加上"?"
 */
export function queryParams(
  data = {},
  isPrefix = true,
  arrayFormat = "brackets"
) {
  let prefix = isPrefix ? "?" : "";
  let _result = [];
  if (["indices", "brackets", "repeat", "comma"].indexOf(arrayFormat) == -1)
    arrayFormat = "brackets";
  for (let key in data) {
    let value = data[key];
    // 去掉为空的参数
    if (["", undefined, null].indexOf(value) >= 0) {
      continue;
    }
    // 如果值为数组，另行处理
    if (value.constructor === Array) {
      // e.g. {ids: [1, 2, 3]}
      switch (arrayFormat) {
        case "indices":
          // 结果: ids[0]=1&ids[1]=2&ids[2]=3
          for (let i = 0; i < value.length; i++) {
            _result.push(key + "[" + i + "]=" + value[i]);
          }
          break;
        case "brackets":
          // 结果: ids[]=1&ids[]=2&ids[]=3
          value.forEach((_value) => {
            _result.push(key + "[]=" + _value);
          });
          break;
        case "repeat":
          // 结果: ids=1&ids=2&ids=3
          value.forEach((_value) => {
            _result.push(key + "=" + _value);
          });
          break;
        case "comma":
          // 结果: ids=1,2,3
          var commaStr = "";
          value.forEach((_value) => {
            commaStr += (commaStr ? "," : "") + _value;
          });
          _result.push(key + "=" + commaStr);
          break;
        default:
          value.forEach((_value) => {
            _result.push(key + "[]=" + _value);
          });
        break;
      }
    } else {
      _result.push(key + "=" + value);
    }
  }
  return _result.length ? prefix + _result.join("&") : "";
}

/**
 * @export
 * @param {*} data 数据源
 * @param {string} [key=''] 去重的key 如果为空 默认去重该值
 * @return {*}
 */
export function setArr(data, key = "") {
  let keyMap = {};
  let source = [];
  data.forEach((item) => {
    if (!key) {
      if (!keyMap[item]) {
        source.push(item);
        keyMap[item] = true;
      }
    } else {
      if (!keyMap[item[key]]) {
        source.push(item);
        keyMap[item[key]] = true;
      }
    }
  });
  return source;
}

/**
 * @export 初始化树结构
 * @param {*} data 数据源
 * @param  {string} [pid='pid'] //父ID字段
 * @param  {string} [code='0'] //顶级节点 默认第一次为0
 * @param {string} child 子节点字段
 * @param {Function} itemFormat//数据处理 return { item }
 * @param {string} id 当前node的唯一id
 */
export function initTree(
  data,
  code = "0",
  itemFormat,
  pid = "pid",
  child = "children"
) {
  if (!Array.isArray(data)) {
    throw new Error("data must be Array");
  }
  let source = [...data];
  let result = [];
  source.forEach((item) => {
    if (item[pid] === code) {
      let obj = Object.assign({}, itemFormat ? itemFormat(item) : item);
      obj[child] = initTree(data, item.id);
      !obj[child].length && delete obj[child];
      result.push(obj);
    }
  });
  return result;
}



/**
 * 判断对象每一项值是否存在空值，true:存在 ，false: 不存在
 */
export function objectValueAllEmpty(object) {
  var isEmpty = false;
  Object.keys(object).forEach(function (x) {
    if (object[x] == "" || object[x] == null) {
      isEmpty = true;
      return;
    }
  });
  if (isEmpty) {
    return true;
  }
  return false;
}

/** 公用删除 */

export async function cookDelete({
  content = '是否确认删除',
  title = '提示',
  center = true,
  handler,
  success,
  fail
}) {
  MessageBox.confirm(content, title ,{
    confirmButtonText: '确认删除',
    cancelButtonText: '再想想',
    center
  }).then(async () => {
    try {
      let res = await handler
      success && success(res)
    } catch (err) {
      fail && fail(err)
    }
  }).catch(() => {

  })
}