document.addEventListener("DOMContentLoaded", () => {
  const photoInput = document.getElementById("photo");
  const button = document.getElementById("recommend");
  const output = document.getElementById("aiPreview");

  if (!photoInput || !button || !output) return;

  button.addEventListener("click", async () => {
    const file = photoInput.files[0];

    if (!file) {
      output.textContent = "請先上傳景點照片。";
      return;
    }

    button.disabled = true;
    button.textContent = "AI 正在生成照片，請稍候…";
    output.textContent = "正在處理照片，請稍候。";

    try {
      const image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const people = document.getElementById("people").value;
      const style = document.getElementById("style").value;

      const response = await fetch("./api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image,
          people,
          style,
          pose: "自然站立，身體微側，面向鏡頭"
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "生成失敗");
      }

      const blob = await response.blob();
      const imageURL = URL.createObjectURL(blob);

      output.innerHTML = "";

      const title = document.createElement("h3");
      title.textContent = "AI 旅拍範例照片";

      const resultImage = document.createElement("img");
      resultImage.src = imageURL;
      resultImage.alt = "AI 生成的旅拍範例";
      resultImage.style.width = "100%";
      resultImage.style.borderRadius = "12px";

      output.append(title, resultImage);

    } catch (error) {
      output.textContent = "生成失敗：" + error.message;
    } finally {
      button.disabled = false;
      button.textContent = "推薦拍攝姿勢";
    }
  });
});
