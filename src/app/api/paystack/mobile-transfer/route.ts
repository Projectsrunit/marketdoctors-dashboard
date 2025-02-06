import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, recipient, reason } = body;

    // First, create a transfer recipient for mobile money
    const recipientResponse = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'mobile_money',
        name: recipient.name,
        email: 'noreply@marketdoctors.com', // You might want to use a real email
        mobile_number: recipient.phone,
        provider: 'mtn', // You can make this dynamic based on the phone number prefix
        currency: 'NGN'
      }),
    });

    const recipientData = await recipientResponse.json();
    if (!recipientResponse.ok) {
      return NextResponse.json(
        { message: recipientData.message || 'Failed to create mobile money recipient' },
        { status: recipientResponse.status }
      );
    }

    // Then initiate the transfer
    const transferResponse = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount,
        recipient: recipientData.data.recipient_code,
        reason,
      }),
    });

    const transferData = await transferResponse.json();
    if (!transferResponse.ok) {
      return NextResponse.json(
        { message: transferData.message || 'Mobile money transfer failed' },
        { status: transferResponse.status }
      );
    }

    return NextResponse.json({
      message: 'Mobile money transfer initiated successfully',
      data: transferData.data
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 