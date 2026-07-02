import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'woafisun@gmail.com',
        pass: process.env.NODEMAILER_ID,
    },
});

export async function sendEmail(options: EmailOptions): Promise<void> {
    const mailOptions = {
        from: '"Tech Gadget Store" <woafisun@gmail.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to', options.to);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

export async function sendPasswordResetEmail(
    userEmail: string,
    resetToken: string
): Promise<void> {
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #f9f9f9;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }
                .button {
                    display: inline-block;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #666;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your Tech Gadget Store account.</p>
                    <p>Click the button below to reset your password:</p>
                    <center>
                        <a href="${resetLink}" class="button">Reset Password</a>
                    </center>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #667eea;">${resetLink}</p>
                    <p><strong>This link will expire in 1 hour.</strong></p>
                    <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                    <p>Best regards,<br>Tech Gadget Store Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated email. Please do not reply to this message.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail({
        to: userEmail,
        subject: 'Password Reset Request - Tech Gadget Store',
        html,
    });
}

interface OrderItem {
    product: {
        name: string;
        image: string;
    };
    quantity: number;
    price: number;
}

interface OrderData {
    id: number;
    total: number;
    fullName: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
    createdAt: Date;
    items: OrderItem[];
}

export async function sendPaymentSuccessEmail(order: OrderData): Promise<void> {
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const itemsHtml = order.items
        .map(
            (item) => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${item.product.image}" alt="${item.product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />
                        <div>
                            <p style="margin: 0; font-weight: 600; color: #333;">${item.product.name}</p>
                            <p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">Quantity: ${item.quantity}</p>
                        </div>
                    </div>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; color: #333; font-weight: 600;">
                    $${(item.price * item.quantity).toFixed(2)}
                </td>
            </tr>
        `
        )
        .join('');

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    background: #f9f9f9;
                    padding: 30px;
                    border-radius: 0 0 10px 10px;
                }
                .success-icon {
                    font-size: 48px;
                    margin-bottom: 10px;
                }
                .order-info {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #eee;
                }
                .info-row:last-child {
                    border-bottom: none;
                }
                .info-label {
                    color: #666;
                    font-weight: 500;
                }
                .info-value {
                    color: #333;
                    font-weight: 600;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                }
                th {
                    background: #f3f4f6;
                    padding: 12px;
                    text-align: left;
                    font-weight: 600;
                    color: #333;
                    border-bottom: 2px solid #e5e7eb;
                }
                .total-row {
                    background: #f3f4f6;
                    font-size: 18px;
                    font-weight: 700;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #666;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="success-icon">✓</div>
                    <h1>Payment Successful!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your purchase</p>
                </div>
                <div class="content">
                    <p>Hello ${order.fullName},</p>
                    <p>We're excited to confirm that your payment has been successfully processed!</p>
                    
                    <div class="order-info">
                        <h2 style="margin-top: 0; color: #333; font-size: 20px;">Order Details</h2>
                        <div class="info-row">
                            <span class="info-label">Order Number:</span>
                            <span class="info-value">#${order.id}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Order Date:</span>
                            <span class="info-value">${orderDate}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Total Amount:</span>
                            <span class="info-value" style="color: #0ea5e9; font-size: 18px;">$${order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <h3 style="color: #333; margin-top: 30px;">Shipping Information</h3>
                    <div class="order-info">
                        <div class="info-row">
                            <span class="info-label">Name:</span>
                            <span class="info-value">${order.fullName}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Email:</span>
                            <span class="info-value">${order.email}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Phone:</span>
                            <span class="info-value">${order.phone}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Address:</span>
                            <span class="info-value">${order.address}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">City:</span>
                            <span class="info-value">${order.city}, ${order.zipCode}</span>
                        </div>
                    </div>

                    <h3 style="color: #333; margin-top: 30px;">Order Items</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th style="text-align: right;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                            <tr class="total-row">
                                <td style="padding: 12px; text-align: right; font-weight: 600;">Total:</td>
                                <td style="padding: 12px; text-align: right; color: #0ea5e9;">$${order.total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <p style="margin-top: 30px;">We'll send you another email once your order has been shipped. You can track your order status in your account.</p>
                    <p>If you have any questions, please don't hesitate to contact our support team.</p>
                    <p>Best regards,<br>Tech Gadget Store Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated email. Please do not reply to this message.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail({
        to: order.email,
        subject: `Payment Successful - Order #${order.id} - Tech Gadget Store`,
        html,
    });
}