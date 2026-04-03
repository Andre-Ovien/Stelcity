import requests
from django.conf import settings

SQUAD_BASE_URL = 'https://api-d.squadco.com'

def get_headers():
    return {
        'Authorization': f'Bearer {settings.SQUAD_SECRET_KEY}',
        'Content-Type': 'application/json',
    }

def initialize_squad_payment(email, amount, reference, name):
    url = f'{SQUAD_BASE_URL}/transaction/initiate'
    payload = {
        'email': email,
        'amount': int(amount * 100),
        'currency': 'NGN',
        'initiate_type': 'inline',
        'transaction_ref': reference,
        'callback_url': f'{settings.FRONTEND_URL}/payment/verify',
        'customer_name': name,
        'payment_channels': ['card', 'bank', 'ussd', 'transfer'],
    }
    try:
        response = requests.post(url, json=payload, headers=get_headers())
        return response.json()
    except Exception as e:
        print("SQUAD ERROR:", str(e))
        return {'status': 500, 'error': str(e)}
    

def verify_squad_payment(reference):
    url = f'{SQUAD_BASE_URL}/transaction/verify/{reference}'
    try:
        response = requests.get(url, headers=get_headers())
        return response.json()
    except Exception as e:
        return {'status': 500, 'error': str(e)}