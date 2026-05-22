import { db } from "@/configs/db";
import { websitesTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const {
      domain,
      timezone,
      enableLocalhostTracking,
    } = await req.json();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const esxitingDomain = await db.select().from(websitesTable).where(
      (eq(websitesTable.domain, domain))
    )

    if (esxitingDomain.length > 0) {
      return NextResponse.json(
        { message: "Domain already exists" },
        { status: 400 }
      )
    }

    const result = await db.insert(websitesTable)
      .values({
        domain,
        timezone,
        enableLocalhostTracking,
        userEmail: user?.primaryEmailAddress?.emailAddress as string,
      })
      .returning();

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("DB Error:", JSON.stringify(error, null, 2));

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};