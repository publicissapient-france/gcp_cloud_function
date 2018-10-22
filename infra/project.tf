resource "google_project" "project-drone" {

  count = "${length(local.projects)}"
  project_id = "${lookup(local.projects[count.index], "name")}"

  name = "${lookup(local.projects[count.index], "name")}"

  folder_id = "114471209490"
  billing_account = "01B705-4E0341-A7506B"
}

# Enable Services APIs on the project
resource "google_project_services" "project_services" {
  count = "${length(local.projects)}"
  project = "${lookup(local.projects[count.index], "name")}"

  services = [
    "pubsub.googleapis.com",
    "cloudfunctions.googleapis.com",
    "storage-api.googleapis.com",
    "logging.googleapis.com",
    "storage-component.googleapis.com"
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
//
//resource "google_project_iam_binding" "project" {
//  count = "${length(local.projects)}"
//  project     = "${lookup(local.projects[count.index], "name")}"
//  role    = "roles/pubsub.publisher"
//
//  members = [
//    "group:allUsers",
//  ]
//}

resource "google_project_iam_member" "editor" {
  count = "${length(local.projects)}"
  project     = "${lookup(local.projects[count.index], "name")}"
  role = "roles/editor"

  member = "${lookup(local.projects[count.index], "user")}",

}

resource "google_project_iam_binding" "owner" {
  count = "${length(local.projects)}"
  project     = "${lookup(local.projects[count.index], "name")}"
  role = "roles/owner"

  members = [
    "user:jbclaramonte@xebia.fr","user:ndechandon@xebia.fr","user:aletaxin@xebia.fr"
  ]
}

//module "project-test-jbc" {
//  count = "${length(local.projects)}"
//  project-name = "${lookup(local.projects[count.index], "name")}"
//  source          = "modules/project"
//  folder-id       = "114471209490"
//  billing-account = "01ED3C-B7175E-FDF392"
//  users           = ["${lookup(local.projects[count.index], "user")}""]
//}