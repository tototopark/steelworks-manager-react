import sqlite3
import os

db_path = 'data/steelworks.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    # tb_photos update
    conn.execute("UPDATE tb_photos SET photo_name = '/uploads/jobs/' || year_creation || '/' || photo_name WHERE photo_name NOT LIKE '/uploads/%'")
    # tb_login update
    conn.execute("UPDATE tb_login SET avatar = '/uploads/avatars/' || avatar WHERE avatar IS NOT NULL AND avatar != 'default.png' AND avatar NOT LIKE '/uploads/%'")
    conn.commit()
    print("Database paths updated successfully.")
else:
    print("Database file not found.")
