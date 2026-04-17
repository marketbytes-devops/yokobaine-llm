import pymysql

try:
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='Gatsbymarketbytes@9633',
        database='yokobine_db',
        cursorclass=pymysql.cursors.DictCursor
    )
    with connection.cursor() as cursor:
        cursor.execute("DESCRIBE teachers")
        result = cursor.fetchall()
        print("TABLE: teachers")
        for row in result:
            print(f"  {row['Field']}: {row['Type']}")
        
        cursor.execute("DESCRIBE school_classes")
        result = cursor.fetchall()
        print("\nTABLE: school_classes")
        for row in result:
            print(f"  {row['Field']}: {row['Type']}")
finally:
    if 'connection' in locals():
        connection.close()
