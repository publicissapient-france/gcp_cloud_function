resource "google_project" "project-drone" {

  count = "${length(local.projects)}"
  project_id = "${lookup(local.projects[count.index], "name")}"

  name = "${lookup(local.projects[count.index], "name")}"

  folder_id = "114471209490"
  billing_account = "01ED3C-B7175E-FDF392"
}

resource "google_project_iam_policy" "project-iam" {
  project     = "${lookup(local.projects[count.index], "name")}"
  policy_data = "${data.google_iam_policy.specific-role.policy_data}"
}


data "google_iam_policy" "specific-role" {
  binding {
    role = "roles/cloudfunctions.developer"

    members = [
       "${lookup(local.projects[count.index], "user")}",
    ]
  }
  binding {
    role = "roles/pubsub.admin"

    members = [
      "${lookup(local.projects[count.index], "user")}",
    ]
  }
  binding {
    role = "roles/owner"

    members = [
      "${lookup(local.projects[count.index], "user")}",
    ]
  }

}

# Enable Services APIs on the project
resource "google_project_services" "project_services" {
  project = "${lookup(local.projects[count.index], "name")}"

  services = [
    "bigquery-json.googleapis.com",
  ]
}

