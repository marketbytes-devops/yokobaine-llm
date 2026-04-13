from alembic.config import Config
from alembic import command
import traceback
import sys
from app.core.database import engine

engine.echo = True

try:
    albc_cfg = Config("alembic.ini")
    command.upgrade(albc_cfg, "fe9304afafb3")
    print("Migration successful")
except Exception as e:
    print(f"Migration failed: {e}")
    traceback.print_exc()
    sys.exit(1)
