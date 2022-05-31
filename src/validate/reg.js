//【只能是数字】
export const number = /^[0-9]{1,}$/;
//【只能是字母】
export const letter = /^[a-zA-Z]{1,}$/;
//【只能是数字或字母】
export const letterOrNumber = /^[0-9a-zA-Z]{1,}$/;
//【必须同时包含大写字母、小写字母和数字】
export const letterAndNumber = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]*$/;
//【只能是数字、字母、下划线或其组合】
export const letterOrNumberOrUnderline = /^[0-9a-zA-Z_]{1,}$/;
//【只能是数字、字母、下划线、短横线或其组合】
export const letterOrNumberOrUnderlineOrShortline = /^[0-9a-zA-Z_-]*$/;
//【不能包含中文】
export const excludeChinese = /^[^\u4e00-\u9fa5]+$/;
//【只能包含中文】
export const onlyChinese = /^[\u4e00-\u9fa5]+$/;
//【自然数（0、正整数）】
export const nonnegativeInt = /^(0|\+?[1-9][0-9]*)$/;
//【正整数】
export const positiveInt = /^[1-9]\d*$/;
//【不能输入负数，小数最多两位】
export const nonnegativeNumberMaxTwoDecimal = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
//【手机电话号码（11位）】
export const mobilePhoneNumber = /^1[1|2|3|4|5|6|7|8|9][0-9]{9}$/;
//【国内座机电话】
export const landlineTelephone = /\d{3}-\d{8}|\d{4}-\d{7}/;
//【电话格式(手机和座机)】
export const telephone = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
//【email地址】
export const email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
//【身份证号(18位)，最后一位是校验位，可能为数字或字符X】
export const IDCard = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/
//【QQ号】
export const QQ = /^[1-9]*[1-9][0-9]*$/;
//【微信号，6至20位，以字母开头，字母，数字，减号，下划线】
export const wechat = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
//【中国邮政编码】
export const postCode = /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/;
//判断 一个链接是否有效合法 , 正则表达式判断http：//    https：//  为合法
export const networkLink = new RegExp('(http|https)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]');

