import pymysql

def list_tls():
    try:
        conn = pymysql.connect(
            host="localhost",
            user="root",
            password="Sathiya@123",
            database="buildcon_erp",
            cursorclass=pymysql.cursors.DictCursor
        )
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, username, email, role_name, organization_id FROM digital_marketing_tls")
            res = cursor.fetchall()
            print("DIGITAL MARKETING TL USERS:")
            for r in res:
                print(r)
    except Exception as e:
        print("DATABASE ERROR:", e)

if __name__ == "__main__":
    list_tls()
