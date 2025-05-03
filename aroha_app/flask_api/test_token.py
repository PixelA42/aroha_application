import requests

token = "9cd1d8395bc263753c2cfce948c12cd20b1e3281"  # Replace with your token
headers = {"Authorization": f"Token {token}"}
url = "http://127.0.0.1:8000/api/auth/user/"

response = requests.get(url, headers=headers)
print("Status code:", response.status_code)
print("Response:", response.text)