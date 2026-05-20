import { NextRequest, NextResponse } from "next/server";
import RunwayML from "@runwayml/sdk";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const POLL_INTERVAL_MS = 5000;
const MAX_WAIT_MS = 3 * 60 * 1000; // 3 minutes

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
  const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
  const duration = body.duration === 10 ? 10 : 5;
  const ratio =
    typeof body.ratio === "string" ? body.ratio : "1280:768";

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }
  if (!imageUrl) {
    return NextResponse.json(
      { error: "An image URL is required for video generation" },
      { status: 400 }
    );
  }

  const adminClient = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: generation, error: insertError } = await adminClient
    .from("generations")
    .insert({
      user_id: user.id,
      type: "video",
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
    const runway = new RunwayML({
      apiKey: process.env.RUNWAYML_API_KEY,
    });

    const task = await runway.imageToVideo.create({
      model: "gen3a_turbo",
      promptImage: imageUrl,
      promptText: prompt,
      duration,
      ratio: ratio as "1280:768" | "768:1280" | undefined,
    });

    const startTime = Date.now();

    while (Date.now() - startTime < MAX_WAIT_MS) {
      await new Promise<void>((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      const currentTask = await runway.tasks.retrieve(task.id);

      if (currentTask.status === "SUCCEEDED") {
        const videoUrl = currentTask.output?.[0] ?? null;

        if (!videoUrl) {
          throw new Error("No video URL in completed task");
        }

        await adminClient
          .from("generations")
          .update({ result_url: videoUrl, status: "completed" })
          .eq("id", generation.id);

        return NextResponse.json({
          videoUrl,
          generationId: generation.id,
        });
      }

      if (
        currentTask.status === "FAILED" ||
        currentTask.status === "CANCELLED"
      ) {
        throw new Error(`Runway task ${currentTask.status.toLowerCase()}`);
      }
    }

    throw new Error("Video generation timed out after 3 minutes");
  } catch (err) {
    await adminClient
      .from("generations")
      .update({ status: "failed" })
      .eq("id", generation.id);

    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}