"""Merge heads - fix branch split

Revision ID: aabb1122ccdd
Revises: 175909ed74e4, 58b5cf560ed5
Create Date: 2026-04-19 00:00:00.000000

"""
from typing import Sequence, Union

# revision identifiers, used by Alembic.
revision: str = 'aabb1122ccdd'
down_revision: Union[str, Sequence[str], None] = ('175909ed74e4', '58b5cf560ed5')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """No schema changes — merge only."""
    pass


def downgrade() -> None:
    """No schema changes — merge only."""
    pass
