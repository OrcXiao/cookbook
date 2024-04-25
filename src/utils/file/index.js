/** 文件相关 */
import { fileTempleteDown } from "@/api/File.js";

/** fileHelper
 * 文件下载
 */
export const fileCommonDown = (type, name = "模板.xlsx", handler = null) => {
  return new Promise((resolve, reject) => {
    let ajax = handler ? handler : fileTempleteDown(type);
    ajax
      .then((res) => {
        if (+res.status === 200) {
          const link = document.createElement("a");
          const blob = new Blob([res.data]);
          const reader = new FileReader();
          reader.readAsText(blob);
          reader.onload = (e) => {
            const res = e.target.result;
            try {
              const json = JSON.parse(res);
              if (json) {
                // 解析成功说明后端导出出错，进行导出失败的操作，并直接返回
                return reject();
              }
            } catch (err) {
              reject();
            }
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            link.download = name;
            link.click();
            window.URL.revokeObjectURL(url);
            resolve();
          };
        } else {
          reject();
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
