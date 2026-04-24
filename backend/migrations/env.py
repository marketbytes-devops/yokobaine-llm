import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv
from urllib.parse import quote_plus

# ── Load .env ──────────────────────────────────────────────────────────────
load_dotenv()

# ── Make sure Python can find our `app` package ───────────────────────────
# This adds the `backend/` folder to the Python path so `from app.xxx import`
# statements work correctly when Alembic runs from the command line.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# ── Import ALL models here so Alembic can detect them ─────────────────────
# IMPORTANT: Every time you create a new module with models.py,
# you MUST add its import here. This is the central registry.
from app.core.database import Base, SQLALCHEMY_DATABASE_URL  # noqa: F401

# Stage 1 — Auth (already exists)
import app.authapp.models  # noqa: F401

# Stage 1 — School
import app.school.models  # noqa: F401

# Stage 2 - Academics
import app.academics.models  # noqa: F401

# Stage 2 — Users / RBAC (Developer 2 adds this)
# import app.users.models  # noqa: F401
import app.students.models  # noqa: F401

# Stage 2 — Timetable
import app.timetable.models  # noqa: F401

# Stage 3 — Ledger, Finance, Communication, Settings
# import app.ledger.models  # noqa: F401
# import app.finance.models  # noqa: F401
import app.notices.models  # noqa: F401

# ── Build DB URL from app configuration ────────────────────────────────────
DATABASE_URL = SQLALCHEMY_DATABASE_URL

# Alembic uses Python's ConfigParser which treats % as a special interpolation character.
# We must escape all % with %% before passing the URL to set_main_option.
DATABASE_URL_ESCAPED = DATABASE_URL.replace("%", "%%")

# ── Standard Alembic boilerplate ───────────────────────────────────────────
config = context.config
config.set_main_option("sqlalchemy.url", DATABASE_URL_ESCAPED)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
