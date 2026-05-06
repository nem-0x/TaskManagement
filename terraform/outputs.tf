output "cloudfront_url" {
  description = "Application URL (CloudFront)"
  value       = "https://${aws_cloudfront_distribution.main.domain_name}"
}

output "ec2_public_ip" {
  description = "EC2 public IP address"
  value       = aws_instance.app.public_ip
}

output "rds_endpoint" {
  description = "RDS endpoint (host:port)"
  value       = aws_db_instance.main.endpoint
}
