const { utc } = require("moment");

exports.settingDB = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SET enable_partition_pruning = on;`

exports.createMessageTable = `
CREATE TABLE IF NOT EXISTS message (
  id  serial,
  timestamp  timestamp with time zone DEFAULT current_timestamp,
  content  text,
  attachment_type  integer,
  attachment  text,
  sender_id  integer not null,
  friendship_id  integer not null,
  CONSTRAINT message_pkey PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

CREATE INDEX IF NOT EXISTS message_id_idx ON message(id);
CREATE INDEX IF NOT EXISTS message_timestamp_idx ON message(timestamp);
CREATE INDEX IF NOT EXISTS message_sender_id_idx ON message(sender_id);
CREATE INDEX IF NOT EXISTS message_friendship_id_idx ON message(friendship_id);`;

exports.messagePartition = function (nextYear = true) {
  let time = utc().startOf('year')
  if (nextYear)
    time.add(1, 'years')

  return `
CREATE TABLE IF NOT EXISTS message_${time.format('yyyy')} PARTITION OF message
  FOR VALUES FROM ('${time.format('yyyy-MM')}-01 00:00:00') TO ('${time.add(1, 'years').format('yyyy-MM')}-01 00:00:00');`
}
