data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# EC2 が ECR からイメージを pull するための IAM ロール
resource "aws_iam_role" "ec2" {
  name = "${var.project}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

# SSM Session Manager でブラウザから EC2 に接続できるようにする（SSH 不要）
resource "aws_iam_role_policy_attachment" "ec2_ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.project}-ec2-profile"
  role = aws_iam_role.ec2.name
}

resource "aws_instance" "app" {
  ami                         = data.aws_ami.amazon_linux_2023.id
  instance_type               = "t3.micro"
  subnet_id                   = aws_subnet.public[0].id
  vpc_security_group_ids      = [aws_security_group.ec2.id]
  iam_instance_profile        = aws_iam_instance_profile.ec2.name
  associate_public_ip_address = true
  key_name                    = "my-aws-key"

  user_data = <<-EOF
    #!/bin/bash
    dnf update -y

    # Java 21
    dnf install -y java-21-amazon-corretto-headless

    # Nginx
    dnf install -y nginx
    systemctl enable nginx

    # nginx.conf のデフォルト server_name と競合しないようにコメントアウト
    sed -i 's/server_name  _;/# server_name  _;/' /etc/nginx/nginx.conf

    # Nginx: /api/* を Spring Boot (port 8080) にプロキシ
    cat > /etc/nginx/conf.d/app.conf <<'NGINX'
    server {
        listen 80;
        server_name _;

        location /api/ {
            proxy_pass         http://127.0.0.1:8080;
            proxy_http_version 1.1;
            proxy_set_header   Host              $host;
            proxy_set_header   X-Real-IP         $remote_addr;
            proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
            proxy_set_header   X-Forwarded-Proto $http_x_forwarded_proto;
        }
    }
    NGINX

    systemctl start nginx
  EOF

  tags = { Name = "${var.project}-app" }
}
