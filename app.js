const photo = document.getElementById("photo");
const preview = document.getElementById("preview");
const recommend = document.getElementById("recommend");
const result = document.getElementById("result");

photo.addEventListener("change", function () {
  const file = photo.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    preview.innerHTML = "";

    const img = document.createElement("img");
    img.src = event.target.result;

    preview.appendChild(img);
  };

  reader.readAsDataURL(file);
});

const poses = {
  natural: {
    1: [
      "自然站立，身體微側，眼睛看向遠方。",
      "一手輕撥頭髮，另一手自然垂放。",
      "慢慢向前走，攝影師捕捉自然瞬間。"
    ],
    2: [
      "兩人並肩站立，自然交談。",
      "一人看鏡頭，另一人看向對方。",
      "兩人邊走邊聊天，捕捉互動。"
    ],
    3: [
      "三人自然並排，稍微錯開前後位置。",
      "大家一起看向同一個方向。",
      "自然聊天或一起向前走。"
    ]
  },
  fashion: {
    1: [
      "身體側轉約45度，一腳稍微向前。",
      "一手叉腰，另一手自然擺放。",
      "背對鏡頭再回頭，營造時尚感。"
    ],
    2: [
      "兩人前後錯位，呈現層次感。",
      "一人站立，另一人稍微側身。",
      "兩人保持距離，利用姿態形成構圖。"
    ],
    3: [
      "三人採高低錯落站位。",
      "中間人物向前，兩側稍微後退。",
      "三人分別採不同方向的身體角度。"
    ]
  }
};

recommend.addEventListener("click", function () {
  const style = document.getElementById("style").value;
  const people = document.getElementById("people").value;
  const place = document.getElementById("place").value;

  const suggestions = poses[style][people];

  const advice = suggestions
    .map((pose, index) => `${index + 1}. ${pose}`)
    .join("\n");

  result.textContent =
    `拍攝場景：${place}\n` +
    `拍攝人數：${people}人\n\n` +
    `建議姿勢：\n${advice}\n\n` +
    `攝影小提醒：\n` +
    `注意人物與背景的比例，避免人物被背景中的物體切割。`;
});
