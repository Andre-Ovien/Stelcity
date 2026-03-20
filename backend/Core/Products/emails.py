import resend
from django.conf import settings

resend.api_key = settings.RESEND_API_KEY


def send_order_confirmation(order):
    items_html = ''.join([
        f"""
        <tr>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">
                {item.product.name}
                {f'({item.variant.weight})' if item.variant else ''}
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">x{item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #eee;">
                ₦{item.item_subtotal:,.2f}
            </td>
        </tr>
        """
        for item in order.items.select_related('product', 'variant').all()
    ])

    total = sum(item.item_subtotal for item in order.items.all())

    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px;">
        <h2 style="color: #333;">Order Confirmed! 🎉</h2>
        <p>Hi {order.user.email},</p>
        <p>Thank you for your order. Here's a summary:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <thead>
                <tr style="background: #f5f5f5;">
                    <th style="padding: 8px; text-align: left;">Item</th>
                    <th style="padding: 8px; text-align: left;">Qty</th>
                    <th style="padding: 8px; text-align: left;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                {items_html}
            </tbody>
        </table>

        <p style="font-size: 18px;">
            <strong>Total: ₦{total:,.2f}</strong>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">

        <p style="color: #888; font-size: 13px;">
            Order ID: {order.order_id}<br>
            If you have any questions, reply to this email.
        </p>

        <p>Thank you for shopping with Stelcity! 🛍️</p>
    </div>
    """

    try:
        resend.Emails.send({
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": order.user.email,
            "subject": "Your Stelcity Order is Confirmed!",
            "html": html_content,
        })
    except Exception as e:
        print(f"Email failed: {e}")


def send_payment_failed(order):
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px;">
        <h2 style="color: #e74c3c;">Payment Failed</h2>
        <p>Hi {order.user.email},</p>
        <p>Unfortunately your payment for order <strong>{order.order_id}</strong> was unsuccessful.</p>
        
        <p>Your cart items are still saved — you can go back and try again.</p>

        <a href="https://stelcity.vercel.app/cart" 
           style="display: inline-block; margin-top: 16px; padding: 12px 24px; 
                  background: #e74c3c; color: white; text-decoration: none; 
                  border-radius: 6px;">
            Return to Cart
        </a>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #888; font-size: 13px;">
            If you keep experiencing issues, reply to this email and we'll help you out.
        </p>
    </div>
    """

    try:
        resend.Emails.send({
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": order.user.email,
            "subject": "Payment Failed — Stelcity",
            "html": html_content,
        })
    except Exception as e:
        print(f"Failed payment email error: {e}")