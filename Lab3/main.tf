module "vpc" {
  source            = "./VPC"              # Path to the vpc module directory
  VPC   = "new-vpc"
  vpc_cidr  = "10.0.0.0/16"
  

  subnet_cidr = [
    "10.0.0.0/25",
    "10.0.1.0/24",
    "10.0.2.0/26"
  ]
}
