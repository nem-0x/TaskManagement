variable "aws_region" {
  type    = string
  default = "ap-northeast-1"
}

variable "project" {
  type    = string
  default = "taskmanagement"
}

variable "db_password" {
  type      = string
  sensitive = true
}
