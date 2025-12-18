terraform{
    required_providers {
      aws = {
        source = "hashicorp/aws"
        version = "~>5.0" #~ brings the latest version [minor which start with 5]
      } 
    }
    
}
provider "aws" {
  region = "us-east-1"
}
