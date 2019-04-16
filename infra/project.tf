resource "google_project" "project-drone" {
  count = "${length(var.projects)}"
  project_id = "devoxx-${var.date}-${count.index}"

  name = "${var.projects[count.index]}"

  folder_id = "114471209490"
  billing_account = "002C54-030B48-27C3F8"
}

# Enable Services APIs on the project
resource "google_project_services" "project_services" {
  count = "${length(var.projects)}"
  project = "devoxx-${var.date}-${count.index}"

  services = [
    "pubsub.googleapis.com",
    "cloudfunctions.googleapis.com",
    "storage-api.googleapis.com",
    "logging.googleapis.com",
    "storage-component.googleapis.com"
  ]
}


resource "google_project_iam_binding" "pubsub" {
  count = "${length(var.projects)}"
  project     = "devoxx-${var.date}-${count.index}"
  role = "roles/pubsub.admin"

  members = "${var.users[count.index]}"
}

resource "google_project_iam_binding" "cloudfunctions" {
  count = "${length(var.projects)}"
  project     = "devoxx-${var.date}-${count.index}"
  role = "roles/cloudfunctions.developer"

  members = "${var.users[count.index]}"
}

resource "google_project_iam_binding" "editor" {
  count = "${length(var.projects)}"
  project     = "devoxx-${var.date}-${count.index}"
  role = "roles/editor"

  members = "${var.users[count.index]}"

}

resource "google_project_iam_binding" "owner" {
  count = "${length(var.projects)}"
  project     = "devoxx-${var.date}-${count.index}"
  role = "roles/owner"

  members = [
    "user:jbclaramonte@xebia.fr","user:ndechandon@xebia.fr","user:aletaxin@xebia.fr"
  ]
}