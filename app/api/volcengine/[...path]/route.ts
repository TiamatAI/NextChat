import { VOLCENGINE_BASE_URL, VolcEngine } from "@/app/constant";
import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";

const ALLOWD_PATH = new Set(Object.values([VolcEngine.ChatPath]));

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("🌋🌋🌋");
  console.log("[VolcEngine Route] params ", params);
  const controller = new AbortController();

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }

  const subpath = params.path.join("/");

  if (!ALLOWD_PATH.has(subpath)) {
    console.log("[VolcEngine Route] forbidden path ", subpath);
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + subpath,
      },
      {
        status: 403,
      },
    );
  }

  // const authResult = auth(req, ModelProvider.GPT);
  // if (authResult.error) {
  //   return NextResponse.json(authResult, {
  //     status: 401,
  //   });
  // }
  const timeoutId = setTimeout(
    () => {
      controller.abort();
    },
    10 * 60 * 1000,
  );

  let baseUrl = VOLCENGINE_BASE_URL;
  let path = `${req.nextUrl.pathname}`.replaceAll("/api/volcengine/", "");
  const fetchUrl = `${baseUrl}/${path}`;
  console.log("[VolcEngine Route] fetchUrl ", fetchUrl);

  const fetchOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      Authorization: req.headers.get("Authorization") ?? "",
    },
    method: req.method,
    body: req.body,
    redirect: "manual",
    // @ts-ignore
    duplex: "half",
    signal: controller.signal,
  };
  try {
    const res = await fetch(fetchUrl, fetchOptions);
    // to prevent browser prompt for credentials
    const newHeaders = new Headers(res.headers);
    newHeaders.delete("www-authenticate");
    // to disable nginx buffering
    newHeaders.set("X-Accel-Buffering", "no");

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: newHeaders,
    });
  } catch (e) {
    console.error("[VolcEngine] ", e);
    return NextResponse.json(prettyObject(e));
  } finally {
    clearTimeout(timeoutId);
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";
export const preferredRegion = [
  "arn1",
  "bom1",
  "cdg1",
  "cle1",
  "cpt1",
  "dub1",
  "fra1",
  "gru1",
  "hnd1",
  "iad1",
  "icn1",
  "kix1",
  "lhr1",
  "pdx1",
  "sfo1",
  "sin1",
  "syd1",
];
