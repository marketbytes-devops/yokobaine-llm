"""Merge all heads into a single line

Revision ID: merge_all_heads_001
Revises: 6b8a0b54a08e, a9555ad73496, add_missing_cols_001
Create Date: 2026-04-29 14:45:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'merge_all_heads_001'
down_revision: Union[str, Sequence[str], None] = ('6b8a0b54a08e', 'a9555ad73496', 'add_missing_cols_001')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
