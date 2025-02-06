import { NextResponse } from 'next/server';

type UserSegment = 'chew' | 'doctor' | 'patient';

export async function POST(req: Request) {
  try {
    const { segment, title, message } = await req.json();

    // Validate segment
    if (!['chew', 'doctor', 'patient'].includes(segment)) {
      return NextResponse.json(
        { message: 'Invalid user segment' },
        { status: 400 }
      );
    }

    // Here you would implement your backend notification logic
    // For example, sending to Firebase Cloud Messaging or your own notification service
    console.log('Sending notification:', {
      segment,
      title,
      message
    });

    // For now, we'll just return a success response
    return NextResponse.json({
      message: 'Notification sent successfully',
      data: {
        segment,
        title,
        message,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 