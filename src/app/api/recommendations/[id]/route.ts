import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = (await request.json()) as { status: string };
  if (!["pendente", "em_andamento", "concluida"].includes(body.status)) {
    return NextResponse.json({ error: "Status inválido." }, { status: 400 });
  }

  // ownership via join implícito pela RLS
  const { data, error } = await supabase
    .from("recommendations")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, data });
}
