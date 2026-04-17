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
        cursor.execute("DESCRIBE teacher_section_link")
        result = cursor.fetchall()
        print("TABLE: teacher_section_link")
        for row in result:
            print(f"  {row['Field']}: {row['Type']}")
finally:
    if 'connection' in locals():
        connection.close()
