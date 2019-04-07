resource "google_pubsub_topic" "drone-events" {
  project = "${var.project}"
  name    = "drone-events"
}

resource "google_pubsub_topic" "drone-command" {
  project = "${var.project}"
  name    = "drone-command"
}
