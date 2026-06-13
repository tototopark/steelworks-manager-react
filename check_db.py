import sqlite3
conn = sqlite3.connect('data/steelworks.db')
c = conn.cursor()
c.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = [r[0] for r in c.fetchall()]
print(tables)

# Check vehicle reminder schema if it exists
if 'tb_reminder_vehicle' in tables:
    c.execute("PRAGMA table_info(tb_reminder_vehicle)")
    print("tb_reminder_vehicle columns:", [r[1] for r in c.fetchall()])

# Check jobs schema
if 'tb_jobs' in tables:
    c.execute("PRAGMA table_info(tb_jobs)")
    print("tb_jobs columns:", [r[1] for r in c.fetchall()])
conn.close()
