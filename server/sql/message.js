import moment from "moment";


export const settingDB = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SET enable_partition_pruning = on;`;

export const createMessageTable = `
CREATE TABLE IF NOT EXISTS message (
  id  UUID not null,
  timestamp  timestamp with time zone DEFAULT current_timestamp,
  content  text,
  sender_id  UUID not null,
  friendship_id  integer,
  group_id  integer,
  CONSTRAINT message_pkey PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);
CREATE INDEX if not EXISTS idx_message_group_id_timestamp
ON message (group_id, timestamp DESC);
`;

export function messagePartition(nextYear = true) {
  let time = moment.utc().startOf('year')
  if (nextYear)
    time.add(1, 'years')

  return `
CREATE UNLOGGED TABLE IF NOT EXISTS message_${time.format('yyyy')} PARTITION OF message
  FOR VALUES FROM ('${time.format('yyyy-MM')}-01 00:00:00') TO ('${time.add(1, 'years').format('yyyy-MM')}-01 00:00:00');`
}
