import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { segment, title, message } = await req.json();

    // Map segment to OneSignal segment names
    const segmentName = {
      chew: 'Subscribed CHEWs',
      doctor: 'Subscribed Doctors',
      patient: 'Subscribed Patients'
    }[segment];

    if (!segmentName) {
      return NextResponse.json(
        { message: 'Invalid user segment' },
        { status: 400 }
      );
    }

    const notification = {
      app_id: process.env.ONESIGNAL_APP_ID,
      included_segments: [segmentName],
      contents: {
        en: message
      },
      headings: {
        en: title
      },
      // You can add more options here like:
      // chrome_web_icon: "path_to_icon",
      // url: "url_to_open_on_click",
      // buttons: [{id: "id1", text: "button1"}, {id: "id2", text: "button2"}]
    };

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notification)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0] || 'Failed to send notification');
    }

    return NextResponse.json({
      message: 'Notification sent successfully',
      data: data
    });
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 