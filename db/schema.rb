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

ActiveRecord::Schema.define(version: 20140819065451) do

  create_table "account_books", force: true do |t|
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accounting_records", force: true do |t|
    t.integer  "accounting_transaction_id"
    t.float    "amount"
    t.string   "account_name"
    t.string   "account_type"
    t.string   "record_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "account_book_id"
  end

  add_index "accounting_records", ["accounting_transaction_id", "record_type"], name: "index_accounting_records_on_transactions_and_record_type", using: :btree
  add_index "accounting_records", ["accounting_transaction_id"], name: "index_accounting_records_on_accounting_transaction_id", using: :btree
  add_index "accounting_records", ["user_id", "account_name"], name: "index_accounting_records_on_user_id_and_account_name", using: :btree
  add_index "accounting_records", ["user_id", "account_type"], name: "index_accounting_records_on_user_id_and_account_type", using: :btree
  add_index "accounting_records", ["user_id"], name: "index_accounting_records_on_user_id", using: :btree

  create_table "accounting_transactions", force: true do |t|
    t.string   "description"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "account_book_id"
    t.integer  "author_id"
  end

  add_index "accounting_transactions", ["created_at"], name: "index_accounting_transactions_on_created_at", using: :btree
  add_index "accounting_transactions", ["description"], name: "index_accounting_transactions_on_description", using: :btree
  add_index "accounting_transactions", ["user_id", "created_at"], name: "index_accounting_transactions_on_user_id_and_created_at", using: :btree
  add_index "accounting_transactions", ["user_id"], name: "index_accounting_transactions_on_user_id", using: :btree

  create_table "sessions", force: true do |t|
    t.integer  "user_id"
    t.string   "remember_token"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["remember_token"], name: "index_sessions_on_remember_token", using: :btree
  add_index "sessions", ["user_id"], name: "index_sessions_on_user_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "password_digest"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree

  create_table "users_editable_account_books", id: false, force: true do |t|
    t.integer "user_id"
    t.integer "account_book_id"
  end

  add_index "users_editable_account_books", ["account_book_id"], name: "index_users_editable_account_books_on_account_book_id"
  add_index "users_editable_account_books", ["user_id", "account_book_id"], name: "index_editable_account_book_on_user_account_book"
  add_index "users_editable_account_books", ["user_id"], name: "index_users_editable_account_books_on_user_id"

  create_table "users_viewable_account_books", id: false, force: true do |t|
    t.integer "user_id"
    t.integer "account_book_id"
  end

  add_index "users_viewable_account_books", ["account_book_id"], name: "index_users_viewable_account_books_on_account_book_id"
  add_index "users_viewable_account_books", ["user_id", "account_book_id"], name: "index_viewable_account_books_user_account_book"
  add_index "users_viewable_account_books", ["user_id"], name: "index_users_viewable_account_books_on_user_id"

end
