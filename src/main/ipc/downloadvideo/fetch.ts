import axios from "axios";

export async function requestDouyinVideoInfo(url: string) {
  const headers = {
    accept: "/",
    "accept-language": "zh-CN,zh;q=0.9",
    "content-type": "application/json;charset=UTF-8",
    origin: "http://127.0.0.1:3000",
    referer: "https://www.douyin.com/",
    "sec-ch-ua": '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
    "sec-ch-ua-mobile": " ?0",
    "sec-ch-ua-platform": "Windows",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
  };

  const res = await axios({
    url,
    headers: headers,
    adapter: require("axios/lib/adapters/http"),
  });

  const mid = await douYinVideoMid(res.request.path);

  if (mid === "") return;

  const { data } = await axios({
    url: "https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/",
    headers: headers,
    params: {
      item_ids: mid,
    },
    adapter: require("axios/lib/adapters/http"),
  });

  return data;
}

function douYinVideoMid(reqpath: string) {
  return new Promise((resolve, reject) => {
    const startstr = "/video/";
    const len = startstr.length;

    const index = reqpath.indexOf(startstr);
    if (index > -1) {
      const startindex = index + len;
      const endindex = reqpath.indexOf("?");
      resolve(reqpath.substring(startindex, endindex));
    } else {
      console.log("没有找到" + startstr + "开始索引");
      reject("");
    }
  });
}
