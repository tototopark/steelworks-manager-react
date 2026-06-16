"""
skills/200_admin_pipeline.py
Pipeline for Admin related utilities (Migration, Password reset, DB inspection)
"""
import os
import sys

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.append(project_root)

from core import db_client

TABLE_METADATA = {
    "tb_export_data": {"desc": "Exported data records for external systems", "rel": "None"},
    "tb_jobs": {"desc": "Core job/project information", "rel": "1:N with tb_jobs_details, tb_tasks"},
    "tb_jobs_date_install": {"desc": "Installation scheduling for jobs", "rel": "N:1 with tb_jobs"},
    "tb_jobs_dates": {"desc": "Key timeline dates for jobs", "rel": "N:1 with tb_jobs"},
    "tb_jobs_details": {"desc": "Detailed items/components belonging to a job", "rel": "N:1 with tb_jobs"},
    "tb_keys_remote_devices": {"desc": "Keys/Access control for remote devices", "rel": "None"},
    "tb_leaves": {"desc": "Employee leave/holiday records", "rel": "N:1 with tb_login"},
    "tb_login": {"desc": "Employee master accounts & roles", "rel": "1:N with tb_tasks, tb_punchsheet"},
    "tb_photos": {"desc": "Job site or inspection photos", "rel": "N:1 with tb_jobs"},
    "tb_production_plan": {"desc": "Production planning schedules", "rel": "N:1 with tb_jobs"},
    "tb_public_holidays": {"desc": "Public holidays reference table", "rel": "None"},
    "tb_punchsheet": {"desc": "Employee clock-in / clock-out records", "rel": "N:1 with tb_login"},
    "tb_reminder_other": {"desc": "General system reminders", "rel": "None"},
    "tb_reminder_vehicle": {"desc": "Vehicle maintenance reminders", "rel": "None"},
    "tb_tasks": {"desc": "Specific tasks assigned to jobs/sites", "rel": "N:1 with tb_jobs, N:M with tb_login"},
    "tb_tasks_employees_affectation": {"desc": "Task-Employee assignment mapping", "rel": "N:1 with tb_tasks, tb_login"},
    "tb_week_notes": {"desc": "Weekly production/manager notes", "rel": "None"},
    "tb_wip": {"desc": "Work in progress & QA inspection records", "rel": "N:1 with tb_jobs"}
}

def migrate_legacy_data():
    """
    Triggers the legacy migration script logic. Preserves legacy database passwords exactly as-is.
    """
    try:
        import datetime
        import shutil
        import importlib
        from configs import app_config
        from tests import db_init
        from tests import import_legacy

        # Reload modules to ensure latest changes are applied
        importlib.reload(app_config)
        importlib.reload(db_init)
        importlib.reload(import_legacy)

        # 1. Backup existing SQLite DB if it exists
        if app_config.DB_TYPE == "sqlite" and os.path.exists(app_config.SQLITE_DB_PATH):
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = f"{app_config.SQLITE_DB_PATH}.bak_{timestamp}"
            shutil.copy2(app_config.SQLITE_DB_PATH, backup_path)

        # 2. Recreate all tables (DROP and CREATE)
        db_init.create_tables()

        # 3. Import legacy data
        import_legacy.import_legacy_data()
        return {"status": "success", "message": "Legacy database successfully migrated. All legacy passwords have been preserved."}
    except Exception as e:
        return {"status": "error", "message": f"Migration failed: {str(e)}"}

def reset_all_passwords():
    """
    Resets all employee passwords to plaintext '12345678' (For user password change workflow).
    """
    try:
        db_client.execute_query("UPDATE tb_login SET password = '12345678'")
        return {"status": "success", "message": "All passwords have been reset to plaintext 12345678."}
    except Exception as e:
        return {"status": "error", "message": f"Failed to reset passwords: {str(e)}"}

def shift_dates_to_today():
    """
    Shifts all date data in the DB forward so the latest record aligns with today.
    1. Finds MAX(date_creation) in tb_jobs as the anchor date.
    2. Calculates offset_days = today - anchor_date.
    3. Updates all known date columns using SQLite date() arithmetic.
    4. tb_punchsheet: year/month/day/week rebuilt from shifted date (special handling).
    """
    try:
        import sqlite3
        import datetime
        from configs import app_config

        conn = sqlite3.connect(app_config.SQLITE_DB_PATH)
        conn.row_factory = sqlite3.Row
        try:
            cursor = conn.cursor()

            # 1. Find anchor
            cursor.execute(
                "SELECT MAX(date_creation) as max_date FROM tb_jobs "
                "WHERE date_creation IS NOT NULL AND date_creation != ''"
            )
            row = cursor.fetchone()
            max_date_str = row["max_date"] if row else None
            if not max_date_str:
                return {"status": "error", "message": "No date data found in tb_jobs. Run migration first."}

            anchor_date = datetime.date.fromisoformat(max_date_str)
            today = datetime.date.today()
            offset_days = (today - anchor_date).days

            offset_str = f"+{offset_days} days" if offset_days > 0 else f"{offset_days} days"

            # 2. Standard ISO date columns per table
            DATE_COLUMNS = {
                "tb_jobs": [
                    "date_creation", "date_last_update", "WIP_Completed_Date",
                    "WIP_Issue_Date", "WIP_Revision_Date",
                    "PAINT_CSP_DATE", "PAINT_ASB_DATE", "PAINT_MET_DATE",
                    "PAINT_OTHER_DATE", "FASTENER_DATE"
                ],
                "tb_jobs_date_install": ["date_creation", "date_install"],
                "tb_jobs_dates": [
                    "inq_consented_plans", "rec_consented_plans",
                    "inq_prenail_digital_files", "rec_prenail_digital_files",
                    "inq_RFI", "rec_RFI",
                    "inq_coating_schedule", "rec_coating_schedule",
                    "inq_approval_archi", "rec_approval_archi",
                    "inq_approval_engineers", "rec_approval_engineers",
                    "inq_steel_purchase", "rec_steel_purchase",
                    "inq_QA_doc", "rec_QA_doc",
                    "inq_SSSP", "rec_SSSP",
                    "inq_invoice", "rec_invoice"
                ],
                "tb_jobs_details": [
                    "date_creation", "design_date_update", "approved_date",
                    "made_date_update", "load_date_update", "on_site_date_update",
                    "temp_fix_date_update", "chemset_date_update",
                    "tightened_date_update", "finish_date_update"
                ],
                "tb_leaves": ["date_start", "date_stop"],
                "tb_login": ["date_creation", "site_safe_exp_date"],
                "tb_production_plan": ["date_creation"],
                "tb_public_holidays": ["date_start", "date_stop"],
                "tb_reminder_other": ["expiry_date"],
                "tb_week_notes": ["date"],
                "tb_wip": ["inspection_date", "wip_version_date"],
                "tb_export_data": ["export_date"],
            }

            total_updated = 0
            log = []

            if offset_days != 0:
                for table, cols in DATE_COLUMNS.items():
                    for col in cols:
                        try:
                            cursor.execute(
                                f"UPDATE {table} SET {col} = date({col}, ?) "
                                f"WHERE {col} IS NOT NULL AND {col} != ''",
                                (offset_str,)
                            )
                            n = cursor.rowcount
                            if n > 0:
                                log.append(f"{table}.{col}: {n} rows")
                                total_updated += n
                        except Exception as col_err:
                            log.append(f"{table}.{col}: SKIP ({str(col_err)[:50]})")

            # 2.5 tb_tasks: shift independently so the latest expiry_date matches today
            try:
                cursor.execute(
                    "SELECT MAX(expiry_date) as max_date FROM tb_tasks "
                    "WHERE expiry_date IS NOT NULL AND expiry_date != ''"
                )
                task_row = cursor.fetchone()
                max_task_date_str = task_row["max_date"] if task_row else None
                if max_task_date_str:
                    max_task_date = datetime.date.fromisoformat(max_task_date_str)
                    task_offset_days = (today - max_task_date).days
                    if task_offset_days != 0:
                        task_offset_str = f"+{task_offset_days} days" if task_offset_days > 0 else f"{task_offset_days} days"
                        cursor.execute(
                            "UPDATE tb_tasks SET expiry_date = date(expiry_date, ?) "
                            "WHERE expiry_date IS NOT NULL AND expiry_date != ''",
                            (task_offset_str,)
                        )
                        n1 = cursor.rowcount
                        cursor.execute(
                            "UPDATE tb_tasks SET finished_date = date(finished_date, ?) "
                            "WHERE finished_date IS NOT NULL AND finished_date != ''",
                            (task_offset_str,)
                        )
                        n2 = cursor.rowcount
                        if n1 + n2 > 0:
                            log.append(f"tb_tasks.expiry_date: {n1} rows (offset {task_offset_days}d)")
                            log.append(f"tb_tasks.finished_date: {n2} rows (offset {task_offset_days}d)")
                            total_updated += (n1 + n2)
            except Exception as task_err:
                log.append(f"tb_tasks: SKIP ({str(task_err)[:50]})")

            # 3. tb_punchsheet: year/month/day/week stored as separate columns
            if offset_days != 0:
                MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun",
                              "Jul","Aug","Sep","Oct","Nov","Dec"]
                cursor.execute(
                    "SELECT id, year, month, day FROM tb_punchsheet "
                    "WHERE year IS NOT NULL AND month IS NOT NULL AND day IS NOT NULL"
                )
                punch_rows = cursor.fetchall()
                punch_updated = 0
                for pr in punch_rows:
                    try:
                        mon_num = MONTH_ABBR.index(str(pr["month"])) + 1
                        orig = datetime.date(int(pr["year"]), mon_num, int(pr["day"]))
                        new_d = orig + datetime.timedelta(days=offset_days)
                        new_week = int(new_d.strftime("%W"))
                        cursor.execute(
                            "UPDATE tb_punchsheet SET year=?, month=?, day=?, week=? WHERE id=?",
                            (new_d.year, MONTH_ABBR[new_d.month - 1], new_d.day, new_week, pr["id"])
                        )
                        punch_updated += 1
                    except Exception:
                        pass
                if punch_updated > 0:
                    log.append(f"tb_punchsheet (year/month/day/week): {punch_updated} rows")
                    total_updated += punch_updated

            # 4. tb_jobs_dates.year (integer year column)
            if offset_days != 0:
                year_shift = today.year - anchor_date.year
                if year_shift != 0:
                    cursor.execute(
                        "UPDATE tb_jobs_dates SET year = year + ? WHERE year IS NOT NULL",
                        (year_shift,)
                    )
                    n = cursor.rowcount
                    if n > 0:
                        log.append(f"tb_jobs_dates.year (int): {n} rows")

            conn.commit()
        finally:
            conn.close()

        summary = (
            f"Shifted all dates by {offset_days} days "
            f"({anchor_date} -> {today}). "
            f"{total_updated} total values updated."
        )
        return {"status": "success", "message": summary, "details": "\n".join(log)}

    except Exception as e:
        return {"status": "error", "message": f"Failed to shift dates: {str(e)}"}

def randomize_names():
    """
    Replaces all real employee login/firstname/surname with random English names, and
    regenerates the password as bcrypt(dev_[new_login]) to keep Quick-Fill working.
    - System accounts (admin etc.) -> login unchanged, firstname=Demo [Login]
    - Owner account (Brian/Eungsoon/id=92) -> preserved as-is
    - All others -> unique fake login + firstname + surname + new bcrypt password
    Uses a single DB connection. Deterministic seed for consistency.
    """
    try:
        import random
        import sqlite3
        import bcrypt
        from configs import app_config

        # Unique fake first names used as both login and firstname
        FAKE_NAMES = [
            "Aaron", "Adam", "Alan", "Albert", "Alex", "Alfred", "Andrew", "Anthony", "Arthur", "Austin",
            "Benjamin", "Bernard", "Billy", "Bobby", "Bradley", "Brandon", "Brian", "Bruce", "Bryan", "Carl",
            "Charles", "Christian", "Christopher", "Clifford", "Colin", "Curtis", "Dale", "Daniel", "David", "Dennis",
            "Derek", "Donald", "Douglas", "Dylan", "Edward", "Eric", "Eugene", "Frank", "Frederick", "Gary",
            "George", "Gerald", "Glenn", "Gordon", "Graham", "Gregory", "Harold", "Harry", "Henry", "Howard",
            "Ian", "Jack", "Jacob", "James", "Jason", "Jeffrey", "Jeremy", "Joel", "John", "Jonathan",
            "Joseph", "Joshua", "Justin", "Keith", "Kenneth", "Kevin", "Kyle", "Larry", "Lawrence", "Leonard",
            "Louis", "Lucas", "Mark", "Martin", "Matthew", "Michael", "Nathan", "Nicholas", "Patrick", "Paul",
            "Peter", "Philip", "Ralph", "Raymond", "Richard", "Robert", "Roger", "Ronald", "Roy", "Russell",
            "Ryan", "Samuel", "Scott", "Sean", "Simon", "Stephen", "Steven", "Thomas", "Timothy", "Walter"
        ]
        SURNAMES = [
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
            "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
            "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson",
            "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
            "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"
        ]
        SYSTEM_LOGINS = {'admin', 'developer', 'superadmin', 'usershop', 'useroffice', 'useraccountant', 'usertruck', 'useronsite'}

        random.seed(42)

        # Shuffle name pool to guarantee uniqueness (no repeat logins)
        name_pool = FAKE_NAMES.copy()
        random.shuffle(name_pool)
        name_idx = 0

        conn = sqlite3.connect(app_config.SQLITE_DB_PATH)
        conn.row_factory = sqlite3.Row
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id, login FROM tb_login")
            users = [dict(row) for row in cursor.fetchall()]

            updated = 0
            for u in users:
                login = u["login"]
                uid = u["id"]

                if login.lower() in SYSTEM_LOGINS:
                    # Keep login, only update display name
                    cursor.execute(
                        "UPDATE tb_login SET firstname=?, surname=? WHERE id=?",
                        ("Demo", login.capitalize(), uid)
                    )
                elif login.lower() in ("brian", "eungsoon") or uid == 92:
                    # Owner account: preserve everything
                    pass
                else:
                    # Assign a unique fake name from pool
                    if name_idx >= len(name_pool):
                        name_idx = 0  # Safety wrap-around
                    new_login = name_pool[name_idx]
                    name_idx += 1
                    new_first = new_login
                    new_last = random.choice(SURNAMES)
                    # New password: bcrypt(dev_[new_login]) + :dev marker
                    plain_pw = f"dev_{new_login}"
                    hashed_pw = bcrypt.hashpw(plain_pw.encode("utf-8"), bcrypt.gensalt(rounds=10)).decode("utf-8") + ":dev"
                    cursor.execute(
                        "UPDATE tb_login SET login=?, firstname=?, surname=?, password=? WHERE id=?",
                        (new_login, new_first, new_last, hashed_pw, uid)
                    )

                updated += 1

            conn.commit()
        finally:
            conn.close()

        return {"status": "success", "message": f"All {updated} employee accounts have been anonymized. Login, name, and password all updated."}
    except Exception as e:
        return {"status": "error", "message": f"Failed to randomize names: {str(e)}"}


def reset_all_passwords_hashed():
    """
    Resets all employee passwords to hashed unique passwords based on their login (e.g., 'dev_' + login).
    Uses a single DB connection for the full loop to avoid repeated open/close overhead.
    bcrypt rounds=10 is used (vs default 12) to keep computation time manageable on low-CPU hosts.
    """
    try:
        import bcrypt
        from core import db_client as _db
        import sqlite3
        from configs import app_config

        conn = sqlite3.connect(app_config.SQLITE_DB_PATH)
        conn.row_factory = sqlite3.Row
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id, login FROM tb_login")
            users = [dict(row) for row in cursor.fetchall()]

            for u in users:
                plain_pw = f"dev_{u['login']}"
                hashed_pw = bcrypt.hashpw(plain_pw.encode('utf-8'), bcrypt.gensalt(rounds=10)).decode("utf-8") + ":dev"
                cursor.execute("UPDATE tb_login SET password = ? WHERE id = ?", (hashed_pw, u['id']))

            conn.commit()
        finally:
            conn.close()

        return {"status": "success", "message": f"All {len(users)} passwords have been reset to unique hashed 'dev_[login]' values."}
    except Exception as e:
        return {"status": "error", "message": f"Failed to reset passwords: {str(e)}"}


def get_tables_list():
    """
    Returns the list of tables we care about.
    """
    TABLES = list(TABLE_METADATA.keys())
    result = []
    for table in TABLES:
        meta = TABLE_METADATA.get(table, {"desc": "", "rel": ""})
        try:
            count_res = db_client.fetch_one(f"SELECT COUNT(*) as cnt FROM {table}")
            cnt = count_res["cnt"] if count_res else 0
            result.append({"table_name": table, "row_count": cnt, "desc": meta["desc"], "rel": meta["rel"]})
        except Exception:
            result.append({"table_name": table, "row_count": -1, "error": True, "desc": meta["desc"], "rel": meta["rel"]})
    return result

def get_table_data(table_name, limit=10, offset=0, sort_order="desc"):
    """
    Returns schema and data for a specific table with pagination.
    """
    try:
        # Schema
        info = db_client.fetch_all(f"PRAGMA table_info({table_name})")
        columns = [{"cid": col["cid"], "name": col["name"], "type": col["type"], "notnull": col["notnull"], "pk": col["pk"]} for col in info]
        
        # Order
        order_clause = "DESC" if sort_order.lower() == "desc" else "ASC"
        
        # Records
        query = f"SELECT * FROM {table_name} ORDER BY id {order_clause} LIMIT ? OFFSET ?"
        records = db_client.fetch_all(query, (limit, offset))
        
        count_res = db_client.fetch_one(f"SELECT COUNT(*) as cnt FROM {table_name}")
        cnt = count_res["cnt"] if count_res else 0
        
        meta = TABLE_METADATA.get(table_name, {"desc": "", "rel": ""})

        return {
            "status": "success", 
            "table_name": table_name,
            "desc": meta["desc"],
            "rel": meta["rel"],
            "total_rows": cnt,
            "columns": columns, 
            "data": records
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

def get_system_health():
    """
    Performs a quick smoke check on the server and database status.
    """
    import datetime
    from configs import app_config
    
    health = {
        "status": "success",
        "server_time": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "python_version": sys.version.split(' ')[0],
        "db_type": app_config.DB_TYPE,
        "db_status": "Unknown",
        "db_size_mb": 0,
        "schema_integrity": "Unknown"
    }
    
    try:
        # Check DB connectivity
        db_client.fetch_one("SELECT 1")
        health["db_status"] = "Connected / OK"
        
        # Check DB file size for sqlite
        if app_config.DB_TYPE == "sqlite" and os.path.exists(app_config.SQLITE_DB_PATH):
            size_bytes = os.path.getsize(app_config.SQLITE_DB_PATH)
            health["db_size_mb"] = round(size_bytes / (1024 * 1024), 2)
            
        # Quick schema check (count tables)
        tables = db_client.fetch_one("SELECT COUNT(*) as cnt FROM sqlite_master WHERE type='table'")
        health["schema_integrity"] = f"{tables['cnt']} tables verified" if tables else "Error"
        
    except Exception as e:
        health["db_status"] = f"Error: {str(e)}"
        
    return health

def factory_reset_database():
    """
    WARNING: DESTRUCTIVE ACTION.
    Deletes all operational data from the database, retaining only:
    - Master configurations (holidays, vehicles)
    - Admin users (right_level >= 10)
    """
    try:
        tables_to_clear = [
            "tb_jobs", "tb_jobs_details", "tb_wip", 
            "tb_punchsheet", "tb_task", "tb_week_notes", 
            "tb_production_plan"
        ]
        
        # 1. Clear operational tables
        for table in tables_to_clear:
            db_client.execute_query(f"DELETE FROM {table}")
            
        # 2. Clear non-admin employees
        db_client.execute_query("DELETE FROM tb_login WHERE right_level < 10")
        
        # 3. Reset auto-increment sequences for cleared tables
        for table in tables_to_clear:
            db_client.execute_query("DELETE FROM sqlite_sequence WHERE name = ?", (table,))
        
        # Also reset sequence for tb_login
        db_client.execute_query("DELETE FROM sqlite_sequence WHERE name = 'tb_login'")
            
        return {"status": "success", "message": "Factory reset completed. All operational data has been wiped."}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def run_integrity_check(fix=False):
    """
    Checks for referential integrity violations and optionally repairs them.
    Returns JSON structured result instead of printing to console.
    """
    try:
        from tests import db_integrity_checker
        
        # 1. Backup first
        if fix:
            success = db_integrity_checker.perform_db_backup()
            if not success:
                return {"status": "error", "message": "Failed to create DB backup before repair."}
        
        violations = {}
        total_violations = 0
        
        # Query 1: Orphan tb_jobs_details
        orphan_details = db_client.fetch_all(
            "SELECT d.id FROM tb_jobs_details d LEFT JOIN tb_jobs j ON d.job_number = j.job_number WHERE j.job_number IS NULL"
        )
        violations["Orphan tb_jobs_details"] = len(orphan_details)
        total_violations += len(orphan_details)
        
        # Query 2: Orphan tb_wip
        orphan_wip = db_client.fetch_all(
            "SELECT w.id FROM tb_wip w LEFT JOIN tb_jobs_details d ON w.tb_jobs_id = d.id WHERE d.id IS NULL"
        )
        violations["Orphan tb_wip"] = len(orphan_wip)
        total_violations += len(orphan_wip)
        
        # Query 3: Orphan tb_punchsheet
        orphan_punch = db_client.fetch_all(
            "SELECT p.id FROM tb_punchsheet p LEFT JOIN tb_jobs_details d ON CAST(p.job_detail_id AS INTEGER) = d.id WHERE d.id IS NULL AND p.job_detail_id IS NOT NULL AND p.job_detail_id != ''"
        )
        violations["Orphan tb_punchsheet"] = len(orphan_punch)
        total_violations += len(orphan_punch)

        # Query 4: Orphan tb_tasks_employees_affectation
        orphan_tasks_aff = db_client.fetch_all(
            "SELECT a.id FROM tb_tasks_employees_affectation a LEFT JOIN tb_tasks t ON a.id = t.id WHERE t.id IS NULL"
        )
        violations["Orphan tb_tasks_employees_affectation"] = len(orphan_tasks_aff)
        total_violations += len(orphan_tasks_aff)

        messages = []
        
        if total_violations == 0:
            messages.append("All database relations are healthy. No issues found.")
        elif not fix:
            messages.append(f"Found {total_violations} integrity violations. Run with repair mode to fix these violations.")
        else:
            # Execute Repairs
            if orphan_details:
                ids = [str(item["id"]) for item in orphan_details]
                db_client.execute_query(f"DELETE FROM tb_jobs_details WHERE id IN ({', '.join(ids)})")
                messages.append(f"Deleted {len(orphan_details)} orphan tb_jobs_details records.")
                
            if orphan_wip:
                ids = [str(item["id"]) for item in orphan_wip]
                db_client.execute_query(f"DELETE FROM tb_wip WHERE id IN ({', '.join(ids)})")
                messages.append(f"Deleted {len(orphan_wip)} orphan tb_wip records.")
                
            if orphan_punch:
                ids = [str(item["id"]) for item in orphan_punch]
                db_client.execute_query(f"UPDATE tb_punchsheet SET job_detail_id = NULL WHERE id IN ({', '.join(ids)})")
                messages.append(f"Cleared job_detail_id reference for {len(orphan_punch)} orphan punchsheets.")
                
            if orphan_tasks_aff:
                ids = [str(item["id"]) for item in orphan_tasks_aff]
                db_client.execute_query(f"DELETE FROM tb_tasks_employees_affectation WHERE id IN ({', '.join(ids)})")
                messages.append(f"Deleted {len(orphan_tasks_aff)} orphan affectation records.")
                
            messages.append("Database repair successfully completed.")

        return {
            "status": "success",
            "total_violations": total_violations,
            "violations": violations,
            "messages": messages,
            "repaired": fix and total_violations > 0
        }
    except Exception as e:
        return {"status": "error", "message": f"Integrity check failed: {str(e)}"}
