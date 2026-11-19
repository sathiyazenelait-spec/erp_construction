import urllib.request
import json

req = urllib.request.Request('http://localhost:8081/api/auth/signin', data=json.dumps({'username':'admin@buildcon.com','password':'admin123'}).encode('utf-8'), headers={'Content-Type':'application/json'})
with urllib.request.urlopen(req) as resp:
    token = json.loads(resp.read().decode('utf-8'))['token']

req2 = urllib.request.Request('http://localhost:8081/api/organizations', headers={'Authorization': f'Bearer {token}'})
with urllib.request.urlopen(req2) as resp2:
    orgs = json.loads(resp2.read().decode('utf-8'))
    print(f'Total organizations: {len(orgs)}')
    with open('scratch/orgs_data.json', 'w') as f:
        json.dump(orgs, f, indent=2)
    print('Saved scratch/orgs_data.json successfully!')
