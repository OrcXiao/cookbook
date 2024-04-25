import Moment from "moment";
/**
 * 公开 momentjs 库
 */
Moment.locale("zh-cn");
export const moment = Moment;
const defaultFormatter = "YYYY-MM-DD HH:mm:ss"; //默认时间格式
const formatErrorReplacement = "--";

/**
 * 将任意表示日期、时间的数据格式化为指定格式。
 * @see http://momentjs.cn/docs/#/displaying/format/
 * @param {Any} date 任何表示日期时间的日期、字符串或数字
 * @param {String?} formatter 格式化模板（见文档）
 * @param {String?} p3.replacement 格式化错误时的替代文本，传入该参数将覆盖全局设置
 * @param {Boolean} p3.ignoreCurrentYear 如果需格式化的日期与当前日期同年份，是否格式化结果不输出年份
 *        如：format('2020-01-01', 'YYYY/MM/DD', {ignoreCurrentYear: true}) // "01/01"
 * @returns {String}
 */
export function format(
  date,
  formatter = defaultFormatter,
  { replacement = formatErrorReplacement, ignoreCurrentYear = false } = {}
) {
  const m = moment(date);
  const isValid = m.isValid();
  if (!isValid) {
    return replacement;
  }
  if (ignoreCurrentYear && formatter && m.year() === new Date().getFullYear()) {
    formatter = formatter.replace(/Y+-?|-Y+/g, "");
  }
  return m.format(formatter);
}

/**
 * 获取相对于给定的 `referenceTime` 的时间的日历时间。
 * @param {String | Number | Date} time 时间
 * @param {any} referenceTime 相对时间，默认为`null`，即现在
 * @returns {String}
 */
export function calendar(time, referenceTime = null) {
  let md = null;
  if (typeof time === "number" && (time + "").length === 10) {
    md = moment.unix(time);
  } else {
    md = moment(time);
  }
  if (!md.isValid()) {
    return time;
  }
  return md.calendar(referenceTime, {
    sameDay: "HH:mm",
    nextDay: "[明天 ]HH:mm",
    nextWeek: "dddd",
    lastDay: "[昨天 ]HH:mm",
    lastWeek: "[上]dddd",
    sameElse(now) {
      if (this.year() === now.year()) {
        // return 'MM-DD HH:mm';
        return "MM-DD";
      }
      // return 'YYYY-MM-DD HH:mm';
      return "YYYY-MM-DD";
    },
  });
}

/**
 * @param {String} date 表示日期时间的日期、字符串或数字
 * @param {Boolean} isVa 转换是否成功
 * @param {String} type  'days' 'years'....
 * @returns {String} 返回传入时间间隔当前时间  列 1 天前 1小时前
 */

export function difDay(date, type) {
  const m = moment(date);
  const now = moment(new Date());
  const isVa = m.isValid();
  if (!isVa) {
    return "时间格式不匹配";
  } else {
    let diffDay = m.diff(now, type);
    return diffDay;
  }
}

export const ranges = {
  今天: () => [moment().startOf("day"), moment().endOf("day")],
  昨天: () => [
    moment()
      .startOf("day")
      .subtract(1, "days"),
    moment()
      .endOf("day")
      .subtract(1, "days"),
  ],
  本周: () => [
    moment(moment().week(moment().week()).startOf('week')),
    moment(moment().week(moment().week()).endOf('week')),
  ],
  上周: () =>[
    moment(moment().week(moment().week()-1).startOf('week')),
    moment(moment().week(moment().week()-1).endOf('week')),
  ],
  本月: () => [
    moment(moment().month(moment().month()).startOf('month')),
    moment(moment().month(moment().month()).endOf('month')),
  ],
  上月: () => [
    moment(moment().month(moment().month()-1).startOf('month')),
    moment(moment().month(moment().month()-1).endOf('month')),
  ],
  本季度 :() => [
    moment().startOf('quarter'),
    moment().endOf('quarter')
  ],
  上季度 :() => [
    moment().quarter(moment().quarter()-1).startOf('quarter'),
    moment().quarter(moment().quarter()-1).endOf('quarter'),
  ],
  本年: () => [
    moment(moment().year(moment().year()).startOf('year')),
    moment(moment().year(moment().year()).endOf('year')),
  ],
  去年: () => [
    moment(moment().year(moment().year()-1).startOf('year')),
    moment(moment().year(moment().year()-1).endOf('year')),
  ],
  // 最近三月: () => [
  //   moment()
  //     .startOf("day")
  //     .subtract(3, "months")
  //     .subtract(-1, "days"),
  //   moment(),
  // ],
};
