"""Merge heads for school and user models

Revision ID: 60e29c71ca92
Revises: 92b0abf59f61, fe9304afafb3
Create Date: 2026-04-13 16:04:23.328580

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '60e29c71ca92'
down_revision: Union[str, Sequence[str], None] = ('92b0abf59f61', 'fe9304afafb3')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
