import { ImageResponse } from '@vercel/og';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from "fs";
import sharp from 'sharp';
import React from 'react';

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

    // Create text overlay using Vercel OG with React.createElement
    const createTextOverlay = async (text: string) => {
      const imageResponse = new ImageResponse(
        React.createElement(
          'div',
          {
            style: {
              width: '800px',
              height: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
            },
          },
          React.createElement(
            'span',
            {
              style: {
                fontSize: '45px',
                color: '#fcd34d',
                fontFamily: 'Arial, sans-serif',
              },
            },
            text
          )
        ),
        {
          width: 800,
          height: 100,
        }
      );
      
      return Buffer.from(await imageResponse.arrayBuffer());
    };

    // Process LinkedIn image
    const linkedinImageBuffer = fs.readFileSync(linkedinImagePath);
    const linkedinMetadata = await sharp(linkedinImageBuffer).metadata();
    const { width: linkedinWidth, height: linkedinHeight } = linkedinMetadata;
    
    const linkedinX = Math.round(linkedinWidth * 0.6280) - 400;
    const linkedinY = Math.round(linkedinHeight * 0.88) - 53;

    const textOverlayBuffer = await createTextOverlay(referralCode);

    const linkedinProcessedBuffer = await sharp(linkedinImageBuffer)
      .composite([{
        input: textOverlayBuffer,
        left: linkedinX,
        top: linkedinY
      }])
      .png()
      .toBuffer();

    // Process Instagram image
    const instaImageBuffer = fs.readFileSync(instaImagePath);
    const instaMetadata = await sharp(instaImageBuffer).metadata();
    const { width: instaWidth, height: instaHeight  } = instaMetadata;
    
    const instaX = Math.round(instaWidth * 0.6380) - 400;
    const instaY = Math.round(instaHeight * 0.75) - 53;

    const instaProcessedBuffer = await sharp(instaImageBuffer)
      .composite([{
        input: textOverlayBuffer,
        left: instaX,
        top: instaY
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