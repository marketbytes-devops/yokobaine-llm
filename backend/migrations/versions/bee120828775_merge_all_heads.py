"""merge_all_heads

Revision ID: bee120828775
Revises: c0d31ec1c09b, e1430dad4ea6
Create Date: 2026-04-14 10:54:22.404739

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bee120828775'
down_revision: Union[str, Sequence[str], None] = ('c0d31ec1c09b', 'e1430dad4ea6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
