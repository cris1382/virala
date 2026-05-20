import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

interface FalImageResult {
  images: Array<{ url: string; width: number; height: number }>;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  const imageSize =
    typeof body.imageSize === "string" ? body.imageSize : "landscape_4_3";

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Create pending generation record
  const { data: generation, error: insertError } = await adminClient
    .from("generations")
    .insert({
      user_id: user.id,
      type: "image",
      prompt,
      status: "pending",
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to create generation record" },
      { status: 500 }
    );
  }

  try {
    fal.config({ credentials: process.env.FAL_KEY });

    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt,
        image_size: imageSize,
        num_images: 1,
        num_inference_steps: 28,
        enable_safety_checker: true,
      },
    });

    const imageUrl = (result.data as FalImageResult).images?.[0]?.url;

    if (!imageUrl) {
      throw new Error("No image URL in response");
    }

    await adminClient
      .from("generations")
      .update({ result_url: imageUrl, status: "completed" })
      .eq("id", generation.id);

    return NextResponse.json({
      imageUrl,
      generationId: generation.id,
    });
  } catch (err) {
    await adminClient
      .from("generations")
      .update({ status: "failed" })
      .eq("id", generation.id);

    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
