resource "google_project" "project-drone" {

  count = "${length(local.projects)}"
  project_id = "${lookup(local.projects[count.index], "name")}"

  name = "${lookup(local.projects[count.index], "name")}"

  folder_id = "114471209490"
  billing_account = "01ED3C-B7175E-FDF392"
}

# Enable Services APIs on the project
resource "google_project_services" "project_services" {
  count = "${length(local.projects)}"
  project = "${lookup(local.projects[count.index], "name")}"

  services = [
    "pubsub.googleapis.com",
    "cloudfunctions.googleapis.com "
  ]
}


resource "google_project_iam_binding" "pubsub" {
  count = "${length(local.projects)}"
  project     = "${lookup(local.projects[count.index], "name")}"
  role = "roles/pubsub.admin"

  members = [
    "${lookup(local.projects[count.index], "user")}",
  ]
}

resource "google_project_iam_binding" "cloudfunctions" {
  count = "${length(local.projects)}"
  project     = "${lookup(local.projects[count.index], "name")}"
  role = "roles/cloudfunctions.developer"

  members = [
    "${lookup(local.projects[count.index], "user")}",
  ]
}

resource "google_project_iam_binding" "owner" {
  count = "${length(local.projects)}"
  project     = "${lookup(local.projects[count.index], "name")}"
  role = "roles/owner"

  members = [
    "user:jbclaramonte@xebia.fr","user:ndechandon@xebia.fr","user:aletaxin@xebia.fr"
  ]
}