
export interface DataSource {
  id: string;
  name: string;
  category: string;
  lastUpdated: string;
  status: 'active' | 'needs-update';
  format: string;
  recordCount: number;
}

export interface DataSourceListProps {
  sources: DataSource[];
  onAutoProcess: (id: string) => void;
}
