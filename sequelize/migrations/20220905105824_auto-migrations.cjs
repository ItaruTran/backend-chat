const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "message", deps: []
 * createTable() => "group_chats", deps: []
 * createTable() => "users", deps: []
 * createTable() => "members", deps: [group_chats]
 * createTable() => "attachments", deps: [group_chats]
 * addIndex(group_chats_owner_id) => "group_chats"
 * addIndex(group_chats_id) => "group_chats"
 * addIndex(members_member_id_group_id) => "members"
 * addIndex(attachments_group_id_created) => "attachments"
 * addIndex(attachments_message_id) => "attachments"
 *
 */

const info = {
  revision: 1,
  name: "auto-migrations",
  created: "2022-09-05T10:58:24.163Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "message",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        timestamp: {
          type: Sequelize.DATE,
          field: "timestamp",
          allowNull: false,
          primaryKey: true,
        },
        content: { type: Sequelize.STRING, field: "content" },
        sender_id: {
          type: Sequelize.UUID,
          field: "sender_id",
          allowNull: false,
        },
        friendship_id: { type: Sequelize.INTEGER, field: "friendship_id" },
        group_id: { type: Sequelize.INTEGER, field: "group_id" },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "group_chats",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          autoIncrement: true,
        },
        name: { type: Sequelize.STRING, field: "name" },
        owner_id: { type: Sequelize.UUID, field: "owner_id" },
        friend_id: { type: Sequelize.UUID, field: "friend_id" },
        group_avatar: { type: Sequelize.STRING, field: "group_avatar" },
        last_message_time: { type: Sequelize.DATE, field: "last_message_time" },
        created: { type: Sequelize.DATE, field: "created", allowNull: false },
        modified: { type: Sequelize.DATE, field: "modified", allowNull: false },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "users",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        name: { type: Sequelize.STRING, field: "name" },
        created: { type: Sequelize.DATE, field: "created", allowNull: false },
        modified: { type: Sequelize.DATE, field: "modified", allowNull: false },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "members",
      {
        member_id: {
          type: Sequelize.UUID,
          field: "member_id",
          primaryKey: true,
        },
        group_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          allowNull: true,
          field: "group_id",
          references: { key: "id", model: "group_chats" },
          primaryKey: true,
        },
        viewed_message_time: {
          type: Sequelize.DATE,
          field: "viewed_message_time",
        },
        viewed_message_id: { type: Sequelize.UUID, field: "viewed_message_id" },
        view_message_from: { type: Sequelize.DATE, field: "view_message_from" },
        created: { type: Sequelize.DATE, field: "created", allowNull: false },
        modified: { type: Sequelize.DATE, field: "modified", allowNull: false },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "attachments",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          allowNull: false,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        messageId: {
          type: Sequelize.UUID,
          field: "messageId",
          allowNull: false,
        },
        group_id: {
          type: Sequelize.INTEGER,
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          field: "group_id",
          references: { key: "id", model: "group_chats" },
          allowNull: false,
        },
        url: { type: Sequelize.STRING, field: "url", allowNull: false },
        created: { type: Sequelize.DATE, field: "created", allowNull: false },
        order: { type: Sequelize.INTEGER, field: "order" },
      },
      { transaction },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "group_chats",
      ["owner_id"],
      {
        indexName: "group_chats_owner_id",
        name: "group_chats_owner_id",
        transaction,
      },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "group_chats",
      ["id"],
      { indexName: "group_chats_id", name: "group_chats_id", transaction },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "members",
      ["member_id", "group_id"],
      {
        indexName: "members_member_id_group_id",
        name: "members_member_id_group_id",
        transaction,
      },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "attachments",
      ["group_id", "created"],
      {
        indexName: "attachments_group_id_created",
        name: "attachments_group_id_created",
        transaction,
      },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "attachments",
      ["messageId"],
      {
        indexName: "attachments_message_id",
        name: "attachments_message_id",
        transaction,
      },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["message", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["group_chats", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["members", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["attachments", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["users", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: async (queryInterface, sequelize) => {
    const { createMessageTable, messagePartition, settingDB } = await import('#sv/sql/message.js');

    await queryInterface.sequelize.query(settingDB)

    await queryInterface.sequelize.query(createMessageTable)
    await queryInterface.sequelize.query(messagePartition(false))
    await queryInterface.sequelize.query(messagePartition())

    return execute(queryInterface, sequelize, migrationCommands)
  },
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
