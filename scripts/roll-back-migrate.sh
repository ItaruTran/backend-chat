
set -e

echo 'Enter DB url'
read DB

SCRIPT=$(npx prisma migrate diff --from-url $DB --to-schema-datamodel prisma/schema.prisma --shadow-database-url $DB  --script)

echo 'Revert script'

# echo $SCRIPT

echo "$SCRIPT" | npx prisma db execute --url $DB --stdin
