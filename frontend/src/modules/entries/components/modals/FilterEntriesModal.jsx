import { useFilterEntries } from "../../hooks/useFilterEntries";
import SelectMenu from "../../../../globals/components/modals/SelectMenu";
import FilterModal from "../../../../globals/components/modals/FilterModal";

export default function FilterEntriesModal({ filters, setFilters, onClose }) {
  const { handleChange } = useFilterEntries(setFilters);

  return (
    <FilterModal
      onClose={onClose}
      orderByStartDateValue={filters.start_date}
      orderByStartDateOnChange={handleChange}
      orderByFinishDateValue={filters.end_date}
      orderByFinishDateOnChange={handleChange}
      applyButtonOnClick={onClose}
      seeCleanFiltersButton={Object.keys(filters).length > 0}
      cleanFiltersOnClick={() => setFilters({})}
    >
      <div className="flex flex-col">
        <SelectMenu
          id={"plates-menu"}
          spanText={"Placa"}
          value={filters.plate_id}
          onChange={handleChange}
        />
      </div>
    </FilterModal>
  );
}
