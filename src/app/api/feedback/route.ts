import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = (await request.json()) as {
    analysis_id: string;
    rating: string;
    comment?: string;
  };

  if (!body.analysis_id || !["util", "parcial", "nao_util"].includes(body.rating)) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { error } = await supabase.from("analysis_feedback").upsert(
    {
      analysis_id: body.analysis_id,
      user_id: user.id,
      rating: body.rating,
      comment: body.comment || null,
    },
    { onConflict: "analysis_id,user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
