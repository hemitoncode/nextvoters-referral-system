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

    // Escape HTML entities in referral code
    const escapeHtml = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const escapedReferralCode = escapeHtml(referralCode);

    // Process LinkedIn image
    const linkedinImageBuffer = fs.readFileSync(linkedinImagePath);
    const linkedinMetadata = await sharp(linkedinImageBuffer).metadata();
    const { width: linkedinWidth = 800, height: linkedinHeight = 600 } = linkedinMetadata;
    
    // Calculate position (convert percentage to pixels)
    const linkedinX = Math.round(linkedinWidth * 0.6215);
    const linkedinY = Math.round(linkedinHeight * 0.88);

    // Create SVG with explicit dimensions and positioning
    const linkedinSvg = `<svg width="${linkedinWidth}" height="${linkedinHeight}" xmlns="http://www.w3.org/2000/svg">
      <text x="${linkedinX}" y="${linkedinY}" 
            fill="#fcd34d" 
            font-size="45" 
            font-family="Arial" 
            font-weight="bold" 
            text-anchor="middle" 
            alignment-baseline="middle">${escapedReferralCode}</text>
    </svg>`;

    console.log('LinkedIn SVG:', linkedinSvg); // Debug log

    const linkedinProcessedBuffer = await sharp(linkedinImageBuffer)
      .composite([{
        input: Buffer.from(linkedinSvg),
        top: 0,
        left: 0
      }])
      .png()
      .toBuffer();

    // Process Instagram image
    const instaImageBuffer = fs.readFileSync(instaImagePath);
    const instaMetadata = await sharp(instaImageBuffer).metadata();
    const { width: instaWidth = 800, height: instaHeight = 600 } = instaMetadata;
    
    const instaX = Math.round(instaWidth * 0.67);
    const instaY = Math.round(instaHeight * 0.75);

    const instaSvg = `<svg width="${instaWidth}" height="${instaHeight}" xmlns="http://www.w3.org/2000/svg">
      <text x="${instaX}" y="${instaY}" 
            fill="#fcd34d" 
            font-size="45" 
            font-family="Arial" 
            font-weight="bold" 
            text-anchor="middle" 
            alignment-baseline="middle">${escapedReferralCode}</text>
    </svg>`;

    console.log('Instagram SVG:', instaSvg); // Debug log

    const instaProcessedBuffer = await sharp(instaImageBuffer)
      .composite([{
        input: Buffer.from(instaSvg),
        top: 0,
        left: 0
      }])
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