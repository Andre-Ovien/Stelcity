import resend
from django.conf import settings

resend.api_key = settings.RESEND_API_KEY

def send_welcome_newsletter(email):
    html_content = """
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px;">
        <img src="https://www.stelcity.com/images/logo.png" 
             alt="Stelcity" style="width: 120px; margin-bottom: 24px;">
        
        <h2 style="color: #333;">Welcome to the Stelcity Community! 🌿</h2>
        
        <p>Thank you for subscribing to our newsletter. We're so excited to have you!</p>
        
        <p>Here's what to expect from us:</p>
        <ul style="line-height: 2;">
            <li>✨ Exclusive skincare tips and routines</li>
            <li>🛍️ Early access to new products</li>
            <li>💸 Special discounts and offers</li>
            <li>🌿 Ingredient spotlights and education</li>
        </ul>

        <a href="https://www.stelcity.com/products" 
           style="display: inline-block; margin-top: 16px; padding: 12px 24px; 
                  background: #2d6a4f; color: white; text-decoration: none; 
                  border-radius: 6px;">
            Shop Now
        </a>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #888; font-size: 13px;">
            You're receiving this because you subscribed at stelcity.vercel.app
        </p>
    </div>
    """

    try:
        resend.Emails.send({
            "from": settings.DEFAULT_FROM_EMAIL,
            "to": email,
            "subject": "Welcome to Stelcity! 🌿",
            "html": html_content,
        })
    except Exception as e:
        print(f"Welcome newsletter email error: {e}")


def send_newsletter_broadcast(newsletter, subscribers):
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px;">
        <img src="https://www.stelcity.com/images/logo.png" 
             alt="Stelcity" style="width: 120px; margin-bottom: 24px;">
        
        <h2 style="color: #333;">{newsletter.subject}</h2>
        
        <div style="line-height: 1.8; color: #444;">
            {newsletter.content}
        </div>

        <a href="https://www.stelcity.com/products"
           style="display: inline-block; margin-top: 24px; padding: 12px 24px;
                  background: #2d6a4f; color: white; text-decoration: none;
                  border-radius: 6px;">
            Shop Now
        </a>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #888; font-size: 13px;">
            You're receiving this because you subscribed at stelcity.vercel.app
        </p>
    </div>
    """

    for subscriber in subscribers:
        try:
            resend.Emails.send({
                "from": settings.DEFAULT_FROM_EMAIL,
                "to": subscriber.email,
                "subject": newsletter.subject,
                "html": html_content,
            })
        except Exception as e:
            print(f"Newsletter broadcast error for {subscriber.email}: {e}")