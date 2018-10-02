provider "google" {
  region  = "europe-west1"
  credentials = "${file("account.json")}"
  version = "~> 1.15"
}
