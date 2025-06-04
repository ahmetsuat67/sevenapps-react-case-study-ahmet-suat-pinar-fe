"use client";

interface SampleSelectorProps {
  samples: string[];
  selected: string;
  onSelect: (sampleName: string) => void;
}

export default function SampleSelector({ samples, selected, onSelect }: SampleSelectorProps) {
  return (
    <select
      className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded"
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
    >
      {samples.map((sample) => (
        <option key={sample} value={sample}>
          {sample.charAt(0).toUpperCase() + sample.slice(1)}
        </option>
      ))}
    </select>
  );
}
