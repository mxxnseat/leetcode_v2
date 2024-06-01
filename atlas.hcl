variable "database" {
    type = string
    default = getenv("DATABASE_NAME") == "" ? "leetcode" : getenv("DATABASE_NAME")
}

variable "username" {
    type = string
    default = getenv("DATABASE_USERNAME") == "" ? "postgres" : getenv("DATABASE_USERNAME")
}

variable "password" {
    type = string
    default = getenv("DATABASE_PASSWORD") == "" ? "example" : getenv("DATABASE_PASSWORD")
}

variable "port" {
    type = string
    default = getenv("DATABASE_PORT") == "" ? "5432" : getenv("DATABASE_PORT")
}

variable "host" {
    type = string
    default = getenv("DATABASE_HOST") == "" ? "localhost" : getenv("DATABASE_HOST")
}

docker "postgres" "dev" {
    image = "postgres:16.3"
}

env "local" {
    src = "file://database/schema.hcl"
    url = "postgres://${var.username}:${var.password}@${var.host}:${var.port}/${var.database}?sslmode=disable"
    dev = docker.postgres.dev.url

    migration {
        dir = "file://database/migrations"
    }
}
