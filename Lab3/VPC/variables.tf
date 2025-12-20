variable "VPC" {
  type        = string
  description = "VPC"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
}

variable "subnet_cidr" {
  type        = list
  description = "CIDR block for the subnet"
}