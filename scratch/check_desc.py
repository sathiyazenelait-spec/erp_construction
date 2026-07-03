import pymysql

def check_desc():
    conn = pymysql.connect(
        host="localhost", user="root", password="Sathiya@123", database="buildcon_erp",
        cursorclass=pymysql.cursors.DictCursor
    )
    with conn.cursor() as cursor:
        cursor.execute("DESCRIBE dashboard_shell_configs")
        for col in cursor.fetchall():
            print(col)

if __name__ == "__main__":
    check_desc()
