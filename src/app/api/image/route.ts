import sharp from 'sharp';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from "fs";

// XML escape function to handle special characters
const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

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

    const svgOverlay = (width: number, height: number, x: number, y: number) => {
      // Escape the referral code to prevent XML parsing errors
      const escapedReferralCode = escapeXml(referralCode);
      
      return `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700&amp;display=swap');
              .title {
                fill: #fcd34d;
                font-size: 45px;
                font-weight: 700;
                font-family: 'Inter', sans-serif;
                text-anchor: middle;
                dominant-baseline: middle;
              }
            </style>
          </defs>
          <text x="${x}" y="${y}" class="title">${escapedReferralCode}</text>
        </svg>
      `;
    };

    const linkedinProcessedBuffer = await sharp(linkedinImageBuffer)
      .composite([{ input: Buffer.from(svgOverlay(linkedinWidth, linkedinHeight, linkedinX, linkedinY)), top: 0, left: 0 }])
      .png()
      .toBuffer();

    // Process Instagram image
    const instaImageBuffer = fs.readFileSync(instaImagePath);
    const instaMetadata = await sharp(instaImageBuffer).metadata();
    const { width: instaWidth = 800, height: instaHeight = 600 } = instaMetadata;
    const instaX = instaWidth * 0.67;
    const instaY = instaHeight * 0.75;

    const instaProcessedBuffer = await sharp(instaImageBuffer)
      .composite([{ input: Buffer.from(svgOverlay(instaWidth, instaHeight, instaX, instaY)), top: 0, left: 0 }])
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