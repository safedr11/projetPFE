import { ChartData, ChartType } from 'chart.js';

// Generate a larger palette of distinct colors
export function generateColors(count: number): string[] {
  const colorPalette = [
    'rgba(75, 192, 192, 0.6)',  // Teal
    'rgba(255, 99, 132, 0.6)',  // Pink
    'rgba(54, 162, 235, 0.6)',  // Blue
    'rgba(153, 102, 255, 0.6)', // Purple
    'rgba(255, 159, 64, 0.6)',  // Orange
    'rgba(255, 205, 86, 0.6)',  // Yellow
    'rgba(102, 187, 106, 0.6)', // Green
    'rgba(239, 83, 80, 0.6)',   // Red
    'rgba(171, 71, 188, 0.6)',  // Deep Purple
    'rgba(66, 165, 245, 0.6)',  // Light Blue
  ];
  return Array.from({ length: count }, (_, i) => colorPalette[i % colorPalette.length]);
}

export function prepareChartData(
  stats: { [key: string]: number },
  label: string,
  baseColor: string, // Base color for bar charts
  chartType: ChartType
): ChartData<'bar'> | ChartData<'pie'> {
  const labels = Object.keys(stats) || [];
  const data = Object.values(stats);

  if (chartType === 'pie') {
    // For pie charts, generate a unique color for each segment
    const segmentColors = generateColors(labels.length);
    return {
      labels,
      datasets: [
        {
          data,
          label,
          backgroundColor: segmentColors, // Use distinct colors for each segment
          borderColor: segmentColors.map(c => c.replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    } as ChartData<'pie'>;
  }

  // For bar charts, use a single color
  return {
    labels,
    datasets: [
      {
        data,
        label,
        backgroundColor: baseColor,
        borderColor: baseColor.replace('0.6', '1'),
        borderWidth: 1,
      },
    ],
  } as ChartData<'bar'>;
}