export type SupplierStatus = 'active' | 'inactive'
export type YarnWeight = 'lace' | 'fingering' | 'DK' | 'worsted' | 'bulky'
export type InventoryCategory = 'yarn' | 'needles' | 'accessories'
export type Priority = 'low' | 'medium' | 'high'
export type CardCategory = 'Workshop' | 'Order' | 'Marketing' | 'Admin' | 'Event'

export interface Supplier {
  id: string
  company_name: string
  contact_person: string | null
  email: string | null
  phone: string | null
  website: string | null
  country_of_origin: string | null
  address: string | null
  notes: string | null
  fiber_specialties: string[]
  certifications: string[]
  minimum_order_quantity: number | null
  lead_time_days: number | null
  status: SupplierStatus
  created_at: string
  updated_at: string
}

export interface InventoryItem {
  id: string
  product_name: string
  colorway: string | null
  dye_lot: string | null
  yarn_weight: YarnWeight | null
  fiber_content: string | null
  meterage_per_skein: number | null
  needle_size_recommendation: string | null
  quantity_in_stock: number
  cost_price: number | null
  retail_price: number | null
  supplier_id: string | null
  supplier?: Supplier
  low_stock_threshold: number
  category: InventoryCategory
  tags: string[]
  notes: string | null
  created_at: string
  updated_at: string
}

export interface KanbanColumn {
  id: string
  title: string
  position: number
  created_at: string
  cards?: KanbanCard[]
}

export type Assignee = 'Jenny' | 'Cissi' | 'Båda'

export interface KanbanCard {
  id: string
  column_id: string
  title: string
  description: string | null
  due_date: string | null
  priority: Priority
  category_tag: CardCategory | null
  assignee: Assignee | null
  supplier_id: string | null
  supplier?: Supplier
  inventory_id: string | null
  inventory?: InventoryItem
  moodboard_id: string | null
  moodboard?: Moodboard
  position: number
  created_at: string
  updated_at: string
}

export type MoodboardItemType = 'image' | 'color' | 'note'

export interface Moodboard {
  id: string
  title: string
  description: string | null
  tags: string[]
  created_at: string
  updated_at: string
  items?: MoodboardItem[]
}

export interface MoodboardItem {
  id: string
  moodboard_id: string
  type: MoodboardItemType
  position: number
  image_url: string | null
  color_hex: string | null
  label: string | null
  note_text: string | null
  created_at: string
}

export interface Document {
  id: string
  name: string
  description: string | null
  file_url: string
  file_path: string
  file_size: number | null
  file_type: string | null
  tags: string[]
  created_at: string
}

export interface ActivityEntry {
  id: string
  action: string
  entity_type: string
  entity_id: string | null
  entity_name: string | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      suppliers: {
        Row: Supplier
        Insert: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>>
      }
      inventory: {
        Row: InventoryItem
        Insert: Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'supplier'>
        Update: Partial<Omit<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'supplier'>>
      }
      kanban_columns: {
        Row: KanbanColumn
        Insert: Omit<KanbanColumn, 'id' | 'created_at' | 'cards'>
        Update: Partial<Omit<KanbanColumn, 'id' | 'created_at' | 'cards'>>
      }
      kanban_cards: {
        Row: KanbanCard
        Insert: Omit<KanbanCard, 'id' | 'created_at' | 'updated_at' | 'supplier' | 'inventory'>
        Update: Partial<Omit<KanbanCard, 'id' | 'created_at' | 'updated_at' | 'supplier' | 'inventory'>>
      }
      activity_feed: {
        Row: ActivityEntry
        Insert: Omit<ActivityEntry, 'id' | 'created_at'>
        Update: never
      }
    }
  }
}
