import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { secret } = body;

    // Verify secret to prevent unauthorized revalidation
    if (secret !== process.env.CMS_INTEGRATION_KEY) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    // Revalidate all common paths that use header/footer/navigation data
    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidatePath("/blogs");
    revalidatePath("/contact");
    revalidatePath("/faq");

    return NextResponse.json({ revalidated: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Revalidation failed", message: err.message },
      { status: 500 }
    );
  }
}
