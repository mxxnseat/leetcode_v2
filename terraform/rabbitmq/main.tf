resource "rabbitmq_vhost" "leetcode" {
  name = "leetcode"
}


resource "rabbitmq_permissions" "admin" {
  user  = var.rmq_username
  vhost = rabbitmq_vhost.leetcode.name

  permissions {
    configure = ".*"
    write     = ".*"
    read      = ".*"
  }
}

resource "rabbitmq_exchange" "tests" {
  name  = "tests"
  vhost = rabbitmq_permissions.admin.vhost

  settings {
    type        = "topic"
    durable     = true
    auto_delete = false
  }
}

resource "rabbitmq_exchange" "judges" {
  name  = "judges"
  vhost = rabbitmq_permissions.admin.vhost

  settings {
    type        = "topic"
    durable     = true
    auto_delete = false
  }
}

resource "rabbitmq_exchange" "problems" {
  name  = "problems"
  vhost = rabbitmq_permissions.admin.vhost

  settings {
    type        = "topic"
    durable     = true
    auto_delete = false
  }
}

resource "rabbitmq_exchange" "comments" {
  name  = "comments"
  vhost = rabbitmq_permissions.admin.vhost

  settings {
    type        = "direct"
    durable     = true
    auto_delete = false
  }
}

