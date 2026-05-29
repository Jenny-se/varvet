import { supabase } from './supabase'

export async function logActivity(
  action: string,
  entityType: string,
  entityId?: string,
  entityName?: string
) {
  await supabase.from('activity_feed').insert({
    action,
    entity_type: entityType,
    entity_id: entityId ?? null,
    entity_name: entityName ?? null,
  })
}
