import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataTableHeaderProps {
  headers: string[]
}

export function DataTableHeader({ headers }: DataTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        {headers?.map((header) => (
          <TableHead key={header} className="font-semibold">
            {header}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )
} 