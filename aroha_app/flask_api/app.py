from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Django API endpoint to verify token (adjust if needed)
DJANGO_VERIFY_URL = 'http://127.0.0.1:8000/api/auth/signin/'

# Dummy product recommendations (replace with ML logic later)
DUMMY_PRODUCTS = [
    {"id": 1, "name": "Eco-Friendly Water Bottle", "price": 15.99, "image_url": "https://via.placeholder.com/150/771796"},
    {"id": 2, "name": "Reusable Shopping Bag", "price": 5.99, "image_url": "https://via.placeholder.com/150/24f355"},
    {"id": 3, "name": "Bamboo Toothbrush", "price": 3.49, "image_url": "https://via.placeholder.com/150/d32776"},
]

# Helper: Verify Django token by calling Django API
def verify_django_token(token):
    headers = {"Authorization": f"Token {token}"}
    # Try to fetch user info (adjust endpoint as needed)
    try:
        resp = requests.get("http://127.0.0.1:8000/api/auth/user/", headers=headers)
        return resp.status_code == 200
    except Exception:
        return False

@app.route('/api/flask/recommendations/', methods=['GET'])
def get_recommendations():
    # Get token from headers
    token = request.headers.get('Authorization')
    if not token or not token.startswith('Token '):
        return jsonify({'error': 'Authentication credentials were not provided.'}), 401
    token = token.split(' ', 1)[1]
    # Verify token with Django
    if not verify_django_token(token):
        return jsonify({'error': 'Invalid or expired token.'}), 401

    # Get user_id or product_id from query params
    user_id = request.args.get('user_id')
    product_id = request.args.get('product_id')
    # For now, just return dummy recommendations
    # In a real app, use user_id/product_id to generate recommendations
    return jsonify({'recommendations': DUMMY_PRODUCTS})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
