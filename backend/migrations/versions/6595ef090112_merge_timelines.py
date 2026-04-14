"""merge_timelines

Revision ID: 6595ef090112
Revises: 60e29c71ca92, e1430dad4ea6
Create Date: 2026-04-14 12:00:06.872967

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6595ef090112'
down_revision: Union[str, Sequence[str], None] = ('60e29c71ca92', 'e1430dad4ea6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
