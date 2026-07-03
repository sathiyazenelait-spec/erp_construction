import pymysql

def query():
    try:
        conn = pymysql.connect(
            host="localhost",
            user="root",
            password="Sathiya@123",
            database="buildcon_erp",
            cursorclass=pymysql.cursors.DictCursor
        )
        with conn.cursor() as cursor:
            for table in ["staffs", "digital_marketing_tls"]:
                cursor.execute(f"DESCRIBE {table}")
                print(f"\n{table.upper()} COLUMNS:")
                for col in cursor.fetchall():
                    print(col)
                
                cursor.execute(f"SELECT * FROM {table} LIMIT 10")
                print(f"\n{table.upper()} RECORDS:")
                for r in cursor.fetchall():
                    print(r)
    except Exception as e:
        print("DATABASE ERROR:", e)

if __name__ == "__main__":
    query()
