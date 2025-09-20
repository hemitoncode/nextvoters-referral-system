import sharp from 'sharp';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from "fs";

export async function POST(req: NextRequest) {
  const { referralCode } = await req.json();
  
  if (!referralCode) {
    return NextResponse.json({ error: 'Missing referralCode in request body.' }, { status: 400 });
  }

  const linkedinImagePath = path.join(process.cwd(), 'public', "referral-graphic.png");
  const instaImagePath = path.join(process.cwd(), 'public', "referral-graphic-small.png");

  try {
    // Check if both files exist
    if (!fs.existsSync(linkedinImagePath) || !fs.existsSync(instaImagePath)) {
      return NextResponse.json({ error: 'Base image files are missing on the server.' }, { status: 500 });
    }

    // Process LinkedIn image
    const linkedinImageBuffer = fs.readFileSync(linkedinImagePath);
    const linkedinMetadata = await sharp(linkedinImageBuffer).metadata();
    const { width: linkedinWidth = 800, height: linkedinHeight = 600 } = linkedinMetadata;

    const linkedinX = linkedinWidth * 0.6215;
    const linkedinY = linkedinHeight * 0.88;

    const linkedinSvgOverlay = `
      <svg width="${linkedinWidth}" height="${linkedinHeight}" viewBox="0 0 ${linkedinWidth} ${linkedinHeight}" xmlns="http://www.w3.org/2000/svg">
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
        <text x="${linkedinX}" y="${linkedinY}" class="title">${referralCode}</text>
      </svg>
    `;

    const linkedinProcessedBuffer = await sharp(linkedinImageBuffer)
      .composite([{ input: Buffer.from(linkedinSvgOverlay), top: 0, left: 0 }])
      .png()
      .toBuffer();

    // Process Instagram image
    const instaImageBuffer = fs.readFileSync(instaImagePath);
    const instaMetadata = await sharp(instaImageBuffer).metadata();
    const { width: instaWidth = 800, height: instaHeight = 600 } = instaMetadata;

    const instaX = instaWidth * 0.67;
    const instaY = instaHeight * 0.75;

    const instaSvgOverlay = `
      <svg width="${instaWidth}" height="${instaHeight}" viewBox="0 0 ${instaWidth} ${instaHeight}" xmlns="http://www.w3.org/2000/svg">
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
        <text x="${instaX}" y="${instaY}" class="title">${referralCode}</text>
      </svg>
    `;

    const instaProcessedBuffer = await sharp(instaImageBuffer)
      .composite([{ input: Buffer.from(instaSvgOverlay), top: 0, left: 0 }])
      .png()
      .toBuffer();

    // Return both images as base64 encoded strings
    const linkedinBase64 = linkedinProcessedBuffer.toString('base64');
    const instaBase64 = instaProcessedBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      images: {
        linkedin: {
          data: `data:image/png;base64,${linkedinBase64}`,
          filename: `referral-linkedin-${referralCode}.png`
        },
        instagram: {
          data: `data:image/png;base64,${instaBase64}`,
          filename: `referral-instagram-${referralCode}.png`
        }
      }
    });

  } catch (error) {
    console.error('Error processing images:', error);
    return NextResponse.json({
      error: 'An error occurred while processing the images.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}