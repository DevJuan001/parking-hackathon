from fastapi import HTTPException
from app.features.entries.services.entries_service import EntriesService
from app.features.entries.models.entries_schemas import CreateEntrySchema, EntriesFiltersSchema


class EntriesController:

    @staticmethod
    def get_all_entries(filters: EntriesFiltersSchema):
        error, entries = EntriesService.get_all_entries(filters)

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": entries
        }

    @staticmethod
    def get_entry_by_id(entry_id: int):
        error, entry = EntriesService.get_entry_by_id(entry_id)

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": entry
        }

    @staticmethod
    def get_entries_by_plate(plate_id: int):
        error, entries = EntriesService.get_entries_by_plate(plate_id)

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": entries
        }

    @staticmethod
    async def create_entry(entry_data: CreateEntrySchema):
        error, success, message = await EntriesService.create_entry(entry_data)

        if error:
            raise HTTPException(status_code=400, detail=error)

        return {
            "success": success,
            "message": message,
        }
    