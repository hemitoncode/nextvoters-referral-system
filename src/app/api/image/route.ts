import sharp from 'sharp';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from "fs";

export async function POST(req: NextRequest) {
  const { referralCode, type } = await req.json();
  
  if (!referralCode || !type) {
    return NextResponse.json({ error: 'Missing referralCode or type in request body.' }, { status: 400 });
  }

  const imagePath = path.join(process.cwd(), 'public', type === "insta" ? "referral-graphic-small.png" : "referral-graphic.png");
  
  try {
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json({ error: `Image file not found: ${imagePath}` }, { status: 404 });
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const metadata = await sharp(imageBuffer).metadata();
    const { width = 800, height = 600 } = metadata;

    const x = type === "insta" ? width * 0.67 : width * 0.6125;  
    const y = type === "insta" ? height * 0.75 : height * 0.88; 

    const svgOverlay = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <style>
          .title {
            fill: #fcd34d;
            font-size: 45px;
            font-weight: bold;
            font-family: Arial, sans-serif;
            text-anchor: middle;
            dominant-baseline: middle;
          }
        </style>
        <text x="${x}" y="${y}" class="title">${referralCode}</text>
      </svg>
    `;

    const processedImageBuffer = await sharp(imageBuffer)
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .png()
      .toBuffer();

    return new NextResponse(processedImageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="referral-${referralCode}.png"`,
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json({ 
      error: 'An error occurred while processing the image.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
