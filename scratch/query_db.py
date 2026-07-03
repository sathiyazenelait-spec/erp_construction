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
            # Describe training_schedules table
            cursor.execute("DESCRIBE training_schedules")
            columns = cursor.fetchall()
            print("TRAINING SCHEDULES COLUMNS:")
            for col in columns:
                print(col)

            # Sample training schedules
            cursor.execute("SELECT * FROM training_schedules")
            records = cursor.fetchall()
            print("\nSAMPLE TRAINING SCHEDULES:")
            for r in records:
                print(r)
    except Exception as e:
        print("DATABASE ERROR:", e)

if __name__ == "__main__":
    query()
