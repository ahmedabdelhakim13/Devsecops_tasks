resource "aws_vpc" "new_vpc" {
  cidr_block = var.vpc_cidr

  tags = {
    Name = var.VPC
  }
}

resource "aws_subnet" "public_subnet" {
  count = length(var.subnet_cidr)

  vpc_id     = aws_vpc.new_vpc.id
  cidr_block = var.subnet_cidr[count.index]

  tags = {
    Name = "public-subnet-${count.index + 1}"
  }
}
