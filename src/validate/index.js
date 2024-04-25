import {
  positiveInt,
  letterOrNumber,
  IDCard,
  mobilePhoneNumber,
  email, networkLink,
} from './reg'

let validate = {};
/*
* 校验字段非空
* */
validate.NotNull = ({name, trigger, isRequired = true}) => {
  return {
    required: isRequired,
    trigger: trigger || 'blur',
    validator: (rule, value, callback) => {
      if (!value) {
        callback(new Error(name + '不能为空'));
      } else if (Array.isArray(value) && !value.length) {
        callback(new Error(name + '不能为空'));
      } else {
        callback();
      }
    },
  }
}

/*校验字母和数字*/
validate.StringAndNumber = ({name, trigger, isRequired = true}) => {
  return {
    required: isRequired,
    trigger: trigger || "blur",
    validator: (rule, value, callback) => {
      if (value && (!letterOrNumber.test(value))) {
        callback(new Error(name + '有误'));
      } else {
        callback();
      }
    },
  }
}
/*校验是否为数字*/
validate.isNumber = ({name, trigger, isRequired = true}) => {
  return {
    required: isRequired,
    trigger: trigger || "blur",
    validator: (rule, value, callback) => {
      if (value && (isNaN(value))) {
        callback(new Error('请输入正确的数字'));
      } else {
        callback();
      }
    },
  }
}
/*校验正整数*/
validate.PositiveInt = ({name, trigger, isRequired = true}) => {
  return {
    required: isRequired,
    trigger: trigger || "blur",
    validator: (rule, value, callback) => {
      if (value && (!positiveInt.test(value))) {
        callback(new Error(name + '不是正整数'));
      } else {
        callback();
      }
    },
  }
}
/*校验身份证18位*/
validate.IdentityNumber = ({name, trigger, isRequired = true}) => {
  return {
    required: isRequired,
    trigger: trigger || "blur",
    validator: (rule, value, callback) => {
      if (value && (!IDCard.test(value))) {
        callback(new Error(name + '有误'));
      } else {
        callback();
      }
    },
  }
}
/*校验手机号*/
validate.Phone = ({name, trigger, isRequired = true}) => {
  return {
    required: isRequired,
    trigger: trigger || "blur",
    validator: (rule, value, callback) => {
      if (value && (!mobilePhoneNumber.test(value))) {
        callback(new Error(name + '有误'));
      } else {
        callback();
      }
    },
  }
}
/*校验邮箱号*/
validate.Email = ({name, trigger, isRequired = true}) => {
  return {
    required: isRequired,
    trigger: trigger || "blur",
    validator: (rule, value, callback) => {
      if (value && (!email.test(value))) {
        callback(new Error(name + '有误'));
      } else {
        callback();
      }
    },
  }
}
/*校验网址*/
validate.networkLink = ({trigger, isRequired = true}) => {
  return {
    required: isRequired,
    trigger: trigger || "blur",
    validator: (rule, value, callback) => {
      if (value && (!networkLink.test(value))) {
        callback(new Error(`请输入'http://' 或 'https://' 为开头的链接地址`));
      } else {
        callback();
      }
    },
  }
}
/*校验字体长度*/
validate.Len = ({name, trigger, isRequired = true, minLen, maxLen}) => {
  return {
    required: isRequired,
    trigger: trigger || "blur",
    validator: (rule, value, callback) => {
      if ((value.length < minLen) || (value.length > maxLen)) {
        callback(new Error(`${name}在${minLen}~${maxLen}之间`));
      } else {
        callback();
      }
    },
  }
}

export default validate
