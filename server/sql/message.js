const moment = require("moment");

exports.createMessageTable = `
SET enable_partition_pruning = on;
CREATE TABLE IF NOT EXISTS message (
  id  serial,
  timestamp  timestamp with time zone,
  content  text,
  attachment_type  integer,
  attachment  text,
  sender_id  integer not null,
  friendship_id  integer not null,
  CONSTRAINT message_pkey PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

CREATE INDEX IF NOT EXISTS ON message(id);
CREATE INDEX IF NOT EXISTS ON message(timestamp);
CREATE INDEX IF NOT EXISTS ON message(user_id);
CREATE INDEX IF NOT EXISTS ON message(conversation_id);`;

exports.messagePartition = () => {
  const time = moment.utc().set({
      date: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }).add(1, 'months')
  return `
CREATE TABLE IF NOT EXISTS message_${time.format('yyyyMM')} PARTITION OF message
  FOR VALUES FROM ('${time.format('yyyy-MM')}-01 00:00:00') TO ('${time.add(1, 'months').format('yyyy-MM')}-01 00:00:00');`
}
