schema "public" {}

function "get_timestamp" {
  schema = schema.public
  lang   = SQL
  return = integer
  as     = <<-SQL
        select extract(epoch from now()) 
        SQL
}

enum "user_role" {
  schema = schema.public
  values = ["user", "admin"]
}
enum "problem_status" {
  schema = schema.public
  values = ["pending", "canceled", "approved"]
}

table "users" {
  schema = schema.public
  column "id" {
    null = false
    type = varchar(64)
  }
  column "nickname" {
    null = false
    type = varchar(64)
  }
  column "role" {
    null = false
    type = enum.user_role
  }
  column "email" {
    null = true
    type = varchar(255)
  }
  column "clerk_user_id" {
    null = false
    type = varchar(64)
  }
  column "created_at" {
    null    = false
    type    = integer
    default = sql("get_timestamp()")
  }
  column "updated_at" {
    null    = false
    type    = integer
    default = sql("get_timestamp()")
  }

  primary_key {
    columns = [column.id]
  }
  unique "nickname" {
    columns = [column.nickname]
  }
  unique "email" {
    columns = [column.email]
  }
}

table "problems" {
  schema = schema.public
  column "id" {
    null = false
    type = varchar(64)
  }
  column "title" {
    null = false
    type = varchar(1024)
  }
  column "status" {
    null    = false
    type    = enum.problem_status
    default = "pending"
  }
  column "description" {
    null = false
    type = text
  }
  column "created_by" {
    null = false
    type = varchar(64)
  }
  column "algorithm" {
    null = false
    type = text
  }
  column "inputs" {
    null = false
    type = text
  }
  column "created_at" {
    null    = false
    type    = integer
    default = sql("get_timestamp()")
  }
  column "updated_at" {
    null    = false
    type    = integer
    default = sql("get_timestamp()")
  }

  primary_key {
    columns = [column.id]
  }
  foreign_key "created_by" {
    columns     = [column.created_by]
    ref_columns = [table.users.column.id]
    on_delete   = CASCADE
  }
}

table "judges" {
  schema = schema.public
  column "id" {
    null = false
    type = varchar(64)
  }
  column "problem" {
    null = false
    type = varchar(64)
  }
  column "algorithm" {
    null = false
    type = text
  }
  column "success" {
    null = false
    type = boolean
  }
  column "user" {
    null = false
    type = varchar(64)
  }
  column "failed_reason" {
    null = true
    type = text
  }
  column "created_at" {
    null    = false
    type    = integer
    default = sql("get_timestamp()")
  }
  column "updated_at" {
    null    = false
    type    = integer
    default = sql("get_timestamp()")
  }

  primary_key {
    columns = [column.id]
  }
  foreign_key "problem" {
    columns     = [column.problem]
    ref_columns = [table.problems.column.id]
    on_delete   = CASCADE
  }
  foreign_key "user" {
    columns     = [column.user]
    ref_columns = [table.users.column.id]
    on_delete   = CASCADE
  }
}
