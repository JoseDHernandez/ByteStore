interface Props {
  columns: number;
  rows: number;
  size: number;
}
export default function TableSkeleton({ columns, rows, size }: Props) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="p-2 bg-gray-100"></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: columns }).map((_, c) => (
              <td key={c} className="p-1" height={size}>
                <div className={`h-full bg-gray-200 rounded animate-pulse `}>
                  &nbsp;
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
