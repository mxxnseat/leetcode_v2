provider "rabbitmq" {
  endpoint = var.rmq_host
  username = var.rmq_username
  password = var.rmq_password
}

terraform {
  required_providers {
    rabbitmq = {
      source  = "cyrilgdn/rabbitmq"
      version = ">= 1.8.0"
    }
  }
}