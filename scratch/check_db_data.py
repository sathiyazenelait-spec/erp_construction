import pymysql

def check_sales_tables():
    try:
        conn = pymysql.connect(
            host="localhost",
            user="root",
            password="Sathiya@123",
            database="buildcon_erp",
            cursorclass=pymysql.cursors.DictCursor
        )
        with conn.cursor() as cursor:
            tables_with_org = ["sales_leads", "sales_proposals", "sales_activities", "sales_chats", "revenue_entries"]
            print("ROW COUNTS WITH ORG ID = 1:")
            for table in tables_with_org:
                cursor.execute(f"SELECT COUNT(*) as count FROM {table} WHERE organization_id = 1")
                res = cursor.fetchone()
                print(f"  {table}: {res['count']} rows")
                
            cursor.execute("SELECT COUNT(*) as count FROM sales_messages")
            print(f"Total sales_messages: {cursor.fetchone()['count']} rows")
            
    except Exception as e:
        print("DATABASE ERROR:", e)

if __name__ == "__main__":
    check_sales_tables()
