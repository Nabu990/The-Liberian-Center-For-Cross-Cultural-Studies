import { NextResponse } from 'next/server'
import Flutterwave from 'flutterwave-node-v3'

const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY!, process.env.FLUTTERWAVE_SECRET_KEY!)

export async function POST(request: Request) {
  try {
    const { amount, donorName, donorEmail, donorPhone, message, isAnonymous } = await request.json()

    // Validate amount
    const donationAmount = parseFloat(amount)
    if (isNaN(donationAmount) || donationAmount < 1) {
      return NextResponse.json({ error: { message: 'Minimum donation amount is $1' } }, { status: 400 })
    }

    // Generate unique transaction reference
    const tx_ref = `LCCCS-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Create Flutterwave payment link
    const paymentLink = await flw.PaymentLink.create({
      title: 'Donation to LCCCS',
      description: isAnonymous ? 'Anonymous donation' : `Donation from ${donorName}`,
      currency: 'USD',
      amount: donationAmount,
      tx_ref,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/donate/success`,
      duration: 3600, // 1 hour
      customizations: {
        title: 'LCCCS Donation',
        description: 'Support Liberian Center for Cross Cultural Studies',
        logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/images/LCCS-logo.png`,
      },
      meta: {
        donorName: isAnonymous ? 'Anonymous' : donorName,
        donorEmail: isAnonymous ? '' : donorEmail,
        donorPhone: donorPhone || '',
        message: message || '',
        isAnonymous: isAnonymous ? 'true' : 'false',
      },
      customer: {
        email: isAnonymous ? 'anonymous@lcccs.edu' : donorEmail,
        name: isAnonymous ? 'Anonymous Donor' : donorName,
        phonenumber: donorPhone || '',
      },
    })

    return NextResponse.json({ 
      link_url: paymentLink.data.link_url,
      tx_ref 
    })
  } catch (error) {
    console.error('Flutterwave checkout error:', error)
    return NextResponse.json(
      { error: { message: 'Failed to create payment link. Please try again.' } },
      { status: 500 }
    )
  }
}
