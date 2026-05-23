import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('url');
  const filename = searchParams.get('filename') ?? 'download';

  if (!fileUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }


  let parsed: URL;
  try {
    parsed = new URL(fileUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return NextResponse.json({ error: 'Unsupported protocol' }, { status: 400 });
  }

  try {
    const upstream = await fetch(fileUrl, {

      headers: { 'User-Agent': 'Maxtronize/1.0' },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream responded with ${upstream.status}` },
        { status: upstream.status },
      );
    }

    const contentType =
      upstream.headers.get('Content-Type') ?? 'application/octet-stream';

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        ...(upstream.headers.get('Content-Length')
          ? { 'Content-Length': upstream.headers.get('Content-Length')! }
          : {}),
      },
    });
  } catch (err) {
    console.error('[download proxy] fetch failed', err);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 502 });
  }
}
