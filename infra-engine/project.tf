resource "google_project" "drone-engine" {
  project_id = "drone-engine"

  name = "${var.project}"

  folder_id = "902740354787"

  billing_account = "002C54-030B48-27C3F8"
}

resource "google_project_services" "project" {
  project  = "${var.project}"
  services = ["pubsub.googleapis.com", "cloudfunctions.googleapis.com"]
}
