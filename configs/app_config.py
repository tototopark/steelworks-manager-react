"""
configs/app_config.py
Provides global system configurations, database connections, static paths,
and constants for the steelworks-manager application.
"""

import os

# Database configurations
DB_TYPE = "sqlite"  # Options: "sqlite", "mysql"

# SQLite paths
SQLITE_DB_PATH = os.environ.get(
    "SQLITE_DB_PATH",
    os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "data",
        "steelworks.db"
    )
)


# MySQL connection settings (For future migration)
MYSQL_CONFIG = {
    "host": "localhost",
    "user": "pengelly_jumbo",
    "password": "!a>6+Bfr82iB",
    "database": "jumbodra_DB"
}

# Legacy SQL path for migration (Relative path dynamic lookup)
LEGACY_SQL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "legacy",
    "jumbodra_DB.sql"
)

# Logging configuration
LOG_FILE_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "logs",
    "pipeline.log"
)

# UI feature flags and Developer Tools Configuration
AUTO_FILL_ENABLED = True  # Automatically fills default credentials (admin/12345678) in the LoginPage.js for rapid testing
SHOW_DEV_HINTS = True     # Shows the Developer Hints (DevHints.js) panel containing active hooks, files, and queries at the bottom of each page

# Super Admin Fallback (Emergency access bypassing DB)
ENABLE_SUPER_ADMIN = True
SUPER_ADMIN_LOGIN = "admin"
SUPER_ADMIN_PASS = "12345678"
