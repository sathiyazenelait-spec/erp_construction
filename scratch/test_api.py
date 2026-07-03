import urllib.request
import urllib.parse
import json

def test():
    users = [
        {"username": "site", "password": "site123"},
        {"username": "Amit Patel", "password": "password123"},
        {"username": "admin", "password": "admin123"}
    ]
    token = None
    for u in users:
        print(f"Trying to login as {u['username']}...")
        signin_url = "http://localhost:8081/api/auth/signin"
        data = json.dumps(u).encode("utf-8")
        req = urllib.request.Request(signin_url, data=data, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req) as res:
                response = json.loads(res.read().decode())
                token = response.get("token")
                print(f"SUCCESS: Logged in as {u['username']}! Token: {token[:15]}...")
                break
        except Exception as e:
            print(f"FAILED: {e}")

    if not token:
        print("ALL LOGINS FAILED")
        return


    # 2. Get daily logs
    logs_url = "http://localhost:8081/api/site/logs/1"
    req_logs = urllib.request.Request(logs_url, headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req_logs) as res:
            logs = json.loads(res.read().decode())
            print("DAILY LOGS:")
            print(json.dumps(logs, indent=2))
    except Exception as e:
        print("LOGS FETCH ERROR:", e)

    # 3. Get productivity
    prod_url = "http://localhost:8081/api/site-management/productivity/1"
    req_prod = urllib.request.Request(prod_url, headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req_prod) as res:
            prod = json.loads(res.read().decode())
            print("PRODUCTIVITY DATA:")
            print(json.dumps(prod, indent=2))
    except Exception as e:
        print("PRODUCTIVITY FETCH ERROR:", e)

if __name__ == "__main__":
    test()
