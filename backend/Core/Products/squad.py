import requests
from django.conf import settings

SQUAD_BASE_URL = 'https://api-d.squadco.com'  
# SQUAD_BASE_URL = 'https://api.squadco.com'  

headers = {
    'Authorization': f'Bearer {settings.SQUAD_SECRET_KEY}',
    'Content-Type': 'application/json',
}

def initialize_squad_payment(email, amount, reference, name):
    url = f'{SQUAD_BASE_URL}/transaction/initiate'
    payload = {
        'email': email,
        'amount': int(amount * 100),  
        'currency': 'NGN',
        'transaction_ref': reference,
        'callback_url': f'{settings.FRONTEND_URL}/payment/verify',
        'customer_name': name,
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

def verify_squad_payment(reference):
    url = f'{SQUAD_BASE_URL}/transaction/verify/{reference}'
    response = requests.get(url, headers=headers)
    return response.json()