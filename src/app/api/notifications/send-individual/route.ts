import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, title, message } = await req.json();

    // Validate required fields
    if (!email || !title || !message) {
      return NextResponse.json(
        { message: 'Email, title and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Here you would implement your backend notification logic
    // For example, sending to Firebase Cloud Messaging or your own notification service
    console.log('Sending individual notification:', {
      email,
      title,
      message
    });

    // For now, we'll just return a success response
    return NextResponse.json({
      message: 'Individual notification sent successfully',
      data: {
        email,
        title,
        message,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error sending individual notification:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 