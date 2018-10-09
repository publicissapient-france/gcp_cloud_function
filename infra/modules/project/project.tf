resource "google_project" "project-drone" {

  project_id = "${var.project-name}"

  name = "${var.project-name}"

  folder_id = "${var.folder-id}"
  billing_account = "${var.billing-account}"
}

# Enable Services APIs on the project
resource "google_project_services" "project_services" {

  project = "${var.project-name}"

  services = [
    "pubsub.googleapis.com",
    "cloudfunctions.googleapis.com",
  ]
}


resource "google_project_iam_binding" "pubsub" {
  project     = "${var.project-name}"
  role = "roles/pubsub.admin"

  members = [
    "${var.users}",
  ]
}

resource "google_project_iam_binding" "cloudfunctions" {
  project     = "${var.project-name}"
  role = "roles/cloudfunctions.developer"

  members = [
    "${var.users}",
  ]
}

resource "google_project_iam_binding" "owner" {
  project     = "${var.project-name}"
  role = "roles/owner"

  members = [
    "user:jbclaramonte@xebia.fr","user:ndechandon@xebia.fr","user:aletaxin@xebia.fr"
  ]
}