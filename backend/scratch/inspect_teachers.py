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
        cursor.execute("SELECT * FROM teachers")
        result = cursor.fetchall()
        print("TEACHERS DATA:")
        for row in result:
            print(row)
finally:
    if 'connection' in locals():
        connection.close()
