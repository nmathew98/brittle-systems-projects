terraform {
  required_providers {
    google = {
      version = "~> 4.60.0"
    }
  }

  cloud {
    organization = "dimwit_begun0n"

    workspaces {
      name = "realworld-backend-npostgres"
    }
  }
}

provider "google" {
  project = "realworld-383123"
  region  = "australia-southeast2"
  zone    = "australia-southeast2-a"
}

variable "NEON_PASSWORD" {
  type = string
}

resource "google_cloud_run_v2_service" "default" {
  name     = "realworld-backend-npostgres"
  location = "australia-southeast2"
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "naveenmathew/realworld-backend-npostgres:latest"

      env {
        name  = "JWT_ACCESS_EXPIRES"
        value = "1" # hours
      }

      env {
        name  = "JWT_REFRESH_EXPIRES"
        value = "168" # hours
      }

      env {
        name  = "JWT_ACCESS_SECRET_FILE"
        value = "/secrets/jwt_access_secret"
      }

      env {
        name  = "JWT_REFRESH_SECRET_FILE"
        value = "/secrets/jwt_refresh_secret"
      }

      env {
        name  = "JWT_INTERNAL_SECRET_FILE"
        value = "/secrets/jwt_internal_secret"
      }

      env {
        name  = "POSTGRES_HOST"
        value = "ep-purple-bonus-729849.ap-southeast-1.aws.neon.tech"
      }

      env {
        name  = "POSTGRES_USER"
        value = "nmathew98"
      }

      env {
        name  = "POSTGRES_PASSWORD"
        value = var.NEON_PASSWORD
      }

      env {
        name  = "POSTGRES_DB"
        value = "neondb"
      }

      ports {
        container_port = 8080
      }
    }
  }
}
