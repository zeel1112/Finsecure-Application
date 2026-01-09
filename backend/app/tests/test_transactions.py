from datetime import date


def test_create_transaction(authenticated_client, db):
    client, user = authenticated_client

    account_data = {
        "name": "Test Account",
        "type": "checking",
        "balance": 1000.0,
        "currency": "USD"
    }
    account_response = client.post("/api/v1/accounts", json=account_data)
    account_id = account_response.json()["id"]

    transaction_data = {
        "account_id": account_id,
        "date": str(date.today()),
        "amount": 50.0,
        "description": "Test Transaction",
        "type": "expense",
        "category": "food",
        "is_recurring": False
    }
    response = client.post("/api/v1/transactions", json=transaction_data)
    assert response.status_code == 201
    data = response.json()
    assert data["description"] == transaction_data["description"]
    assert data["amount"] == transaction_data["amount"]


def test_get_transactions(authenticated_client, db):
    client, user = authenticated_client

    account_data = {
        "name": "Test Account",
        "type": "checking",
        "balance": 1000.0,
        "currency": "USD"
    }
    account_response = client.post("/api/v1/accounts", json=account_data)
    account_id = account_response.json()["id"]

    transaction_data = {
        "account_id": account_id,
        "date": str(date.today()),
        "amount": 50.0,
        "description": "Test Transaction",
        "type": "expense",
        "category": "food",
        "is_recurring": False
    }
    client.post("/api/v1/transactions", json=transaction_data)

    response = client.get("/api/v1/transactions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["description"] == transaction_data["description"]


def test_categorize_transaction(client):
    request_data = {"description": "Grocery shopping at Walmart"}
    response = client.post("/api/v1/transactions/categorize", json=request_data)
    assert response.status_code == 200
    data = response.json()
    assert "category" in data
    assert "confidence" in data
    assert data["category"] in ["food", "shopping", "other"]
