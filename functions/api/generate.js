
export async function onRequestPost({ request, env }) {
  try {
    if (!env.AI) {
      return Response.json(
        { error: "AI binding 尚未啟用，請檢查 Cloudflare 設定。" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const image = body.image;
    const people = body.people || "1";
    const style = body.style || "natural";
    const pose = body.pose || "自然站立";

    if (!image || typeof image !== "string") {
      return Response.json(
        { error: "請先上傳景點照片。" },
        { status: 400 }
      );
    }

    const match = image.match(
      /^data:image\/(jpeg|png|webp);base64,(.+)$/
    );

    if (!match) {
      return Response.json(
        { error: "照片格式請使用 JPG、PNG 或 WebP。" },
        { status: 400 }
      );
    }

    const base64 = match[2];

    if (base64.length > 7000000) {
      return Response.json(
        { error: "照片太大，請先縮小照片再上傳。" },
        { status: 413 }
      );
    }

    const prompt =
      "Photorealistic travel portrait photography. " +
      "Preserve the original landmark, architecture, " +
      "background and scenery as much as possible. " +
      "Add " + people + " adult fictional tourist person(s), " +
      "with realistic human proportions. " +
      "Pose: " + pose + ". " +
      "Style: " + style + ". " +
      "Natural lighting, realistic photography.";

    const result = await env.AI.run(
      "@cf/runwayml/stable-diffusion-v1-5-img2img",
      {
        prompt,
        image_b64: base64,
        strength: 0.35,
        guidance: 7.5,
        num_steps: 20,
        negative_prompt:
          "cartoon, illustration, distorted body, " +
          "extra limbs, extra fingers, blurry, low quality"
      }
    );

    return new Response(result, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store"
      }
    });

  } catch (error) {
    return Response.json(
      { error: "圖片生成失敗：" + error.message },
      { status: 500 }
    );
  }
}
