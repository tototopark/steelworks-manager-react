from datetime import date, timedelta
from fastapi import APIRouter, HTTPException
from core import db_client

router = APIRouter()

@router.get("/api/workload/plan")
async def api_get_workload_plan(hours_per_day: float = 8.0, nb_fabricators: int = 5):
    try:
        today = date.today()

        # 1. Estimate Backlog
        jobs_with_po = db_client.fetch_all(
            "SELECT job_number FROM tb_jobs WHERE UPPER(SUBSTR(site_address,1,5)) <> 'QUOTE' AND UPPER(SUBSTR(superlot,1,5)) <> 'QUOTE' GROUP BY job_number"
        )
        total_detailed_hours = 0.0
        total_all_hours = 0.0
        member_counts_detailed = {"portal": 0, "beam": 0, "column": 0, "other": 0}
        member_counts_all = {"portal": 0, "beam": 0, "column": 0, "other": 0}

        for job in jobs_with_po:
            jn = job["job_number"]
            row = db_client.fetch_one(
                "SELECT COALESCE(SUM(quoted_fab_hours), 0) as total FROM tb_jobs_details WHERE design=1 AND made=0 AND job_number=?",
                (jn,)
            )
            if row:
                total_detailed_hours += float(row["total"] or 0)

            row2 = db_client.fetch_one(
                "SELECT COALESCE(SUM(quoted_fab_hours), 0) as total FROM tb_jobs_details WHERE made=0 AND job_number=?",
                (jn,)
            )
            if row2:
                total_all_hours += float(row2["total"] or 0)

            members_d = db_client.fetch_all(
                "SELECT member FROM tb_jobs_details WHERE design=1 AND made=0 AND job_number=?", (jn,)
            )
            for m in members_d:
                mn = (m["member"] or "").upper()
                if mn.startswith("P"):
                    member_counts_detailed["portal"] += 1
                elif mn.startswith("B"):
                    member_counts_detailed["beam"] += 1
                elif mn.startswith("C"):
                    member_counts_detailed["column"] += 1
                else:
                    member_counts_detailed["other"] += 1

            members_a = db_client.fetch_all(
                "SELECT member FROM tb_jobs_details WHERE made=0 AND job_number=?", (jn,)
            )
            for m in members_a:
                mn = (m["member"] or "").upper()
                if mn.startswith("P"):
                    member_counts_all["portal"] += 1
                elif mn.startswith("B"):
                    member_counts_all["beam"] += 1
                elif mn.startswith("C"):
                    member_counts_all["column"] += 1
                else:
                    member_counts_all["other"] += 1

        # 2. Public Holidays
        holidays = db_client.fetch_all("SELECT date_start, date_stop FROM tb_public_holidays")

        def is_public_holiday(d: date) -> bool:
            d_str = d.isoformat()
            for h in holidays:
                if h["date_start"] <= d_str <= h["date_stop"]:
                    return True
            return False

        # 3. Create 30 days calendar
        calendar_days = []
        for offset in range(31):
            day = today + timedelta(days=offset)
            day_name = day.strftime("%a")
            is_weekend = day.weekday() >= 5
            is_holiday = is_public_holiday(day)
            calendar_days.append({
                "date": day.isoformat(),
                "day_name": day_name[:1],
                "day_number": day.day,
                "is_working": not is_weekend and not is_holiday,
                "is_weekend": is_weekend,
                "is_holiday": is_holiday
            })

        # 4. Available fabricators (from Punch Clock sheet)
        iso = today.isocalendar()
        year_today = today.year
        week_today = iso[1]
        day_today = today.day

        shop_employees = db_client.fetch_all(
            "SELECT id, login, firstname, surname FROM tb_login WHERE admin_validation=1 AND (right_level=1 OR right_level=12) AND (role='F/W' OR role='F' OR role='W') ORDER BY firstname, surname ASC"
        )

        employees_with_availability = []
        for emp in shop_employees:
            last_punch = db_client.fetch_one(
                "SELECT id, job_detail_id FROM tb_punchsheet WHERE employee_id=? AND year=? AND week=? AND day=? ORDER BY id DESC LIMIT 1",
                (emp["id"], year_today, week_today, day_today)
            )
            clocked_in_today = last_punch is not None and last_punch.get("job_detail_id") != "CLOCK OUT"

            if not clocked_in_today:
                continue

            leaves = db_client.fetch_all(
                "SELECT date_start, date_stop FROM tb_leaves WHERE employee_id=?", (emp["id"],)
            )

            def is_on_leave(d: date) -> bool:
                d_str = d.isoformat()
                for lv in leaves:
                    if lv["date_start"] <= d_str <= lv["date_stop"]:
                        return True
                return False

            availability = []
            for offset in range(31):
                day = today + timedelta(days=offset)
                is_weekend = day.weekday() >= 5
                is_holiday = is_public_holiday(day)
                on_leave = is_on_leave(day)
                available = not is_weekend and not is_holiday and not on_leave
                availability.append(available)

            employees_with_availability.append({
                "id": emp["id"],
                "login": emp["login"],
                "name": f"{emp['firstname']} {emp['surname']}".strip(),
                "availability": availability
            })

        return {
            "status": "success",
            "today": today.isoformat(),
            "hours_per_day": hours_per_day,
            "nb_fabricators": nb_fabricators,
            "fab_hours_detailed": round(total_detailed_hours, 2),
            "fab_hours_all": round(total_all_hours, 2),
            "member_counts_detailed": member_counts_detailed,
            "member_counts_all": member_counts_all,
            "calendar": calendar_days,
            "employees": employees_with_availability,
            "employee_count": len(employees_with_availability)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
