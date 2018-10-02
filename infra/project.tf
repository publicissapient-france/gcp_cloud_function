resource "google_project" "project" {
  count = "${length(local.projects)}"
  name = "${lookup(local.projects[count.index], "name")}"
  project_id = "${lookup(local.projects[count.index], "name")}"
  policy_data = "${data.google_iam_policy.role.policy_data}"
  folder_id = "??"
  billing_account = "??"
}


data "google_iam_policy" "role" {
  binding {
    role = "roles/editor"

    members = "${lookup(local.projects[count.index], "user")}"
  }
}

# Enable Services APIs on the project
resource "google_project_services" "project_services" {
  project = "${google_project.project.project_id}"

  services = [
    "pubsub.googleapis.com",
    "bigquery-json.googleapis.com",
  ]
}

locals {

  projects = [
    {
      name = "tc-drone-jb"
      user = "jbclaramonte@xebia.fr"
    },
    {
      name = "tc-drone-nicol"
      user = "ndechandon@xebia.fr"
    }
  ]
}