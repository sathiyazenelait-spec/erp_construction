import pymysql

def query_configs():
    try:
        conn = pymysql.connect(
            host="localhost",
            user="root",
            password="Sathiya@123",
            database="buildcon_erp",
            cursorclass=pymysql.cursors.DictCursor
        )
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM dashboard_shell_configs WHERE organization_id = 1 AND dashboard_type = 'digital-marketing-tl'")
            res = cursor.fetchall()
            print("DASHBOARD SHELL CONFIGS FOR ORG 1:")
            for r in res:
                print(f"  {r['config_key']}: {r['config_value']}")
    except Exception as e:
        print("DATABASE ERROR:", e)

if __name__ == "__main__":
    query_configs()
