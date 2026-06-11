import { useFilterExits } from "../../hooks/useFilterExits";
import SelectMenu from "../../../../globals/components/modals/SelectMenu";
import FilterModal from "../../../../globals/components/modals/FilterModal";

export default function FilterExitsModal({ filters, setFilters, onClose }) {
  const { handleChange } = useFilterExits(setFilters);

  return (
    <FilterModal
      orderByStartDateValue={filters.start_date}
      orderByStartDateOnChange={handleChange}
      orderByFinishDateValue={filters.end_date}
      orderByFinishDateOnChange={handleChange}
      applyButtonOnClick={() => {
        setFilters({ ...filters });
        onClose();
      }}
      seeCleanFiltersButton={Object.keys(filters).length > 0}
      cleanFiltersOnClick={() => {
        setFilters({});
        onClose();
      }}
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
