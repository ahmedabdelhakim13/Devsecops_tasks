# --------------------------
# VPC
# --------------------------
resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "NTI"
  }
}

# --------------------------
# Subnets
# --------------------------
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
  tags = {
    Name = "public"
  }
}

resource "aws_subnet" "backup" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.3.0/24"
  availability_zone       = "us-east-1b"  # different AZ
  map_public_ip_on_launch = true
  tags = {
    Name = "backup"
  }
}

resource "aws_subnet" "private" {
  vpc_id                  = aws_vpc.vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = false
  tags = {
    Name = "private"
  }
}

# --------------------------
# Internet Gateway
# --------------------------
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id
  tags = {
    Name = "igw"
  }
}

# --------------------------
# Public Route Table
# --------------------------
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}

# --------------------------
# EC2 AMI
# --------------------------
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# --------------------------
# IAM Role + Policy for S3
# --------------------------
resource "aws_iam_policy" "s3_write_policy" {
  name        = "S3WritePolicy"
  description = "Allow full access to a specific S3 bucket"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::my-tf-test-bucket",
          "arn:aws:s3:::my-tf-test-bucket/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role" "ec2_s3_role" {
  name = "EC2S3WriteRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_s3_write" {
  role       = aws_iam_role.ec2_s3_role.name
  policy_arn = aws_iam_policy.s3_write_policy.arn
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "EC2S3WriteProfile"
  role = aws_iam_role.ec2_s3_role.name
}

# --------------------------
# EC2 Instance
# --------------------------
resource "aws_instance" "web" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t2.micro"
  subnet_id              = aws_subnet.public.id
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  tags = {
    Name = "web-server"
  }
}

# --------------------------
# Elastic IPs
# --------------------------
resource "aws_eip" "example" {
  domain   = "vpc"
  instance = aws_instance.web.id
  tags = {
    Name = "web-eip"
  }
}

# --------------------------
# NAT Gateway
# --------------------------
resource "aws_nat_gateway" "NAT" {
  allocation_id = aws_eip.example.id
  subnet_id     = aws_subnet.public.id
  depends_on    = [aws_internet_gateway.igw]

  tags = {
    Name = "NAT"
  }
}

# --------------------------
# Load Balancer
# --------------------------
resource "aws_lb" "LoadBalancer" {
  name               = "LoadBalancer"
  internal           = false
  load_balancer_type = "application"
  subnets            = [aws_subnet.public.id, aws_subnet.backup.id] # AZs must differ

  enable_deletion_protection = true
  tags = {
    Environment = "production"
  }
}

# --------------------------
# S3 Bucket
# --------------------------
resource "aws_s3_bucket" "MY-S3-for-monitoring" {
  bucket = "my-tf-test-bucket"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}
