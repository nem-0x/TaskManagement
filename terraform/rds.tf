data "aws_subnet" "private_legacy" {
  id = "subnet-04b2dc787efab309b"
}

resource "aws_db_subnet_group" "main" {
  name = "${var.project}-db-subnet-group"
  # RDS の ENI がプライベートサブネットを使用中のため、解放されるまで混在構成で運用する
  subnet_ids = [
    data.aws_subnet.private_legacy.id,
    aws_subnet.public[0].id,
  ]

  tags = { Name = "${var.project}-db-subnet-group" }
}

resource "aws_db_instance" "main" {
  identifier        = "${var.project}-db"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  storage_type      = "gp2"
  storage_encrypted = true

  db_name  = "taskmanagement"
  username = "dbadmin"
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false
  multi_az               = false

  backup_retention_period = 7
  skip_final_snapshot     = true
  deletion_protection     = false

  tags = { Name = "${var.project}-db" }
}
