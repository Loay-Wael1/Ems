const CSV_HEADERS = [
  'Timestamp',
  'Name',
  'Phone',
  'Branch',
  'Status',
  'Notes',
  'Page',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign'
];

export function leadsToCsv(rows: Record<string, unknown>[]) {
  const body = rows.map((row) =>
    [
      row.created_at,
      row.name,
      row.phone,
      row.branch,
      row.status,
      row.notes,
      row.page,
      row.utm_source,
      row.utm_medium,
      row.utm_campaign
    ]
      .map(csvCell)
      .join(',')
  );

  return `\uFEFF${CSV_HEADERS.map(csvCell).join(',')}\r\n${body.join('\r\n')}\r\n`;
}

function csvCell(value: unknown) {
  let text = String(value ?? '');
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
