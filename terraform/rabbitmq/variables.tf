variable "rmq_host" {
  type    = string
  default = "http://localhost:15672"
}

variable "rmq_username" {
  type      = string
  default   = "guest"
  sensitive = true
}

variable "rmq_password" {
  type      = string
  default   = "guest"
  sensitive = true
}

