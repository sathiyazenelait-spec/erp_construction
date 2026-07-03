import bcrypt

target_hash = b"$2a$10$zR4SzGT5.aYS3lfXeLC3O.TZhfg6UMNE9Sy4H2DAxX5Pg7r3HLkEm"
passwords_to_try = ["password123", "tl123", "buildcon123", "buildcontl", "password", "123456", "admin123"]

for pw in passwords_to_try:
    if bcrypt.checkpw(pw.encode('utf-8'), target_hash):
        print(f"MATCH FOUND: {pw}")
        break
else:
    print("NO MATCH FOUND")
