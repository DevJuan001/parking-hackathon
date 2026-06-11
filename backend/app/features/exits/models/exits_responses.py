from datetime import datetime
from pydantic import BaseModel


class ExitResponse(BaseModel):
    id: int
    plate: str
    created_at: datetime


class ExitStatsResponse(BaseModel):
    total_exits: int
    today_exits: int
    this_week_exits: int
    this_month_exits: int
    total_revenue: float
    today_revenue: float
    this_week_revenue: float
    this_month_revenue: float
