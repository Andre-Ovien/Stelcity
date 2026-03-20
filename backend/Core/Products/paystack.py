import requests
from django.conf import settings

PAYSTACK_BASE_URL = 'https://api.paystack.co'

headers = {
    'Authorization': f"Bearer {settings.PAYSTACK_SECRET_KEY}",
    'Content-Type': 'application/json',
}

def initialize_payment(email, amount, reference):
    url = f'{PAYSTACK_BASE_URL}/transaction/initialize'
    payload = {
        'email': email,
        'amount': int(amount * 100),
        'reference': reference,
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

def verify_payment(reference):
    url = f'{PAYSTACK_BASE_URL}/transaction/verify/{reference}'
    response = requests.get(url, headers=headers)
    return response.json()