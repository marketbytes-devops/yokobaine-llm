"""Add missing timetable columns

Revision ID: add_missing_cols_001
Revises: 6b8a0b54a08e
Create Date: 2026-04-29 13:25:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'add_missing_cols_001'
down_revision: Union[str, Sequence[str], None] = '4e588e685ea8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [c['name'] for c in inspector.get_columns('timetable_configs')]
    
    if 'duration' not in columns:
        op.add_column('timetable_configs', sa.Column('duration', sa.Integer(), nullable=True, server_default='45'))
    if 'start_time' not in columns:
        op.add_column('timetable_configs', sa.Column('start_time', sa.String(length=20), nullable=True, server_default='08:30 AM'))
    if 'end_time' not in columns:
        op.add_column('timetable_configs', sa.Column('end_time', sa.String(length=20), nullable=True, server_default='03:30 PM'))
    if 'breaks' not in columns:
        op.add_column('timetable_configs', sa.Column('breaks', sa.JSON(), nullable=True))
    if 'drill_periods' not in columns:
        op.add_column('timetable_configs', sa.Column('drill_periods', sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column('timetable_configs', 'drill_periods')
    op.drop_column('timetable_configs', 'breaks')
    op.drop_column('timetable_configs', 'end_time')
    op.drop_column('timetable_configs', 'start_time')
    op.drop_column('timetable_configs', 'duration')
