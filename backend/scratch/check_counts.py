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
        cursor.execute("SELECT COUNT(*) as count FROM teachers")
        print(f"Teachers count: {cursor.fetchone()['count']}")
        cursor.execute("SELECT COUNT(*) as count FROM school_sections")
        print(f"Sections count: {cursor.fetchone()['count']}")
        cursor.execute("SELECT COUNT(*) as count FROM teacher_section_link")
        print(f"Links count: {cursor.fetchone()['count']}")
finally:
    if 'connection' in locals():
        connection.close()
