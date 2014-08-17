# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140817143057) do

  create_table "accounting_records", force: true do |t|
    t.integer  "accounting_transaction_id"
    t.integer  "user_id"
    t.float    "amount"
    t.string   "account_name"
    t.string   "account_type"
    t.string   "record_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "accounting_records", ["accounting_transaction_id"], name: "index_accounting_records_on_accounting_transaction_id"
  add_index "accounting_records", ["user_id"], name: "index_accounting_records_on_user_id"

  create_table "accounting_transactions", force: true do |t|
    t.integer  "user_id"
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sessions", force: true do |t|
    t.integer  "user_id"
    t.string   "remember_token"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["user_id"], name: "index_sessions_on_user_id"

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "password_digest"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true

end
