function VariantSelector({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`px-4 py-2 border rounded-lg ${
              selected === option
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default VariantSelector;
